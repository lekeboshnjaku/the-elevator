
import React from 'react';

interface VolumeControlProps {
    volume: number;
    onVolumeChange: (volume: number) => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ volume, onVolumeChange }) => {
    const backgroundStyle = {
        background: `linear-gradient(to right, #facc15 ${volume * 100}%, #1e293b ${volume * 100}%)`
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
                    background: #fde047; /* amber-200 */
                    cursor: pointer;
                    border-radius: 50%;
                    border: 2px solid #facc15; /* amber-400 */
                }

                input[type=range].volume-slider::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    background: #fde047; /* amber-200 */
                    cursor: pointer;
                    border-radius: 50%;
                    border: 2px solid #facc15; /* amber-400 */
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