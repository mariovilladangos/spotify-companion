import {logout} from "@/lib/auth";
import './Navbar.css';
import {useRouter} from "next/navigation";

export default function Navbar({ imgUrl, onRefresh }) {
    const router = useRouter();

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

    return(
        <div className={"Nav"}>
            <div className={"NavLeft"}>
                <img src={imgUrl?? '/DefUser.png'} />
            </div>
            <div className={"NavCenter"}>
                <div onClick={() => goTo('/dashboard')} ><h2>Dashboard</h2></div>
                <div onClick={() => goTo('/mixer')} ><h2>Mixer</h2></div>
            </div>
            <div className={"NavRight"}>
                <button onClick={() => handleRefresh()}><img src={"/Refresh.png"}/></button>
                <button onClick={() => handleLogout()}><img src={"/Logout.png"}></img></button>
            </div>
            <div className={"NavBottom"}>
                <div onClick={() => goTo('/dashboard')} ><h2>Dashboard</h2></div>
                <div onClick={() => goTo('/mixer')} ><h2>Mixer</h2></div>
            </div>
        </div>
    );
}