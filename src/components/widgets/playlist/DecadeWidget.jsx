import {useEffect, useRef, useState} from 'react';
import { useRouter } from 'next/navigation';
import { spotifyRequest } from '@/lib/spotify';

import '../../Widgets.css';

function DecadeWidget({ onSelect, selectedItems }) {
    const decades = [ '1970', '1980', '1990', '2000', '2010', '2020' ];
    const [dec, setDec] = useState({items: decades});

    async function handleLoad(){
        setDec({items: decades});
    }

    const sel = useRef(null);
    const [isSel, setIsSel] = useState(false);

    function handleSelection(){
        if (!isSel) {
            handleLoad();
            return;
        }

        let d = JSON.parse(localStorage.getItem('decades_selected'));
        if (d == null) d = {items:[]};

        setDec(d);
        localStorage.setItem('decades_selected', JSON.stringify(d));
    }

    function handleImg(decade){
        if(!isSel && selectedItems.length >= 5) return;
        onSelect(decade, isSel, 'decade');
        if(isSel) handleSelection();
    }

    function handleClick(ref){
        switch(ref){
            case sel:
                toggle(sel)
                break;
            default:
                break;
        }
    }

    function toggle(ref){
        if (ref == sel) {
            if (isSel) {
                setIsSel(false);
                sel.current.src = "/CheckO.png"
            } else {
                setIsSel(true);
                sel.current.src = "/CheckF.png"
            }
        }
    }

    useEffect(() => {
        handleSelection();
    }, [isSel]);

    return(
        <>
            {dec != null ?
                <div className="BoxWidget">
                    <header>
                        <h3>Elige Nostalgia</h3>
                        <img ref={sel} src={'/CheckO.png'} onClick={() => handleClick(sel)} />
                    </header>
                    <div className="BoxWidgetContent" style={{overflowX: 'hidden'}}>
                        {dec.items.length > 0 ? dec.items.map((decade, i) => (
                            <div key={i} className="Item">
                                <p>{decade}</p>
                                <img src={'/DefUser.png'} alt={decade} title={decade} onClick={() => handleImg(decade)} />
                            </div>
                        )) : <span><h3>No has seleccionado ningúna decada.</h3></span>}
                    </div>
                </div>
            : null}
        </>
    );
}

export default DecadeWidget;