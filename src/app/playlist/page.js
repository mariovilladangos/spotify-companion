'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {getAccessToken, refreshAccessToken, isAuthenticated, getSpotifyAuthUrl, logout} from '@/lib/auth';
import {generatePlaylist, spotifyRequest} from '@/lib/spotify';

import Navbar from '@/components/Navbar';
import TrackWidget from '@/components/widgets/playlist/TrackWidget';
import '../dashboard/Dashboard.css';

export function Home() {
    const router = useRouter();
    const [data, setData] = useState(null);

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
        const data = JSON.parse(localStorage.getItem('playlist'));
        setData(data);

        try { Fetch(); }
        catch (error) { console.error('Fetch error:', error); }
    }

    useEffect(() => {
        Start()
    }, [router])

    return (
        <div className={"DashboardApp"}>
            <Navbar imgUrl={data?.images[0]?.url?? null} onRefresh={Start} />
            {data != null ?
                <div className={"DashboardMain"}>
                    <h2>Revisemos tu playlist personalizada, {data.display_name}!</h2>
                    <TrackWidget />
                </div>
                : null}
        </div>
    );
}

export default Home;


