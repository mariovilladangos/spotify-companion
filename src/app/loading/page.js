import React from 'react';
import './Load.css';

function Load() {
    return (
        <div className="App">
            <div className="loader">
                <svg
                    width="100"
                    height="100"
                    viewBox="0 0 50 50"
                    xmlns="http://www.w3.org/2000/svg"
                    className="circle-loader"
                >
                    <circle
                        cx="25"
                        cy="25"
                        r="20"
                        stroke="var(--primary)"
                        strokeWidth="4"
                        fill="none"
                        className="circle"
                    />
                </svg>
            </div>
        </div>
    );
}

export default Load;
