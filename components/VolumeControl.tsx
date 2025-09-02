
import React from 'react';

interface VolumeControlProps {
    volume: number;
    onVolumeChange: (volume: number) => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ volume, onVolumeChange }) => {
    const backgroundStyle = {
        // Filled portion uses Tailwind sky-500, remainder uses very dark slate
        background: `linear-gradient(to right, #0ea5e9 ${volume * 100}%, #0f172a ${volume * 100}%)`
    };

    return (
        <div className="flex items-center w-24">
             <style>{`
                input[type=range].volume-slider {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 100%;
                    height: 6px;
                    border-radius: 9999px;
                    outline: none;
                    transition: background 0.1s;
                }
                
                input[type=range].volume-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    background: #0ea5e9; /* sky-500 */
                    cursor: pointer;
                    border-radius: 50%;
                    border: 2px solid #0369a1; /* sky-700 */
                    box-shadow: 0 0 8px rgba(14,165,233,0.6);
                }

                input[type=range].volume-slider::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    background: #0ea5e9; /* sky-500 */
                    cursor: pointer;
                    border-radius: 50%;
                    border: 2px solid #0369a1; /* sky-700 */
                    box-shadow: 0 0 8px rgba(14,165,233,0.6);
                }

                /* Keyboard focus outline */
                input[type=range].volume-slider:focus-visible {
                    outline: 2px solid #0ea5e9;
                    outline-offset: 2px;
                }
            `}</style>
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="volume-slider"
                style={backgroundStyle}
                aria-label="Volume control"
            />
        </div>
    );
};

export default VolumeControl;