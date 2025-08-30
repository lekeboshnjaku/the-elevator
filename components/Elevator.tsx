import React, { useEffect, useRef, useState } from 'react';
import { GameStatus, HistoryEntry } from '../types';
import { ANIMATION_DURATION } from '../constants';
import { audioService } from '../services/audioService';
import ElevatorCharacter from './ElevatorCharacter';

// Inlined sub-component for visual detail
const StructuralBeams: React.FC = () => (
    <>
        {/* Vertical Beams */}
        <div className="absolute top-0 bottom-0 left-1 w-2 bg-black/20"></div>
        <div className="absolute top-0 bottom-0 right-1 w-2 bg-black/20"></div>
        {/* Horizontal Beams */}
        <div className="absolute top-1/3 left-0 right-0 h-2 bg-black/20"></div>
        <div className="absolute bottom-1/4 left-0 right-0 h-2 bg-black/20"></div>
    </>
);

interface ElevatorProps {
  gameStatus: GameStatus;
  lastResult: HistoryEntry | null;
  targetMultiplier: string;
  isInstantBet: boolean;
}

const Elevator: React.FC<ElevatorProps> = ({ 
    gameStatus, 
    lastResult, 
    targetMultiplier, 
    isInstantBet
}) => {
  const isDoorsClosed = gameStatus === GameStatus.IDLE || gameStatus === GameStatus.PLAYING || isInstantBet;
  const prevGameStatusRef = useRef(gameStatus);
  
  const animationDuration = isInstantBet ? 0 : ANIMATION_DURATION;

  /* ------------------------------------------------------------------ */
  /*                     Elevation progress animation                   */
  /* ------------------------------------------------------------------ */
  const [progress, setProgress] = useState(0); // 0 (bottom) ➜ 1 (top)
  useEffect(() => {
    if (gameStatus === GameStatus.PLAYING && !isInstantBet) {
      let frameId: number;
      const start = performance.now();
      const loop = (now: number) => {
        const elapsed = now - start;
        const pct = Math.min(1, elapsed / animationDuration);
        setProgress(pct);
        if (pct < 1) frameId = requestAnimationFrame(loop);
      };
      frameId = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(frameId);
    } else {
      setProgress(0); // reset when not playing / instant
    }
  }, [gameStatus, isInstantBet, animationDuration]);
  
  // Base classes for the main elevator body
  const elevatorBodyBaseClasses = 'relative bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 rounded-t-lg shadow-2xl border-x-4 border-t-4 border-slate-600';

  useEffect(() => {
    const prevStatus = prevGameStatusRef.current;
    
    if (prevStatus === GameStatus.PLAYING && (gameStatus === GameStatus.WON || gameStatus === GameStatus.LOST)) {
        if (!isInstantBet) {
            setTimeout(() => {
               audioService.playDoorOpenSound();
            }, animationDuration / 2);
        }
    }
    
    if ((prevStatus === GameStatus.WON || prevStatus === GameStatus.LOST) && gameStatus === GameStatus.IDLE) {
        if (!isInstantBet) {
            audioService.playDoorCloseSound();
        }
    }

    prevGameStatusRef.current = gameStatus;
  }, [gameStatus, isInstantBet, animationDuration]);

  // Main game view with robust rail positioning
  return (
    <div className="relative flex items-center justify-center h-60 sm:h-80 lg:h-96 xl:h-[480px]">

        {/* Elevator Body */}
        <div className={`${elevatorBodyBaseClasses} w-44 sm:w-64 lg:w-80 xl:w-96 h-full`}>
            <div className="absolute inset-x-0 -top-2 h-4 bg-slate-700 elevator-cables"></div>
            {/* Elevator Interior */}
            <div className="absolute inset-2 bg-slate-800 rounded-t-md overflow-hidden border border-black/50 grated-floor">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-600 to-slate-800 opacity-80"></div>
                <StructuralBeams />
                <div className="absolute top-0 left-0 right-0 h-4 bg-slate-500/50 flex items-center justify-center shadow-inner">
                    <div className="w-24 h-2 bg-white/50 rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.4)] opacity-50"></div>
                </div>

                    {/* Moving progress indicator (vertical bar) */}
                    <div
                        className="absolute left-1/2 bottom-3 w-1.5 sm:w-2 bg-slate-400/30 rounded-full"
                        style={{
                            height: '60%',
                            transform: `translate(-50%, -${progress * 100}%)`,
                            transition: isInstantBet ? 'none' : 'transform 50ms linear',
                        }}
                    ></div>
                
                <ElevatorCharacter gameStatus={gameStatus} isInstantBet={isInstantBet} />
            </div>

            {/* Elevator Door Container */}
            <div className="absolute inset-2 overflow-hidden rounded-t-md shadow-[0_0_15px_rgba(34,211,238,0.4),_inset_0_0_10px_rgba(34,211,238,0.2)]">
                {/* Left Door */}
                <div
                className="absolute top-0 bottom-0 left-0 w-1/2 bg-slate-700 transition-transform ease-in-out"
                style={{
                    transform: `translateX(${isDoorsClosed ? '0%' : '-100%'})`,
                    transitionDuration: `${animationDuration}ms`,
                }}
                >
                <div className="absolute w-full h-full bg-gradient-to-r from-slate-800 via-transparent to-slate-800 opacity-50"></div>
                <div className="elevator-window"></div>
                <div className="absolute top-1/2 right-0 w-2 h-1/2 bg-slate-800/50 rounded-full -translate-y-1/2 shadow-lg"></div>
                </div>
                {/* Right Door */}
                <div
                className="absolute top-0 bottom-0 right-0 w-1/2 bg-slate-700 transition-transform ease-in-out"
                style={{
                    transform: `translateX(${isDoorsClosed ? '0%' : '100%'})`,
                    transitionDuration: `${animationDuration}ms`,
                }}
                >
                <div className="absolute w-full h-full bg-gradient-to-l from-slate-800 via-transparent to-slate-800 opacity-50"></div>
                <div className="elevator-window"></div>
                <div className="absolute top-1/2 left-0 w-2 h-1/2 bg-slate-800/50 rounded-full -translate-y-1/2 shadow-lg"></div>
                </div>
            </div>
        </div>

        {/* Left Rail */}
        <div
            className="absolute top-1/2 -translate-y-1/2 h-3/4 md:h-4/5 w-3 sm:w-4 lg:w-5 bg-slate-900/60 rounded-sm border border-slate-800/80 shadow-md
                       flex flex-col items-center justify-between py-2
                       -left-4 sm:-left-4 lg:-left-5">
            {Array.from({ length: 5 }).map((_, i) => {
                const totalLights = 5;
                const activeLights = Math.min(
                    totalLights,
                    Math.max(0, Math.floor(progress * totalLights))
                );
                const illuminated =
                    gameStatus === GameStatus.PLAYING &&
                    !isInstantBet &&
                    i >= totalLights - activeLights;
                const cls = illuminated
                    ? 'bg-orange-400 shadow-[0_0_10px_3px_rgba(251,146,60,0.7)] animate-orange-pulse-glow'
                    : 'bg-orange-900/30';
                return (
                    <div
                        key={`left-${i}`}
                        className={`w-1.5 h-4 rounded-[2px] ${cls}`}
                    ></div>
                );
            })}
        </div>

        {/* Right Rail */}
        <div
            className="absolute top-1/2 -translate-y-1/2 h-3/4 md:h-4/5 w-3 sm:w-4 lg:w-5 bg-slate-900/60 rounded-sm border border-slate-800/80 shadow-md
                       flex flex-col items-center justify-between py-2
                       -right-4 sm:-right-4 lg:-right-5">
            {Array.from({ length: 5 }).map((_, i) => {
                const totalLights = 5;
                const activeLights = Math.min(
                    totalLights,
                    Math.max(0, Math.floor(progress * totalLights))
                );
                const illuminated =
                    gameStatus === GameStatus.PLAYING &&
                    !isInstantBet &&
                    i >= totalLights - activeLights;
                const cls = illuminated
                    ? 'bg-orange-400 shadow-[0_0_10px_3px_rgba(251,146,60,0.7)] animate-orange-pulse-glow'
                    : 'bg-orange-900/30';
                return (
                    <div
                        key={`right-${i}`}
                        className={`w-1.5 h-4 rounded-[2px] ${cls}`}
                    ></div>
                );
            })}
        </div>
    </div>
  );
};

export default Elevator;