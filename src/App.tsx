// src/App.tsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
// CORRECTED: 'useElevatorGame' is a folder, assuming main file inside is 'useElevatorGame.ts' or 'useElevatorGame.tsx'
import { useElevatorGame } from '../hooks/useElevatorGame';
// CORRECTED: 'Elevator' is a component file directly in 'components' folder, add explicit '.tsx'
import Elevator from '../components/Elevator';
import Controls from '../components/Controls';
// CORRECTED: 'types' is a file directly in 'src', add explicit '.ts'
import { GameStatus, Achievement } from '../types';
// CORRECTED: 'audioService' is a folder, assuming main file inside is 'audioService.ts' or 'audioService.tsx'
import { audioService } from './services/audioService';
// CORRECTED: 'rgsApiService' is a folder, assuming main file inside is 'rgsApiService.ts' or 'rgsApiService.tsx'
import { rgsApiService } from './services/rgsApiService';
// CORRECTED: 'ErrorToast' is a component file directly in 'components' folder, add explicit '.tsx'
import ErrorToast from '../components/ErrorToast';
import RulesModal from '../components/RulesModal';
import MathModal from '../components/MathModal';
import { ProvablyFairControls } from '../components/ProvablyFairControls';
import ElevatorIndicator from '../components/ElevatorIndicator';
import VolumeControl from '../components/VolumeControl';
import StatsAndHistoryPanel from '../components/StatsAndHistoryPanel';
import ElevatorShaftBackground from '../components/GridBackground'; // Assuming the file is GridBackground.tsx
import RealityCheckModal from '../components/RealityCheckModal';
// CORRECTED: 'VolumeControl' is a component file directly in 'components' folder, add explicit '.tsx'
// CORRECTED: 'StatsAndHistoryPanel' is a component file directly in 'components' folder, add explicit '.tsx'
// CORRECTED: 'ElevatorShaftBackground' is a component file directly in 'components' folder, add explicit '.tsx'
// CORRECTED: 'RealityCheckModal' is a component file directly in 'components' folder, add explicit '.tsx'
// CORRECTED: 'constants' is a file directly in 'src', add explicit '.ts'
import { REALITY_CHECK_INTERVAL } from '../constants';
// CORRECTED: 'DropzoneOverlay' is a component file directly in 'components' folder, add explicit '.tsx'
import DropzoneOverlay from '../components/DropzoneOverlay';
import GameLoadingScreen from '../components/GameLoadingScreen';
// CORRECTED: 'useLocalization' is a folder, assuming main file inside is 'useLocalization.ts' or 'useLocalization.tsx'
import { useLocalization } from '../hooks/useLocalization';
// CORRECTED: 'AchievementsPanel' is a component file directly in 'components' folder, add explicit '.tsx'
import AchievementsPanel from '../components/AchievementsPanel';
import AchievementToast from '../components/AchievementToast';


const App: React.FC = () => {
    // Game Phase Management
    const [appPhase, setAppPhase] = useState<'initializing' | 'playing'>('initializing');
    const [loadingProgress, setLoadingProgress] = useState(0);
    const animationFrameRef = useRef<number | null>(null);

    // UI State
    const [isRulesOpen, setRulesOpen] = useState(false);
    const [isMathOpen, setMathOpen] = useState(false);
    const [isFairnessOpen, setFairnessOpen] = useState(false);
    const [isStatsPanelOpen, setStatsPanelOpen] = useState(false); // For mobile
    const [isInstantBet, setInstantBet] = useState(false);
    const [isRealityCheckVisible, setRealityCheckVisible] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [liveRegionMessage, setLiveRegionMessage] = useState('');
    const [isSocialMode, setSocialMode] = useState(false);
    const [isAchievementsOpen, setAchievementsOpen] = useState(false);
    const [achievementToastQueue, setAchievementToastQueue] = useState<Achievement[]>([]);

    // Refs
    const fairnessContainerRef = useRef<HTMLDivElement>(null);
    const welcomePlayedRef = useRef(false);

    // Localization Hook
    const { t } = useLocalization(isSocialMode);

    // Audio State
    const [volume, setVolume] = useState(0.5);
    const [isMuted, setMuted] = useState(false);
    const [isOperatorMuted, setOperatorMuted] = useState(false);
    const [isVolumeSliderVisible, setVolumeSliderVisible] = useState(false);

    // Game Logic Hook
    const game = useElevatorGame(isInstantBet);

    // Helper to smoothly animate progress, making the loading feel more gradual.
    const smoothAnimateProgressTo = useCallback((target: number) => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        const animate = () => {
            setLoadingProgress(current => {
                // If we are very close, just snap to the target and stop animating.
                if (Math.abs(target - current) < 0.1) {
                    return target;
                }
                // Move 5% of the remaining distance each frame for a smooth ease-out effect.
                const newProgress = current + (target - current) * 0.05;
                animationFrameRef.current = requestAnimationFrame(animate);
                return newProgress;
            });
        };

        animationFrameRef.current = requestAnimationFrame(animate);
    }, []);

    // ---- Game Initialization ----
    useEffect(() => {
        const loadTasks = async () => {
            const MIN_LOADING_TIME_MS = 3000; // Enforce a minimum 3-second load time for UX
            const startTime = Date.now();

            try {
                // Initial setup tasks
                smoothAnimateProgressTo(10);
                const urlParams = new URLSearchParams(window.location.search);
                const rgsUrl = urlParams.get('rgs_url') || 'https://rgs.stake-engine.com/v1'; // Fallback for local dev
                const socialMode = urlParams.get('social') === 'true';
                setSocialMode(socialMode);

                // Retrieve session token from query params (supports several key variants) or fall back to placeholder.
                const sessionToken =
                    urlParams.get('sessionID') ??
                    urlParams.get('sessionId') ??
                    urlParams.get('session_id') ??
                    urlParams.get('session') ??
                    urlParams.get('token') ??
                    'SESSION_TOKEN_FROM_STAKE_PLATFORM';

                // Initialize RGS client with resolved session token and base URL.
                rgsApiService.initialize(sessionToken, rgsUrl);

                // Initialize audio service
                await audioService.init();
                smoothAnimateProgressTo(30);

                // Wait for custom fonts to be ready
                await document.fonts.ready;
                smoothAnimateProgressTo(60);

                // Initialize game data from the server
                smoothAnimateProgressTo(75);
                await game.initializeGame();
                smoothAnimateProgressTo(100);

                const elapsedTime = Date.now() - startTime;
                const remainingTime = MIN_LOADING_TIME_MS - elapsedTime;

                // A brief pause on 100% for a smoother transition, ensuring minimum load time.
                setTimeout(() => {
                    setAppPhase('playing');
                }, Math.max(500, remainingTime)); // Use at least 500ms, or more if needed to meet min time

            } catch (error) {
                 console.error("Critical initialization failure:", error);
                 const root = document.getElementById('root');
                 if(root) root.innerHTML = '<div style="color: red; padding: 20px; text-align: center;">Failed to load game. Please refresh.</div>';
            }
        };

        loadTasks();

        // Cleanup on unmount
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ---- Effects ----

    // ---- Helper Functions ----
    const formatCurrency = useCallback((amount: number) => {
        const { symbol, prefix } = game.currencyConfig;
        const formattedAmount = Math.abs(amount).toFixed(2);
        const sign = amount < 0 ? '-' : '';
        return prefix
            ? `${sign}${symbol}${formattedAmount}`
            : `${sign}${formattedAmount}${symbol}`;
    }, [game.currencyConfig]);

    // Effect to populate toast queue from the game hook
    useEffect(() => {
        if (game.newlyUnlockedQueue.length > 0) {
            setAchievementToastQueue(prev => [...prev, ...game.newlyUnlockedQueue]);
            game.clearNewlyUnlockedQueue();
        }
    }, [game.newlyUnlockedQueue, game.clearNewlyUnlockedQueue]);

    // Effect to handle one-time audio unlock and welcome message on first user interaction.
    useEffect(() => {
        if (appPhase !== 'playing') return;

        const playWelcomeSequence = () => {
            if (welcomePlayedRef.current) return;
            welcomePlayedRef.current = true;

            // This call to setVolume also resumes the AudioContext if it's suspended.
            audioService.setVolume(isMuted ? 0 : volume).then(() => {
                audioService.startBackgroundMusic();
                game.playWelcomeMessage();
            });
        };

        window.addEventListener('click', playWelcomeSequence, { once: true });
        window.addEventListener('keydown', playWelcomeSequence, { once: true });

        return () => {
            window.removeEventListener('click', playWelcomeSequence);
            window.removeEventListener('keydown', playWelcomeSequence);
        };
    }, [appPhase, game, volume, isMuted]);

    // Effect for ongoing volume changes
    useEffect(() => {
        audioService.setVolume(isMuted ? 0 : volume);
    }, [volume, isMuted]);

    // Effect for handling operator voice mute
    useEffect(() => {
        audioService.toggleVoice(!isOperatorMuted);
    }, [isOperatorMuted]);

    // Effect for playing sounds on game result
    useEffect(() => {
        if (game.gameStatus === GameStatus.WON) {
            audioService.playWinSound();
        } else if (game.gameStatus === GameStatus.LOST) {
            audioService.playLoseSound();
        }
    }, [game.gameStatus]);

    // Effect for ARIA live region announcements for accessibility
    useEffect(() => {
        if (game.gameStatus === GameStatus.WON && game.lastResult) {
            setLiveRegionMessage(`You won ${formatCurrency(game.lastWinAmount)}. New balance is ${formatCurrency(game.balance)}.`);
        } else if (game.gameStatus === GameStatus.LOST && game.lastResult) {
            setLiveRegionMessage(`You lost. Crashed at ${game.lastResult.multiplier.toFixed(2)}x. New balance is ${formatCurrency(game.balance)}.`);
        }
    }, [game.gameStatus, game.lastResult, game.balance, game.lastWinAmount, formatCurrency]);

    // Effect for Reality Check timer
    useEffect(() => {
        if (appPhase !== 'playing') return;

        const timer = setInterval(() => {
            setRealityCheckVisible(true);
        }, REALITY_CHECK_INTERVAL);

        return () => clearInterval(timer);
    }, [appPhase]);

    // Effect for focusing the fairness modal when it opens
    useEffect(() => {
        if (isFairnessOpen && fairnessContainerRef.current) {
            const timer = setTimeout(() => fairnessContainerRef.current?.focus(), 100);
            return () => clearTimeout(timer);
        }
    }, [isFairnessOpen]);

    // Effect for Spacebar functionality
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) {
                return;
            }

            if (e.code === 'Space') {
                e.preventDefault();

                if (game.isAutoBetting) {
                    game.stopAutoBet();
                } else if (game.gameStatus === GameStatus.IDLE) {
                    // Only allow manual bet with spacebar
                    if (game.canBet) {
                        game.placeBet();
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [game.isAutoBetting, game.gameStatus, game.canBet, game.stopAutoBet, game.placeBet]);


    // ---- Drag and Drop Handlers for Music ----
    const handleDragEnter = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragOver(true);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const audioFile = Array.from(files).find(file => file.type === 'audio/mpeg');
            if (audioFile) {
                const fileUrl = URL.createObjectURL(audioFile);
                audioService.loadAndPlayMusicFromUrl(fileUrl);
            }
        }
    };

    // ---- Render Logic ----

    if (appPhase === 'initializing') {
        return <GameLoadingScreen progress={loadingProgress} />;
    }

    // Main Game UI
    return (
        <main
            className="relative flex h-screen w-full flex-col font-sans overflow-hidden bg-slate-950 text-white"
            style={{ fontFamily: '"Chakra Petch", sans-serif' }}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <ElevatorShaftBackground />
            <ErrorToast error={game.error} onClose={game.clearError} />
            <DropzoneOverlay isVisible={isDragOver} />
             {/* Accessibility: ARIA Live Region for screen readers */}
            <div className="sr-only" aria-live="polite" role="status">
                {liveRegionMessage}
            </div>

            {/* Header */}
            <header className="relative z-20 flex w-full flex-shrink-0 items-center justify-between p-4">
                <div className="bg-slate-900/50 p-2 rounded-md flex items-center gap-2 border border-slate-700/50 shadow-md">
                    <span className="text-amber-400 font-bold text-lg" style={{textShadow: '0 0 5px #ffc700'}}>
                        {formatCurrency(game.balance)}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                     <div
                        className="hidden sm:flex items-center gap-1 bg-slate-900/50 p-1 rounded-md border border-slate-700/50"
                        onMouseEnter={() => setVolumeSliderVisible(true)}
                        onMouseLeave={() => setVolumeSliderVisible(false)}
                     >
                        {/* Master Volume Button */}
                        <button onClick={() => setMuted(!isMuted)} className="p-2 rounded-full hover:bg-slate-700/50 active:scale-90 transition-all" aria-label={isMuted ? "Unmute" : "Mute"}>
                            {isMuted ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-400">
                                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM18.28 17.28a.75.75 0 001.06-1.06l-7.5-7.5a.75.75 0 00-1.06 1.06l7.5 7.5z" />
                                    <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 11-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-400">
                                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                                    <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                                </svg>
                            )}
                        </button>
                        {/* Volume Slider with transition */}
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isVolumeSliderVisible ? 'w-24 opacity-100' : 'w-0 opacity-0'}`}>
                            <VolumeControl volume={volume} onVolumeChange={setVolume} />
                        </div>
                        {/* Operator Mute Button */}
                        <button onClick={() => setOperatorMuted(!isOperatorMuted)} className="p-2 rounded-full hover:bg-slate-700/50 active:scale-90 transition-all" aria-label={isOperatorMuted ? "Unmute operator voice" : "Mute operator voice"}>
                            {isOperatorMuted ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-400">
                                    <path d="M13.5 18.75a3.375 3.375 0 01-3.375-3.375V6.375a3.375 3.375 0 016.75 0v8.999a3.375 3.375 0 01-3.375 3.375z" />
                                    <path d="M6 10.5v.75c0 3.31 2.69 6 6 6s6-2.69 6-6v-.75h-1.5v.75c0 2.48-2.02 4.5-4.5 4.5s-4.5-2.02-4.5-4.5v-.75H6z" />
                                    <path d="M4.125 4.125a.75.75 0 011.06 0l14.69 14.69a.75.75 0 11-1.06 1.06L4.125 5.185a.75.75 0 010-1.06z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-400">
                                    <path d="M12 18.75a3.375 3.375 0 003.375-3.375V6.375a3.375 3.375 0 00-6.75 0v8.999c0 1.861 1.514 3.375 3.375 3.375z" />
                                    <path d="M6 10.5v.75c0 3.31 2.69 6 6 6s6-2.69 6-6v-.75h-1.5v.75c0 2.48-2.02 4.5-4.5 4.5s-4.5-2.02-4.5-4.5v-.75H6z" />
                                </svg>
                            )}
                        </button>
                    </div>
                     <button
                        onClick={() => setAchievementsOpen(true)}
                        className="group hidden sm:block p-2 rounded-full hover:bg-slate-800/80 active:scale-95 transition-all bg-slate-900/50 border border-amber-500/40 shadow-lg shadow-amber-500/20 hover:shadow-amber-400/40"
                        aria-label="Open achievements panel"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-amber-400 group-hover:text-amber-300 transition-colors duration-200">
                           <path fillRule="evenodd" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10ZM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" clipRule="evenodd" />
                        </svg>
                    </button>
                     <button
                        className="lg:hidden bg-slate-800/80 p-3 rounded-full text-white hover:bg-slate-700/80 active:scale-90 transition-all"
                        onClick={() => setStatsPanelOpen(true)}
                        aria-label="Open stats panel"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M1 1.75A.75.75 0 0 1 1.75 1h16.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 1.75ZM1 6.25A.75.75 0 0 1 1.75 5.5h16.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 6.25ZM1.75 10a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H1.75Z" /><path d="M1.75 15.5a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Zm3.75 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Zm3.75 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Z" /></svg>
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="relative z-10 flex flex-1 flex-col items-center min-h-0">
                 {/* Desktop Layout Wrapper */}
                <div className="relative hidden h-full w-full max-w-[1600px] justify-center gap-12 px-4 lg:flex xl:gap-16 xl:px-8 items-center">
                    {/* Left Control Wing (Stats) */}
                    <aside className="w-full max-w-[250px] flex-shrink-0 xl:max-w-[300px]">
                        <StatsAndHistoryPanel
                            history={game.history}
                            sessionProfit={game.sessionProfit}
                            formatCurrency={formatCurrency}
                        />
                    </aside>

                    {/* Central Shaft Content */}
                    <section className="flex h-full max-w-[480px] flex-shrink-0 flex-col items-center justify-center xl:max-w-lg">
                        <div className="flex flex-col items-center relative w-full gap-4">
                            <div className="w-44 sm:w-64 lg:w-80 xl:w-96 flex items-center justify-center">
                                <ElevatorIndicator
                                    gameStatus={game.gameStatus}
                                    lastResult={game.lastResult}
                                    targetMultiplier={game.targetMultiplier}
                                    isInstantBet={isInstantBet}
                                />
                            </div>
                            <Elevator
                                gameStatus={game.gameStatus}
                                lastResult={game.lastResult}
                                targetMultiplier={game.targetMultiplier}
                                isInstantBet={isInstantBet}
                            />
                        </div>
                    </section>

                    {/* Right Control Wing (Controls) */}
                    <aside className="w-full max-w-[250px] flex-shrink-0 xl:max-w-[300px]">
                        <Controls
                            betAmount={game.betAmount}
                            setBetAmount={game.setBetAmount}
                            targetMultiplier={game.targetMultiplier}
                            setTargetMultiplier={game.setTargetMultiplier}
                            placeBet={game.placeBet}
                            balance={game.balance}
                            canBet={game.canBet}
                            gameStatus={game.gameStatus}
                            history={game.history}
                            isAutoBetting={game.isAutoBetting}
                            startAutoBet={game.startAutoBet}
                            stopAutoBet={game.stopAutoBet}
                            betsRemaining={game.betsRemaining}
                            openRules={() => setRulesOpen(true)}
                            openMath={() => setMathOpen(true)}
                            toggleFairness={() => setFairnessOpen(!isFairnessOpen)}
                            maxBet={game.betLimits.maxBet}
                            isInstantBet={isInstantBet}
                            toggleInstantBet={() => setInstantBet(!isInstantBet)}
                            isBetAmountInvalid={game.isBetAmountInvalid}
                            t={t}
                        />
                    </aside>
                </div>

                {/* Mobile Layout (Refactored) */}
                <div className="lg:hidden flex flex-1 flex-col w-full items-center justify-end gap-4 p-4">
                    {/* Mobile Central Shaft Content */}
                    <section className="flex w-full max-w-lg flex-col items-center">
                        <div className="flex flex-col items-center relative w-full gap-4">
                            <div className="w-44 sm:w-64 flex items-center justify-center">
                                <ElevatorIndicator
                                    gameStatus={game.gameStatus}
                                    lastResult={game.lastResult}
                                    targetMultiplier={game.targetMultiplier}
                                    isInstantBet={isInstantBet}
                                />
                            </div>
                            <Elevator
                                gameStatus={game.gameStatus}
                                lastResult={game.lastResult}
                                targetMultiplier={game.targetMultiplier}
                                isInstantBet={isInstantBet}
                            />
                        </div>
                    </section>

                    {/* Mobile Controls */}
                    <aside className="relative z-20 w-full">
                        <div className="mx-auto max-w-sm">
                            <Controls
                                betAmount={game.betAmount}
                                setBetAmount={game.setBetAmount}
                                targetMultiplier={game.targetMultiplier}
                                setTargetMultiplier={game.setTargetMultiplier}
                                placeBet={game.placeBet}
                                balance={game.balance}
                                canBet={game.canBet}
                                gameStatus={game.gameStatus}
                                history={game.history}
                                isAutoBetting={game.isAutoBetting}
                                startAutoBet={game.startAutoBet}
                                stopAutoBet={game.stopAutoBet}
                                betsRemaining={game.betsRemaining}
                                openRules={() => setRulesOpen(true)}
                                openMath={() => setMathOpen(true)}
                                toggleFairness={() => setFairnessOpen(!isFairnessOpen)}
                                maxBet={game.betLimits.maxBet}
                                isInstantBet={isInstantBet}
                                toggleInstantBet={() => setInstantBet(!isInstantBet)}
                                isBetAmountInvalid={game.isBetAmountInvalid}
                                t={t}
                            />
                        </div>
                    </aside>
                </div>
            </div>

            {/* Achievement Toasts */}
            <div className="absolute bottom-4 right-4 z-50 w-full max-w-sm">
                {achievementToastQueue.length > 0 && (
                    <AchievementToast
                        key={achievementToastQueue[0].id}
                        achievement={achievementToastQueue[0]}
                        onClose={() => {
                            setAchievementToastQueue(prev => prev.slice(1));
                        }}
                    />
                )}
            </div>

            {/* Mobile Stats Panel (Modal-like) */}
            {isStatsPanelOpen && (
                 <div className="fixed inset-0 bg-black/70 z-30 lg:hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4">
                         <StatsAndHistoryPanel
                            history={game.history}
                            sessionProfit={game.sessionProfit}
                            formatCurrency={formatCurrency}
                            onClose={() => setStatsPanelOpen(false)}
                        />
                    </div>
                 </div>
            )}

            {/* Modals & Overlays */}
            <AchievementsPanel
                isOpen={isAchievementsOpen}
                onClose={() => setAchievementsOpen(false)}
                unlockedIds={game.unlockedAchievements}
            />
            <RulesModal isOpen={isRulesOpen} onClose={() => setRulesOpen(false)} t={t} />
            <MathModal
                isOpen={isMathOpen}
                onClose={() => setMathOpen(false)}
                targetMultiplier={game.targetMultiplier}
                t={t}
            />
            {isFairnessOpen && (
                <div
                    ref={fairnessContainerRef}
                    tabIndex={-1}
                    className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-40 focus:outline-none"
                    onClick={() => setFairnessOpen(false)}
                >
                    <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md">
                         <ProvablyFairControls
                            clientSeed={game.clientSeed}
                            setClientSeed={game.setClientSeed}
                            serverSeedHash={game.serverSeedHash}
                            nonce={game.nonce}
                            rotateServerSeed={game.rotateServerSeed}
                            isBetting={game.gameStatus === GameStatus.PLAYING}
                        />
                    </div>
                </div>
            )}
            {isRealityCheckVisible && (
                <RealityCheckModal
                    onClose={() => setRealityCheckVisible(false)}
                    sessionStartTime={game.sessionStartTime}
                    totalWagered={game.totalWagered}
                    sessionProfit={game.sessionProfit}
                    formatCurrency={formatCurrency}
                    t={t}
                />
            )}
        </main>
    );
};

export default App;