'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {getAccessToken, isAuthenticated, getSpotifyAuthUrl, logout} from '@/lib/auth';
import Image from 'next/image';

import './dashboard.css';

export default function Home() {
    const router = useRouter();
    const [data, setData] = useState(null);

    async function spotifyRequest(url) {
        const token = getAccessToken();

        if (!token) {
            // Intentar refrescar token
            const newToken = await refreshAccessToken();
            if (!newToken) {
                // Redirigir a login
                window.location.href = '/';
                return;
            }
        }

        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) {
            // Token expirado, refrescar
            const newToken = await refreshAccessToken();
            // Reintentar petición
        }

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return response.json();
    }

    const handleLogout = () => {
        logout();
        router.push('/');
    }

    async function tryFetch(){
        const data = await spotifyRequest(`https://api.spotify.com/v1/me`);
        console.log('User Data:', data);
        setData(data);
    }

    useEffect(() => {
        try {
            tryFetch();
        }
        catch (error) {
            console.error('Error during initial fetch:', error);
        }
    }, [])

    return (
        <div className={"DashboardApp"}>
            <div className={"DashboardNav"}>
                <button onClick={handleLogout}>Log Out</button>
                <button onClick={tryFetch}>Refresh Fetch</button>
            </div>
            {data != null ?
                <div className={"DashboardUserInfo"}>
                    <img className={"DashboardProfilePic"} src={data.images[0].url} alt={""}></img>
                </div>
            : console.log(data)}
        </div>
    );
}



