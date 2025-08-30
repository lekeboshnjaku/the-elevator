import React, { useState, useEffect } from 'react';
import { GameStatus, HistoryEntry } from '../types';

interface ElevatorIndicatorProps {
    gameStatus: GameStatus;
    lastResult: HistoryEntry | null;
    targetMultiplier: string;
    isInstantBet: boolean;
}

const ElevatorIndicator: React.FC<ElevatorIndicatorProps> = ({ gameStatus, lastResult, targetMultiplier, isInstantBet }) => {
    const [floor, setFloor] = useState(0);

    useEffect(() => {
        let animationFrameId: number;
        let startTime: number | null = null;

        const animateFloor = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const currentFloor = Math.pow(progress / 120, 2.1);
            setFloor(currentFloor);
            animationFrameId = requestAnimationFrame(animateFloor);
        };

        if (gameStatus === GameStatus.PLAYING && !isInstantBet) { // Only animate for normal bets
            startTime = null;
            setFloor(0);
            animationFrameId = requestAnimationFrame(animateFloor);
        } else {
            setFloor(0);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [gameStatus, isInstantBet]);

    let content: React.ReactNode;
    let textColorClass = 'text-cyan-300 text-glow-cyan';

    switch (gameStatus) {
        case GameStatus.PLAYING:
            if (isInstantBet) {
                textColorClass = 'text-slate-400';
                content = (
                    <>
                        <p className="text-sm uppercase tracking-widest opacity-70">Resolving...</p>
                        <p className="text-5xl font-mono font-bold leading-none -mt-1">{parseFloat(targetMultiplier).toFixed(2)}x</p>
                    </>
                );
            } else {
                content = (
                    <>
                        <p className="text-sm uppercase tracking-widest opacity-70">Ascending</p>
                        <p className="text-5xl font-mono font-bold leading-none -mt-1">{floor.toFixed(2)}x</p>
                    </>
                );
            }
            break;
        case GameStatus.WON:
            textColorClass = 'text-green-400 text-glow-green';
            content = (
                <>
                    <p className="text-sm uppercase tracking-widest opacity-70">Success</p>
                    <p className="text-5xl font-mono font-bold leading-none -mt-1">{lastResult?.multiplier.toFixed(2)}x</p>
                </>
            );
            break;
        case GameStatus.LOST:
            textColorClass = 'text-red-500 text-glow-red';
            content = (
                <>
                    <p className="text-sm uppercase tracking-widest opacity-70">Failed</p>
                    <p className="text-5xl font-mono font-bold leading-none -mt-1">{lastResult?.multiplier.toFixed(2)}x</p>
                </>
            );
            break;
        default: // IDLE
             content = (
                <>
                    <p className="text-sm uppercase tracking-widest opacity-70">Target</p>
                    <p className="text-5xl font-mono font-bold leading-none -mt-1">{parseFloat(targetMultiplier).toFixed(2)}x</p>
                </>
            );
            break;
    }

    return (
        <div className="w-full h-24 bg-[radial-gradient(ellipse_at_center,_rgba(103,232,249,0.2)_0%,_rgba(30,41,59,0.7)_40%,_rgba(2,6,23,0.9)_80%)] rounded-lg flex flex-col items-center justify-center p-2 border border-slate-700 shadow-inner shadow-black/50"
             style={{ fontFamily: '"Orbitron", sans-serif' }}>
            <div className={`text-center transition-colors duration-300 ${textColorClass}`}>
                {content}
            </div>
        </div>
    );
};

export default ElevatorIndicator;