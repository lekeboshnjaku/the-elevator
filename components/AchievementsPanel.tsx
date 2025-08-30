import React, { useEffect, useRef } from 'react';
import { Achievement, AchievementId } from '../types';
import { allAchievements } from '../data/achievementData';

interface AchievementsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    unlockedIds: Set<AchievementId>;
}

const AchievementsPanel: React.FC<AchievementsPanelProps> = ({ isOpen, onClose, unlockedIds }) => {
    const achievementsList = Array.from(allAchievements.values());
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => closeButtonRef.current?.focus(), 100);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="achievements-title"
        >
            <style>{`
                @keyframes fade-in {
                  from { opacity: 0; transform: scale(0.95); }
                  to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in { animation: fade-in 0.3s ease-out; }
            `}</style>
            <div
                className="bg-slate-800 rounded-lg shadow-2xl p-6 w-full max-w-lg border border-slate-600 max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 id="achievements-title" className="text-2xl font-bold text-white flex items-center gap-2">
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-amber-400">
                           <path fillRule="evenodd" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10ZM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" clipRule="evenodd" />
                        </svg>
                        Session Achievements
                    </h2>
                    <button
                        ref={closeButtonRef}
                        onClick={onClose}
                        className="text-slate-400 hover:text-white p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Close achievements"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="overflow-y-auto space-y-3 pr-2 -mr-2">
                    {achievementsList.map((ach) => {
                        const isUnlocked = unlockedIds.has(ach.id);
                        return (
                            <div
                                key={ach.id}
                                className={`flex items-center gap-4 bg-slate-900/50 p-3 rounded-lg border border-slate-700 transition-all duration-300 ${isUnlocked ? 'opacity-100' : 'opacity-40'}`}
                            >
                                <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${isUnlocked ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-500'}`}>
                                    <div className="w-6 h-6">{ach.icon}</div>
                                </div>
                                <div className="flex-grow">
                                    <h3 className={`font-bold ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>{ach.name}</h3>
                                    <p className="text-sm text-slate-400">{ach.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AchievementsPanel;