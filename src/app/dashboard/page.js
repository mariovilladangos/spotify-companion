'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {getAccessToken, refreshAccessToken, isAuthenticated, getSpotifyAuthUrl, logout} from '@/lib/auth';
import { spotifyRequest } from '@/lib/spotify';

import Navbar from '@/components/Navbar';
import ArtistWidget from '@/components/widgets/ArtistWidget';
import TrackWidget from "@/components/widgets/TrackWidget";
import './Dashboard.css';

export function Home() {
    const router = useRouter();
    const [data, setData] = useState(null);
    const [actualData, setActualData] = useState(null);

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

    async function RefreshData(){
        try{
            const actualSong = await spotifyRequest(`https://api.spotify.com/v1/me/player/currently-playing`);
            console.log(actualSong);
            setActualData(actualSong);
        }
        catch (error){
            console.error('Error refreshing data:', error);
        }
    }

    const tryFetch = () => {
        try { Fetch(); }
        catch (error) { console.error('Fetch error:', error); }
    }

    useEffect(() => {
        tryFetch();
        setInterval(()=> { RefreshData() }, 10000);
    }, [router])

    return (
        <div className={"DashboardApp"}>
            <Navbar imgUrl={data?.images[0]?.url?? null} userUrl={data?.external_urls?.spotify?? null} onRefresh={tryFetch} page={'d'} />
            {data != null ?
                <div className={"DashboardMain"}>
                    <h2>Bienvenido de vuelta, {data.display_name}!</h2>
                    <ArtistWidget />
                    <TrackWidget />
                </div>
            : null}
        </div>
    );
}

export default Home;


