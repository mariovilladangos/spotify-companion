import {useEffect, useRef, useState} from 'react';

import '../../Widgets.css';

function GenreWidget({ onSelect, selectedItems }) {
    const genres = [ 'acoustic', 'afrobeat', 'alt-rock', 'alternative', 'ambient', 'anime', 'black-metal', 'bluegrass', 'blues', 'bossanova', 'brazil', 'breakbeat', 'british', 'cantopop', 'chicago-house', 'children', 'chill', 'classical', 'club', 'comedy', 'country', 'dance', 'dancehall', 'death-metal', 'deep-house', 'detroit-techno', 'disco', 'disney', 'drum-and-bass', 'dub', 'dubstep', 'edm', 'electro', 'electronic', 'emo', 'folk', 'forro', 'french', 'funk', 'garage', 'german', 'gospel', 'goth', 'grindcore', 'groove', 'grunge', 'guitar', 'happy', 'hard-rock', 'hardcore', 'hardstyle', 'heavy-metal', 'hip-hop', 'house', 'idm', 'indian', 'indie', 'indie-pop', 'industrial', 'iranian', 'j-dance', 'j-idol', 'j-pop', 'j-rock', 'jazz', 'k-pop', 'kids', 'latin', 'latino', 'malay', 'mandopop', 'metal', 'metal-misc', 'metalcore', 'minimal-techno', 'movies', 'mpb', 'new-age', 'new-release', 'opera', 'pagode', 'party', 'philippines-opm', 'piano', 'pop', 'pop-film', 'post-dubstep', 'power-pop', 'progressive-house', 'psych-rock', 'punk', 'punk-rock', 'r-n-b', 'rainy-day', 'reggae', 'reggaeton', 'road-trip', 'rock', 'rock-n-roll', 'rockabilly', 'romance', 'sad', 'salsa', 'samba', 'sertanejo', 'show-tunes', 'singer-songwriter', 'ska', 'sleep', 'songwriter', 'soul', 'soundtracks', 'spanish', 'study', 'summer', 'swedish', 'synth-pop', 'tango', 'techno', 'trance', 'trip-hop', 'turkish', 'work-out', 'world-music' ];
    const [gen, setGen] = useState({items: genres});

    async function handleLoad(){
       setGen({items: genres});
    }

    const sel = useRef(null);
    const [isSel, setIsSel] = useState(false);

    function handleSelection(){
        if (!isSel) {
            handleLoad();
            return;
        }

        let g = JSON.parse(localStorage.getItem('genres_selected'));
        if (g == null) g = {items:[]};

        setGen(g);
        localStorage.setItem('genres_selected', JSON.stringify(g));
    }

    function handleImg(genre){
        if(!isSel && selectedItems.length >= 5) return;
        onSelect(genre, isSel, 'genre');
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

    function handleMouseEnter(elem){
        let color = "var(--primary)"
        if (isSel) color = "red"
        elem.style.border = "10px solid " + color;
    }

    function handleMouseLeave(elem){
        elem.style.border = "none";
    }

    return(
        <>
            {gen != null ?
                <div className="BoxWidget">
                    <header>
                        <h3>A tu gusto. Al punto</h3>
                        <img ref={sel} className={"alone"} src={'/CheckO.png'} onClick={() => handleClick(sel)} />
                    </header>
                    <div className="BoxWidgetContent">
                        {gen.items.length > 0 ? gen.items.map((genre, i) => (
                            <div key={i} className="Item">
                                <p>{genre}</p>
                                <img src={'/DefUser.png'} alt={genre} title={genre} onClick={() => handleImg(genre)}
                                     onMouseEnter={(e) => handleMouseEnter(e.target)} onMouseLeave={(e) => handleMouseLeave(e.target)} />
                            </div>
                        )) : <span><h3>No has seleccionado ningúna genada.</h3></span>}
                    </div>
                </div>
                : null}
        </>
    );
}

export default GenreWidget;