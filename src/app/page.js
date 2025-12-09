'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getSpotifyAuthUrl } from '@/lib/auth';

import './login.css'

export default function SpotifyCompanion() {
  const router = useRouter();

  useEffect(() => {
    // Si ya está autenticado, redirigir al dashboard
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = () => {
    window.location.href = getSpotifyAuthUrl();
  };

    return (
        <div className="LoginApp">
            <h1 className="LoginTitle">Spotify Companion</h1>
            <button onClick={handleLogin}>
                Login con Spotify
            </button>
        </div>
    );
}