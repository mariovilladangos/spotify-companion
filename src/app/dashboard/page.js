'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {getAccessToken, isAuthenticated, getSpotifyAuthUrl, logout} from '@/lib/auth';

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
            {data != null ?
                <>
                    <div className={"DashboardNav"}>
                        <div className={"DashboardNavLeft"}>
                            <img src={data.images[0].url} />
                        </div>
                            <div className={"DashboardNavCenter"}></div>
                        <div className={"DashboardNavRight"}>
                            <button onClick={tryFetch}><img src={"/Refresh.png"}/></button>
                            <button onClick={handleLogout}><img src={"/Logout.png"}></img></button>
                        </div>
                    </div>
                    <div className={"DashboardMain"}>
                        <h2>Bienvenido de vuelta, {data.display_name}!</h2>
                    </div>
                </>
            : null}
        </div>
    );
}



