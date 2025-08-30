import React from 'react';
import { Achievement, AchievementId } from '../types';

// Using a Map for easy lookup by ID. This contains all achievement definitions.
export const allAchievements = new Map<AchievementId, Achievement>([
    [
        AchievementId.SKY_RIDER,
        {
            id: AchievementId.SKY_RIDER,
            name: 'Sky Rider',
            description: 'Win with a multiplier of 10x or higher.',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
            )
        }
    ],
    [
        AchievementId.ROLLER,
        {
            id: AchievementId.ROLLER,
            name: 'Roller',
            description: 'Bet 50 or more in a single round.',
            icon: (
                 <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm0 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" clipRule="evenodd"/></svg>
            )
        }
    ],
    [
        AchievementId.BIG_ROLLER,
        {
            id: AchievementId.BIG_ROLLER,
            name: 'Big Roller',
            description: 'Bet 200 or more in a single round.',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 6a8 8 0 100 16 8 8 0 000-16zM12 4a8 8 0 100 16 8 8 0 000-16z" opacity=".6"/><path d="M12 2a8 8 0 100 16 8 8 0 000-16z"/></svg>
            )
        }
    ],
    [
        AchievementId.HIGH_ROLLER,
        {
            id: AchievementId.HIGH_ROLLER,
            name: 'High Roller',
            description: 'Bet 500 or more in a single round.',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5 16a8 8 0 1014 0 8 8 0 00-14 0z" opacity=".4"/><path d="M5 13a8 8 0 1014 0 8 8 0 00-14 0z" opacity=".6"/><path d="M5 10a8 8 0 1014 0 8 8 0 00-14 0z" opacity=".8"/><path d="M5 7a8 8 0 1014 0 8 8 0 00-14 0z"/><path d="M5 4.25l3-2.5 4 2.5 4-2.5 3 2.5V5H5v-.75z"/></svg>
            )
        }
    ],
    [
        AchievementId.ELEVATOR_JAMMER,
        {
            id: AchievementId.ELEVATOR_JAMMER,
            name: 'Elevator Jammer',
            description: 'Lose 5 rounds in a row.',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10ZM10.586 12 7.757 9.172l1.415-1.415L12 10.586l2.828-2.829 1.415 1.415L13.414 12l2.829 2.828-1.415 1.415L12 13.414l-2.828 2.829-1.415-1.415L10.586 12Z" clipRule="evenodd"/></svg>
            )
        }
    ],
    [
        AchievementId.LUCKY_LIFT,
        {
            id: AchievementId.LUCKY_LIFT,
            name: 'Lucky Lift',
            description: 'Win at exactly 2.00x three times in a row.',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M14 10a2 2 0 11-4 0 2 2 0 014 0zm-4 4a2 2 0 100 4 2 2 0 000-4zm4 0a2 2 0 100 4 2 2 0 000-4zm4-4a2 2 0 100-4 2 2 0 000 4zM11 2v9h2V2h-2z"/></svg>
            )
        }
    ],
    [
        AchievementId.RISK_TAKER,
        {
            id: AchievementId.RISK_TAKER,
            name: 'Risk Taker',
            description: 'Win with a multiplier of 20x or higher.',
            icon: (
                 <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.5l-8 8 8 8 8-8-8-8zM4.9 11.4l7.1-7.1 7.1 7.1-7.1 7.1-7.1-7.1z"/></svg>
            )
        }
    ],
    [
        AchievementId.PRECISION_PLAYER,
        {
            id: AchievementId.PRECISION_PLAYER,
            name: 'Precision Player',
            description: 'Win with a multiplier that exactly matches your target.',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12 21a9 9 0 100-18 9 9 0 000 18zm0-4a5 5 0 100-10 5 5 0 000 10zm0-2a3 3 0 100-6 3 3 0 000 6zm0-2a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/></svg>
            )
        }
    ]
]);