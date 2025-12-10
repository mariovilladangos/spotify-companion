import {logout} from "@/lib/auth";
import './Navbar.css';
import {useRouter} from "next/navigation";
import {useEffect, useState, useRef} from "react";

export default function Navbar({ imgUrl, onRefresh, page }) {
    const router = useRouter();
    const d = useRef(null);
    const m = useRef(null);
    const p = useRef(null);
    const [hovered, setHovered] = useState({ d: false, m: false, p: false });

    const handleMouseEnter = (key) => {
        setHovered(prev => ({ ...prev, [key]: true }));
    };

    const handleMouseLeave = (key) => {
        setHovered(prev => ({ ...prev, [key]: false }));
    };

    const getStyle = (key) => ({
        color: hovered[key] ? 'var(--accent)' : `var(${page === key ? '--primary' : '--text-primary'})`,
        transition: 'color 0.3s ease', // Para suavizar el cambio de color
    });

    const handleLogout = () => {
        logout();
        router.push('/');
    }

    const handleRefresh = () => {
        onRefresh();
    }

    function goTo(path){
        router.push(path);
    }

    useEffect(() => {
        switch (page) {
            case 'd':
                setHovered(prev => ({ ...prev, d: true }));
                break;
            case 'm':
                setHovered(prev => ({ ...prev, m: true }));
                break;
            case 'p':
                setHovered(prev => ({ ...prev, p: true }));
                break;
            default:
                break;
        }
    }, [page, router]); // Ejecutar cuando cambian `page` o `router`

    return(
        <div className={"Nav"}>
            <div className={"NavLeft"}>
                <img src={imgUrl?? '/DefUser.png'} />
            </div>
            <div className={"NavCenter"}>
                <div ref={d}
                     style={getStyle('d')}
                     onMouseEnter={() => handleMouseEnter('d')}
                     onMouseLeave={() => handleMouseLeave('d')}
                     onClick={() => goTo('/dashboard')} >
                    <h2>Dashboard</h2>
                </div>
                <div ref={m}
                     style={getStyle('m')}
                     onMouseEnter={() => handleMouseEnter('m')}
                     onMouseLeave={() => handleMouseLeave('m')}
                     onClick={() => goTo('/mixer')} >
                    <h2>Mixer</h2>
                </div>
                <div ref={p}
                     style={getStyle('p')}
                     onMouseEnter={() => handleMouseEnter('p')}
                     onMouseLeave={() => handleMouseLeave('p')}
                     onClick={() => goTo('/playlist')} >
                    <h2>Playlist</h2>
                </div>
            </div>
            <div className={"NavRight"}>
                <button onClick={() => handleRefresh()}><img src={"/Refresh.png"}/></button>
                <button onClick={() => handleLogout()}><img src={"/Logout.png"}></img></button>
            </div>
            <div className={"NavBottom"}>
                <div onClick={() => goTo('/dashboard')} ><h2>Dashboard</h2></div>
                <div onClick={() => goTo('/mixer')} ><h2>Mixer</h2></div>
                <div onClick={() => goTo('/playlist')} ><h2>Playlist</h2></div>
            </div>
        </div>
    );
}