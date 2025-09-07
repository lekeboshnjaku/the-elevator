import React, { useEffect, useState } from 'react';
import { Achievement } from '../types';

interface AchievementToastProps {
  achievement: Achievement;
  onClose: () => void;
}

const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // A tiny delay ensures the element is in the DOM before the animation starts
        const enterTimeout = setTimeout(() => setIsVisible(true), 50);

        const exitTimeout = setTimeout(() => {
            setIsVisible(false);
            // Allow time for exit animation before calling onClose to remove from queue
            setTimeout(onClose, 500); 
        }, 2500); // Display for 2.5 seconds

        return () => {
            clearTimeout(enterTimeout);
            clearTimeout(exitTimeout);
        };
    }, [onClose]);

    return (
        <>
            <div
                className={`toast-panel toast-neon-frame p-4 w-full max-w-sm grid grid-cols-[auto,1fr] items-center gap-4 overflow-hidden ${isVisible ? 'animate-toast-pop-in' : 'animate-toast-pop-out'}`}
                role="alert"
            >
                <div className="flex-shrink-0 w-12 h-12 p-1.5 self-center grid place-items-center toast-icon toast-icon-ring neon-round-btn neon-round-btn--active">
                    <div className="w-7 h-7 grid place-items-center">{achievement.icon}</div>
                </div>
                <div className="flex-grow self-center">
                    <h3 className="toast-title">Achievement Unlocked!</h3>
                    <p className="text-sm text-white">{achievement.name}</p>
                </div>
            </div>
        </>
    );
};

export default AchievementToast;