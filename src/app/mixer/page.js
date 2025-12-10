'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {getAccessToken, refreshAccessToken, isAuthenticated, getSpotifyAuthUrl, logout} from '@/lib/auth';
import {generatePlaylist, spotifyRequest} from '@/lib/spotify';

import Navbar from '@/components/Navbar';
import ArtistWidget from '@/components/widgets/playlist/ArtistWidget';
import DecadeWidget from '@/components/widgets/playlist/DecadeWidget';
import GenreWidget from "@/components/widgets/playlist/GenreWidget";
import '../dashboard/Dashboard.css';
import PopularityWidget from "@/components/widgets/playlist/PopularityWidget";

export function Home() {
    const router = useRouter();
    const [data, setData] = useState(null);
    const [artists, setArtists] = useState(null);
    const [decades, setDecades] = useState(null);
    const [genres, setGenres] = useState(null);
    const [populatiry, setPopularity] = useState(null);


    async function Fetch() {
        try {
            const data = await spotifyRequest(`https://api.spotify.com/v1/me`);
            console.log('User Data:', data);
            setData(data);
        }
        catch (error) {
            logout()
            router.push('/');
        }
    }

    const Start = () => {
        let temp = JSON.parse(localStorage.getItem('artists_selected'));
        if (temp == null) temp = {items:[]};
        setArtists(temp.items);

        temp = JSON.parse(localStorage.getItem('decades_selected'));
        if (temp == null) temp = {items:[]};
        setDecades(temp.items);

        temp = JSON.parse(localStorage.getItem('genres_selected'));
        if (temp == null) temp = {items:[]};
        setGenres(temp.items);

        temp = JSON.parse(localStorage.getItem('popularity_selected'));
        setPopularity(temp);

        try { Fetch(); }
        catch (error) { console.error('Fetch error:', error); }
    }

    useEffect(() => {
        Start()
    }, [router])

    function onSelectElement(element, isSel, type){

        if (type === 'popularity') {
            let popular = null;
            switch(element){
                case 'Nula':
                    popular = [0, 20];
                case 'Leve':
                    popular = [20, 40];
                    break;
                case 'Moderada':
                    popular = [40, 60];
                    break;
                case 'Abundante':
                    popular = [60, 80];
                    break;
                case 'Mainstream':
                    popular = [80, 100];
                    break;
                case null:
                    localStorage.removeItem('popularity_selected');
                    setPopularity(null);
                    return;
                default:
                    break;
            }

            localStorage.setItem('popularity_selected', JSON.stringify(popular));
            setPopularity(popular);
            return;
        }

        let load = JSON.parse(localStorage.getItem(type + 's_selected'));
        if (load == null) load = {items:[]};

        if (isSel) {
            if (type !== 'artist') {
                const filtered = load.items.filter(item => item !== element);
                load.items = filtered;
                localStorage.setItem(type + 's_selected', JSON.stringify(load));
            }
            else {
                const filtered = load.items.filter(item => item.id !== element.id);
                load.items = filtered;
                localStorage.setItem(type + 's_selected', JSON.stringify(load));
            }
        }
        else{
            if (type !== 'artist') {
                const filtered = load.items.filter(item => item === element);
                if (filtered.length === 0) load.items.push(element);
                localStorage.setItem(type + 's_selected', JSON.stringify(load));
            }
            else {
                const filtered = load.items.filter(item => item.id === element.id);
                if (filtered.length === 0) load.items.push(element);
                localStorage.setItem(type + 's_selected', JSON.stringify(load));
            }
        }

        switch (type){
            case 'artist':
                setArtists(load.items);
                break;
            case 'decade':
                setDecades(load.items);
                break;
            case 'genre':
                setGenres(load.items);
                break;
            default:
                break;
        }
    }

    async function getPlaylist(){
        router.push('loading');

        const preferences = {
            artists: artists || [],
            genres: genres || [],
            decades: decades || [],
            popularity: populatiry || null
        }
        const tracks = await generatePlaylist(preferences)
        localStorage.setItem('playlist', JSON.stringify({items: tracks}));

        router.push('playlist');
    }

    return (
        <div className={"DashboardApp"}>
            <Navbar imgUrl={data?.images[0]?.url?? null} onRefresh={Start} />
            {data != null ?
                <div className={"DashboardMain"}>
                    <h2>Vamos a configurar tu nueva playlist, {data.display_name}!</h2>
                    <ArtistWidget onSelect={onSelectElement} selectedItems={artists} />
                    <GenreWidget onSelect={onSelectElement} selectedItems={genres} />
                    <DecadeWidget onSelect={onSelectElement} selectedItems={decades} />
                    <PopularityWidget onSelect={onSelectElement} selectedItems={populatiry} ></PopularityWidget>
                    <button onClick={getPlaylist}>Crear Playlist (esto eliminará la actual lista)</button>
                </div>
            : null}
        </div>
    );
}

export default Home;


