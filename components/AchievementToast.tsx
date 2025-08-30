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
            <style>{`
                @keyframes toast-slide-in {
                  from { opacity: 0; transform: translateX(100%); }
                  to { opacity: 1; transform: translateX(0); }
                }
                @keyframes toast-slide-out {
                  from { opacity: 1; transform: translateX(0); }
                  to { opacity: 0; transform: translateX(100%); }
                }
                .animate-toast-in { animation: toast-slide-in 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
                .animate-toast-out { animation: toast-slide-out 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards; }
            `}</style>
            <div
                className={`bg-slate-800/80 backdrop-blur-md rounded-lg shadow-2xl border border-amber-400/50 p-4 w-full max-w-sm flex items-center gap-4 overflow-hidden ${isVisible ? 'animate-toast-in' : 'animate-toast-out'}`}
                role="alert"
            >
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                    <div className="w-8 h-8">{achievement.icon}</div>
                </div>
                <div className="flex-grow">
                    <h3 className="font-bold text-amber-300">Achievement Unlocked!</h3>
                    <p className="text-sm text-white">{achievement.name}</p>
                </div>
            </div>
        </>
    );
};

export default AchievementToast;