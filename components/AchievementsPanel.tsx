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

    /* ----------------------------------------------------------- */
    /*              Theme helpers for neon border colors           */
    /* ----------------------------------------------------------- */
    const getTheme = (id: AchievementId) => {
        switch (id) {
            case AchievementId.SKY_RIDER:
            case AchievementId.ROLLER:
            case AchievementId.LUCKY_LIFT:
                return { borderClass: 'neon-border-cyan', ringClass: 'ring-cyan-300' };
            case AchievementId.BIG_ROLLER:
            case AchievementId.HIGH_ROLLER:
            case AchievementId.PRECISION_PLAYER:
                return { borderClass: 'neon-border-gold', ringClass: 'ring-amber-300' };
            case AchievementId.RISK_TAKER:
                return { borderClass: 'neon-border-purple', ringClass: 'ring-fuchsia-300' };
            case AchievementId.ELEVATOR_JAMMER:
            default:
                return { borderClass: 'neon-border-red', ringClass: 'ring-red-400' };
        }
    };

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
                    <h2
                        id="achievements-title"
                        className="text-2xl font-black font-[Orbitron] text-white text-glow-cyan flex items-center gap-2"
                    >
                        {/* Glowing hexagon badge with star */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="w-6 h-6 icon-glow-cyan animate-cyan-icon-pulse"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth={1.8}
                        >
                            {/* Hexagon outline */}
                            <path
                                d="M12 2l6.93 4v8l-6.93 4-6.93-4v-8L12 2z"
                                fill="none"
                            />
                            {/* Star */}
                            <path d="M12 8.5l1.45 2.94 3.25.47-2.35 2.3.55 3.23-2.9-1.53-2.9 1.53.55-3.23-2.35-2.3 3.25-.47L12 8.5z" />
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
                                className={`relative flex items-center gap-4 neon-card-bg p-3 rounded-lg transition-all duration-300
                                    ${isUnlocked ? `${getTheme(ach.id).borderClass} border animate-unlock-once` : 'border border-slate-700 grayscale opacity-40'}`}
                            >
                                <div
                                    className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full
                                        ${isUnlocked ? `ring-2 ${getTheme(ach.id).ringClass} bg-slate-800/40` : 'bg-slate-700'}`}
                                >
                                    <div className="w-6 h-6">{ach.icon}</div>
                                </div>
                                <div className="flex-grow">
                                    <h3 className={`font-bold ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>{ach.name}</h3>
                                    <p className="text-sm text-slate-400">{ach.description}</p>
                                </div>
                                {/* Lock overlay for locked achievements */}
                                {!isUnlocked && (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        className="absolute -top-1 -right-1 w-5 h-5 text-slate-500/60"
                                        fill="currentColor"
                                    >
                                        <path d="M12 1a5 5 0 0 0-5 5v3H5.5A2.5 2.5 0 0 0 3 11.5v7A2.5 2.5 0 0 0 5.5 21h13a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 18.5 9H17V6a5 5 0 0 0-5-5Zm-3 5a3 3 0 1 1 6 0v3H9V6Z" />
                                    </svg>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AchievementsPanel;