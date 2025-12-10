import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { spotifyRequest } from '@/lib/spotify';

import '../Widgets.css';

function ArtistWidget() {
    const router = useRouter();
    const [data, setData] = useState(null);

    const content = useRef(null);
    const search = useRef(null);
    const [isSearch, setIsSearch] = useState(false);
    const fav = useRef(null);
    const [isFav, setIsFav] = useState(false);

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

    function handleFavorites(){
        if (!isFav) {
            handleLoad();
            return;
        }

        let artists = JSON.parse(localStorage.getItem('artists_favorites'));
        if (artists == null) artists = {items:[]};

        setData(artists);
        localStorage.setItem('artists_favorites', JSON.stringify(artists));
    }

    function handleImg(artist){
        let artists = JSON.parse(localStorage.getItem('artists_favorites'));
        if (artists == null) artists = {items:[]};

        if (isFav) {
            const filtered = artists.items.filter(item => item.id != artist.id);
            artists.items = filtered;
            localStorage.setItem('artists_favorites', JSON.stringify(artists));
            handleFavorites();
        }
        else{
            const filtered = artists.items.filter(item => item.id == artist.id);
            if (filtered.length == 0) artists.items.push(artist);
            localStorage.setItem('artists_favorites', JSON.stringify(artists));
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
                fav.current.src = "/HeartO.png"
            } else {
                if(isSearch) await toggle(search, false)
                setIsFav(true);
                fav.current.src = "/HeartF.png"
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
    }, [isFav]);

    return(
        <>
            {data != null ?
                <div className="BoxWidget">
                    <header>
                        <h3>Artistas</h3>
                        <img ref={fav} src={'/HeartO.png'} onClick={() => handleClick(fav)} />
                        <img src={'/Glass.png'} onClick={() => handleClick(search)} />
                        <input ref={search} type="search" onChange={() => handleSearch()} />
                    </header>
                    <div className="BoxWidgetContent">
                        {data.items.length > 0 ? data.items.map((artist) => (
                            <div key={artist.id} className="Item">
                                {artist.name ? <p>{artist.name}</p> : null}
                                {<img src={artist.images[0]?.url ?? '/DefUser.png'} alt={artist.name} title={artist.name} onClick={() => handleImg(artist)} />}
                            </div>
                        )) : <span><h3>Aún no tienes artistas favoritos.</h3></span>}
                    </div>
                </div>
            : null}
        </>
    );
}

export default ArtistWidget;