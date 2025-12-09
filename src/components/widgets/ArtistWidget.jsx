import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { spotifyRequest } from '@/lib/spotify';

import '../Widgets.css';
import './ArtistWidget.css';

function ArtistWidget() {
    const router = useRouter();
    const [data, setData] = useState(null);

    async function handleLoad(){
        const data = await spotifyRequest(`https://api.spotify.com/v1/me/top/artists`);
        console.log('User Top Artists:', data);
        setData(data);
    }

    useEffect(() => {
        handleLoad()
    }, [router])

    return(
        <>
            {data != null?
                <div className="BoxWidget">
                    <h3>Tus Artistas Más Escuchados</h3>
                    <div className="BoxWidgetContent">
                        {data.items.map((artist) => (
                            <div key={artist.id} className="ArtistItem">
                                {artist.images[0] ? <img src={artist.images[0].url} alt={artist.name} title={artist.name} /> : null}
                            </div>
                        ))}
                    </div>
                </div>
            : null}
        </>
    );
}

export default ArtistWidget;