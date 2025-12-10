import {useEffect, useRef, useState} from 'react';
import { useRouter } from 'next/navigation';
import { spotifyRequest } from '@/lib/spotify';

import '../Widgets.css';

function DecadeWidget() {
    const router = useRouter();
    const [data, setData] = useState(null);

    const content = useRef(null);
    const search = useRef(null);
    const [isSearch, setIsSearch] = useState(false);
    const fav = useRef(null);
    const [isFav, setIsFav] = useState(false);

    async function handleLoad(){
        const tracks = await spotifyRequest(`https://api.spotify.com/v1/me/top/tracks`);
        setData(tracks);
    }

    useEffect(() => {
        handleLoad()
    }, [router])

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

        let tracks = JSON.parse(localStorage.getItem('tracks_favorites'));
        if (tracks == null) tracks = {items:[]};

        setData(tracks);
        localStorage.setItem('tracks_favorites', JSON.stringify(tracks));
    }

    function handleImg(track){
        let tracks = JSON.parse(localStorage.getItem('tracks_favorites'));
        if (tracks == null) tracks = {items:[]};

        if (isFav) {
            const filtered = tracks.items.filter(item => item.id != track.id);
            tracks.items = filtered;
            localStorage.setItem('tracks_favorites', JSON.stringify(tracks));
            handleFavorites();
        }
        else{
            const filtered = tracks.items.filter(item => item.id == track.id);
            if (filtered.length == 0) tracks.items.push(track);
            localStorage.setItem('tracks_favorites', JSON.stringify(tracks));
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
            {data != null?
                <div className="BoxWidget">
                    <header>
                        <h3>Canciones</h3>
                        <img ref={fav} src={'/HeartO.png'} onClick={() => handleClick(fav)} />
                        <img src={'/Glass.png'} onClick={() => handleClick(search)} />
                        <input ref={search} type="search" onChange={() => handleSearch()} />
                    </header>
                    <div className="BoxWidgetContent">
                        {data.items.length > 0 ? data.items.map((track) => (
                            <div key={track.id} className="Item">
                                {track.name ? <p>{track.name}</p> : null}
                                {track.album.images[0] ? <img src={track.album.images[0].url} alt={track.name} title={track.name} onClick={() => handleImg(track)} /> : null}
                            </div>
                        )) : <span><h3>Aún no tienes artistas favoritos.</h3></span>}
                    </div>
                </div>
                : null}
        </>
    );
}

export default DecadeWidget;