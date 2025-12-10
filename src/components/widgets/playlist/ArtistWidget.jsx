import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { spotifyRequest } from '@/lib/spotify';

import '../../Widgets.css';

function ArtistWidget({ onSelect, selectedItems }) {
    const router = useRouter();
    const [data, setData] = useState(null);

    const search = useRef(null);
    const [isSearch, setIsSearch] = useState(false);
    const sel = useRef(null);
    const [isSel, setIsSel] = useState(false);

    async function handleLoad(){
        const artists = await spotifyRequest(`https://api.spotify.com/v1/me/top/artists`);
        setData(artists);
    }

    useEffect(() => {
        handleLoad()
    }, [router])

    async function handleSearch(){
        if (!isSearch || search.current.value.length === 0) {
            handleLoad();
            return;
        }

        const artists = await spotifyRequest(`https://api.spotify.com/v1/search?type=artist&q=${search.current.value}&limit=20`);
        setData(artists.artists);
    }

    function handleSelection(){
        if (!isSel) {
            handleLoad();
            return;
        }

        let artists = JSON.parse(localStorage.getItem('artists_selected'));
        if (artists == null) artists = {items:[]};

        setData(artists);
        localStorage.setItem('artists_selected', JSON.stringify(artists));
    }

    function handleImg(artist){
        if(!isSel && selectedItems.length >= 5) return;
        onSelect(artist, isSel, 'artist');
        if(isSel) handleSelection();
    }

    function handleClick(ref){
        switch(ref){
            case sel:
                toggle(sel)
                break;
            case search:
                toggle(search)
                break;
            default:
                break;
        }
    }

    async function toggle(ref, load){
        if (ref == sel) {
            if (isSel) {
                setIsSel(false);
                sel.current.src = "/CheckO.png"
            } else {
                if(isSearch) await toggle(search, false)
                setIsSel(true);
                sel.current.src = "/CheckF.png"
            }
        }
        else if (ref == search){
            if (isSearch){
                setIsSearch(false);
                search.current.style.display = "none";
                search.current.value = "";
                if (load == null || load == true) handleLoad()
            }
            else{
                if(isSel) await toggle(sel)
                setIsSearch(true);
                search.current.style.display = "block";
                search.current.focus();
            }
        }
    }

    useEffect(() => {
        handleSelection();
    }, [isSel]);

    return(
        <>
            {data != null ?
                <div className="BoxWidget">
                    <header>
                        <h3>Artistas</h3>
                        <img ref={sel} src={'/CheckO.png'} onClick={() => handleClick(sel)} />
                        <img src={'/Glass.png'} onClick={() => handleClick(search)} />
                        <input ref={search} type="search" onChange={() => handleSearch()} />
                    </header>
                    <div className="BoxWidgetContent">
                        {data.items.length > 0 ? data.items.map((artist) => (
                            <div key={artist.id} className="Item">
                                {artist.name ? <p>{artist.name}</p> : null}
                                {<img src={artist.images[0]?.url ?? '/DefUser.png'} alt={artist.name} title={artist.name} onClick={() => handleImg(artist)} />}
                            </div>
                        )) : <span><h3>No has seleccionado ningún artista.</h3></span>}
                    </div>
                </div>
            : null}
        </>
    );
}

export default ArtistWidget;