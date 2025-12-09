'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {getAccessToken, refreshAccessToken, isAuthenticated, getSpotifyAuthUrl, logout} from '@/lib/auth';
import { spotifyRequest } from '@/lib/spotify';

import ArtistWidget from '@/components/widgets/ArtistWidget';
import './Dashboard.css';

export function Home() {
    const router = useRouter();
    const [data, setData] = useState(null);

    const handleLogout = () => {
        logout();
        router.push('/');
    }

    async function Fetch() {
        const data = await spotifyRequest(`https://api.spotify.com/v1/me`);
        console.log('User Data:', data);
/*
        const artists = await spotifyRequest(`https://api.spotify.com/v1/me/top/artists`);
        console.log('User Top Artists:', artists);

        const tracks = await spotifyRequest(`https://api.spotify.com/v1/me/top/tracks`);
        console.log('User Top Tracks:', tracks);

        const playlists = await spotifyRequest(`https://api.spotify.com/v1/users/${data.id}/playlists`);
        console.log('User Playlists:', playlists);
*/
        setData(data);
    }

    const tryFetch = () => {
        try { Fetch(); }
        catch (error) { console.error('Fetch error:', error); }
    }

    useEffect(() => {
        tryFetch()
    }, [router])

    return (
        <div className={"DashboardApp"}>
            <div className={"DashboardNav"}>
                <div className={"DashboardNavLeft"}>
                    {data != null ? <img src={data.images[0].url}/> : null}
                </div>
                <div className={"DashboardNavCenter"}></div>
                <div className={"DashboardNavRight"}>
                    <button onClick={tryFetch}><img src={"/Refresh.png"}/></button>
                    <button onClick={handleLogout}><img src={"/Logout.png"}></img></button>
                </div>
            </div>
            {data != null ?
                <div className={"DashboardMain"}>
                    <h2>Bienvenido de vuelta, {data.display_name}!</h2>
                    <ArtistWidget />
                </div>
            : null}
        </div>
    );
}

export default Home;


