import {useEffect, useRef, useState} from 'react';
import { useRouter } from 'next/navigation';
import { spotifyRequest } from '@/lib/spotify';

import '../../Widgets.css';

function DecadeWidget() {
    const router = useRouter();
    const [data, setData] = useState(null);

    const header = useRef(null);
    const search = useRef(null);
    const [isSearch, setIsSearch] = useState(false);
    const fav = useRef(null);
    const [isFav, setIsFav] = useState(true);

    async function handleLoad(){
        const tracks = await spotifyRequest(`https://api.spotify.com/v1/me/top/tracks`);
        setData(tracks);
    }

    async function handleSearch(){
        if (!isSearch || search.current.value.length === 0) {
            handleLoad();
            return;
        }

        const tracks = await spotifyRequest(`https://api.spotify.com/v1/search?type=track&q=${search.current.value}&limit=20`);
        setData(tracks.tracks);
    }

    function handleFavorites(){
        if (!isFav) {
            handleLoad();
            return;
        }

        let pl = JSON.parse(localStorage.getItem('playlist'));
        if (pl == null){
            pl = {items: []};
            localStorage.setItem('playlist', JSON.stringify(pl));
        }
        setData(pl);

    }

    function handleImg(track){
        let pl = JSON.parse(localStorage.getItem('playlist'));

        if (isFav) {
            const filtered = pl.items.filter(item => item.id != track.id);
            pl.items = filtered;
            localStorage.setItem('playlist', JSON.stringify(pl));
            handleFavorites();
        }
        else{
            const filtered = pl.items.filter(item => item.id == track.id);
            if (filtered.length == 0) pl.items.push(track);
            localStorage.setItem('playlist', JSON.stringify(pl));
        }
    }

    function handleClick(ref){
        switch(ref){
            case fav:
                toggle(fav)
                break;
            case search:
                toggle(search)
                break;
            default:
                break;
        }
    }

    async function toggle(ref, load){
        if (ref == fav) {
            if (isFav) {
                setIsFav(false);
                fav.current.src = "/NoteO.png"
                header.current.innerText = "Añade canciones"
                handleLoad();
            } else {
                if(isSearch) await toggle(search, false)
                setIsFav(true);
                fav.current.src = "/NoteF.png"
                header.current.innerText = "Canciones"
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
                if(isFav) await toggle(fav)
                setIsSearch(true);
                search.current.style.display = "block";
                search.current.focus();
            }
        }
    }

    useEffect(() => {
        handleFavorites();
    }, [router, isFav]);

    function handleMouseEnter(elem){
        let color = "var(--primary)"
        if (isFav) color = "red"
        elem.style.border = "10px solid " + color;
    }

    function handleMouseLeave(elem){
        elem.style.border = "none";
    }

    return(
        <>
            {data != null?
                <div className="BoxWidget">
                    <header>
                        <h3 ref={header}>Canciones</h3>
                        <img ref={fav} src={'/NoteF.png'} onClick={() => handleClick(fav)} />
                        <img src={'/Glass.png'} onClick={() => handleClick(search)} />
                        <input ref={search} type="search" onChange={() => handleSearch()} />
                    </header>
                    <div className="BoxWidgetContent">
                        {data.items.length > 0 ? data.items.map((track) => (
                            <div key={track.id} className="Item">
                                {track.name ? <p>{track.name}</p> : null}
                                {track.album.images[0] ? <img src={track.album.images[0].url} alt={track.name} title={track.name} onClick={() => handleImg(track)}
                                onMouseEnter={(e) => handleMouseEnter(e.target)} onMouseLeave={(e) => handleMouseLeave(e.target)}/> : null}
                            </div>
                        )) :  <span><h3>Tu playlist está vacía :( {isFav}</h3></span>}
                    </div>
                </div>
            : null}
        </>
    );
}

export default DecadeWidget;