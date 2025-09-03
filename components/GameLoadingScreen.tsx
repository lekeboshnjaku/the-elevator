
import React from 'react';

/**
 * A brand-focused, high-fidelity loading screen.
 * @param progress - A number from 0 to 100 representing the loading progress.
 */
const GameLoadingScreen: React.FC<{ progress: number }> = ({ progress }) => {
    
    return (
        <>
        <main className="relative flex flex-col min-h-screen w-full items-center justify-center overflow-hidden text-white p-4 bg-black">
            {/* This style block contains the keyframe animations for the liquid effect */}
            <style>{`
                @keyframes move-liquid {
                    0% { transform: translateX(0) translateY(0) rotate(0deg) scale(1.1); }
                    25% { transform: translateX(-5px) translateY(5px) rotate(2deg) scale(1.0); }
                    50% { transform: translateX(5px) translateY(-5px) rotate(-2deg) scale(1.1); }
                    75% { transform: translateX(-3px) translateY(3px) rotate(1deg) scale(1.0); }
                    100% { transform: translateX(0) translateY(0) rotate(0deg) scale(1.1); }
                }

            `}</style>
            
            <div className="flex flex-col items-center gap-6 w-full max-w-md text-center">
                {/* Logo Container */}
                <div className="relative w-48 h-48 sm:w-64 sm:h-64">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                        <defs>
                            {/* This SVG filter creates the "liquid" distortion effect */}
                            <filter id="liquid-distortion">
                                <feTurbulence type="fractalNoise" baseFrequency="0.02 0.05" numOctaves="3" result="turbulence" seed="10" />
                                <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="12" xChannelSelector="R" yChannelSelector="G" />
                            </filter>
                             {/* This clips the liquid so it only appears inside the "O" */}
                             <clipPath id="o-clip">
                                <circle cx="100" cy="100" r="50" />
                            </clipPath>

                        </defs>
                        
                        {/* The Ooze liquid, clipped by the circle path */}
                        <g clipPath="url(#o-clip)">
                            {/* The dark background of the circle (visible when not filled) */}
                             <rect x="0" y="0" width="200" height="200" fill="rgba(2, 6, 23, 0.5)" />
                             
                            {/* The filling ooze element. Its 'y' position is controlled by the progress prop. */}
                            <rect 
                                x="0" 
                                y={200 - (progress * 2)} // Starts at bottom (200) and moves up to top (0)
                                width="200" 
                                height="200"
                                fill="#a3e635"
                                style={{
                                    filter: 'url(#liquid-distortion)',
                                    animation: 'move-liquid 8s ease-in-out infinite',
                                    transformOrigin: 'center center',
                                    transition: 'y 0.2s linear' // Smooths the progress update
                                }}
                            />
                        </g>
                        
                        {/* The "O" outline - drawn on top of the liquid */}
                        <circle 
                            cx="100" cy="100" r="50" 
                            stroke="#a3e635"
                            strokeWidth="8" 
                            fill="none" 
                        />
                    </svg>
                </div>
                 
                {/* Text Logo */}
                <div style={{ fontFamily: '"Orbitron", sans-serif' }}>
                    <h1 className="text-4xl font-medium text-white lowercase tracking-[0.15em]">
                        oozelabs
                    </h1>
                </div>
            </div>
        </main>
        </>
    );
};

export default GameLoadingScreen;
