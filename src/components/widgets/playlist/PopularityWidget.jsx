import {useEffect, useRef, useState} from 'react';

import '../../Widgets.css';

function PopularityWidget({ onSelect, selectedItems }) {
    const popularities = [ "Nula", "Leve", "Moderada", "Abundante", "Mainstream" ];
    const [popular, setPopular] = useState({items: popularities});
    const lastImg = useRef(null);

    async function handleLoad(){
        setPopular({items: popularities});
    }

    const sel = useRef(null);
    const [isSel, setIsSel] = useState(false);

    function handleSelection(){
        if (!isSel) {
            handleLoad();
            return;
        }

        let p = JSON.parse(localStorage.getItem('popularity_selected'));
        if (p == null)

        setPopular(p);
    }

    function handleImg(popularity, img, i){
        console.log(selectedItems);
        if(selectedItems != null && (selectedItems[0] / 20) == i){
            console.log((selectedItems[0] / 20))
            img.style.border = 'none';
            onSelect(null, isSel, 'popularity');
            return;
        }

        lastImg.current ? lastImg.current.style.border = 'none' : null;
        img.style.border = '4px solid var(--primary)';
        lastImg.current = img;

        onSelect(popularity, isSel, 'popularity');
        if(isSel) handleSelection();
    }

    useEffect(() => {
        console.log(selectedItems);
    }, [selectedItems]);

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
            {popular != null ?
                <div className="BoxWidget">
                    <header>
                        <h3>Popularidad</h3>
                    </header>
                    <div className="BoxWidgetContent" style={{overflowX: 'hidden'}}>
                        {popular.items.length > 0 ? popular.items.map((popularity, i) => (
                            <div key={i} className="Item">
                                <p>{popularity}</p>
                                <img src={'/DefUser.png'} alt={popularity} title={popularity} onClick={(e) => handleImg(popularity, e.target, i)} />
                            </div>
                        )) : <span><h3>No has seleccionado ningúna popularada.</h3></span>}
                    </div>
                </div>
                : null}
        </>
    );
}

export default PopularityWidget;