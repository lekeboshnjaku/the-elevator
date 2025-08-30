



import React, { useState } from 'react';
import { GameStatus, AutoBetSettings, AutoBetAction, HistoryEntry } from '../types';
import HistoryBar from './HistoryBar';
import { HOUSE_EDGE } from '../constants';

interface ControlsProps {
  betAmount: string;
  setBetAmount: (value: string) => void;
  targetMultiplier: string;
  setTargetMultiplier: (value: string) => void;
  placeBet: () => void;
  balance: number;
  canBet: boolean;
  gameStatus: GameStatus;
  history: HistoryEntry[];
  isAutoBetting: boolean;
  startAutoBet: (settings: AutoBetSettings) => void;
  stopAutoBet: () => void;
  betsRemaining: number;
  openRules: () => void;
  openMath: () => void;
  toggleFairness: () => void;
  maxBet: number;
  isInstantBet: boolean;
  toggleInstantBet: () => void;
  isBetAmountInvalid: boolean;
  t: (key: string, ...args: any[]) => string;
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`w-full py-2.5 text-sm font-bold uppercase tracking-wider transition-all relative ${
            active ? 'text-orange-400' : 'text-slate-500 hover:text-orange-300'
        }`}
    >
        {children}
        {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400 shadow-[0_0_8px_0_#fb923c]"></div>}
    </button>
);

const IconButton: React.FC<{ onClick: () => void; title: string; children: React.ReactNode; }> = ({ onClick, title, children }) => (
    <button onClick={onClick} className="group flex items-center gap-1.5" title={title}>
        {children}
    </button>
);


const ManualBetPanel: React.FC<Pick<ControlsProps, 'betAmount' | 'setBetAmount' | 'targetMultiplier' | 'setTargetMultiplier' | 'balance' | 'isAutoBetting' | 'maxBet' | 'isBetAmountInvalid' | 't'>> = (props) => {
    const handleBetAmountAction = (action: 'min' | 'max' | '/2' | 'x2') => {
        const currentBet = parseFloat(props.betAmount) || 0;
        let newBet: number;
        switch (action) {
            case 'min': newBet = 0.01; break;
            case 'max': newBet = props.maxBet; break; // Use RGS maxBet
            case '/2': newBet = currentBet / 2; break;
            case 'x2': newBet = currentBet * 2; break;
        }
        const clampedBet = Math.max(0.01, Math.min(props.balance, newBet));
        props.setBetAmount(clampedBet.toFixed(2));
    };

    const target = parseFloat(props.targetMultiplier) || 0;
    const winChance = (target >= 1.01) ? ((1 - HOUSE_EDGE) / target) * 100 : 0;

    return (
        <div className="space-y-3">
            <InputField label={props.t('betAmount')} value={props.betAmount} onChange={(e) => props.setBetAmount(e.target.value)} disabled={props.isAutoBetting} isInvalid={props.isBetAmountInvalid} />
            <div className="grid grid-cols-4 gap-2">
                <BetControlButton onClick={() => handleBetAmountAction('min')} disabled={props.isAutoBetting}>Min</BetControlButton>
                <BetControlButton onClick={() => handleBetAmountAction('max')} disabled={props.isAutoBetting}>Max</BetControlButton>
                <BetControlButton onClick={() => handleBetAmountAction('/2')} disabled={props.isAutoBetting}>/2</BetControlButton>
                <BetControlButton onClick={() => handleBetAmountAction('x2')} disabled={props.isAutoBetting}>x2</BetControlButton>
            </div>
             <div className="grid grid-cols-2 gap-3">
                <InputField label={props.t('targetMultiplier')} value={props.targetMultiplier} onChange={(e) => props.setTargetMultiplier(e.target.value)} disabled={props.isAutoBetting} />
                <div className="relative">
                    <span className="absolute left-3 top-1 text-xs text-slate-400 uppercase tracking-wider">{props.t('winChance')}</span>
                    <div className="w-full bg-slate-950/50 rounded-md pt-4 pb-1 sm:pt-6 sm:pb-2 px-3 text-white font-mono text-sm sm:text-lg transition-all duration-300 border border-slate-700 shadow-inner h-full flex items-center">
                        <span>{winChance.toFixed(4)}%</span>
                    </div>
                </div>
             </div>
        </div>
    );
};

const AutoBetPanel: React.FC<{ settings: Omit<AutoBetSettings, 'baseBet'>, setSettings: React.Dispatch<React.SetStateAction<Omit<AutoBetSettings, 'baseBet'>>>, isAutoBetting: boolean }> = ({ settings, setSettings, isAutoBetting }) => {
    const handleValueChange = (field: keyof typeof settings, value: string | number | null | AutoBetAction) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <InputField label="Number of Bets" value={String(settings.numberOfBets)} onChange={(e) => handleValueChange('numberOfBets', parseInt(e.target.value) || 0)} disabled={isAutoBetting} />
                <InputField label="Base Bet" value="Uses current bet" disabled={true} />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <AutoBetConditionControl
                    label="On Win"
                    action={settings.onWinAction}
                    value={settings.onWinValue}
                    onActionChange={(val) => handleValueChange('onWinAction', val)}
                    onValueChange={(val) => handleValueChange('onWinValue', parseFloat(val) || 0)}
                    disabled={isAutoBetting}
                />
                <AutoBetConditionControl
                    label="On Loss"
                    action={settings.onLossAction}
                    value={settings.onLossValue}
                    onActionChange={(val) => handleValueChange('onLossAction', val)}
                    onValueChange={(val) => handleValueChange('onLossValue', parseFloat(val) || 0)}
                    disabled={isAutoBetting}
                />
            </div>
            <div className="grid grid-cols-2 gap-3">
                 <InputField label="Stop on Profit" type="number" placeholder="0.00" value={settings.stopOnProfit === null ? '' : String(settings.stopOnProfit)} onChange={(e) => handleValueChange('stopOnProfit', e.target.value ? parseFloat(e.target.value) : null)} disabled={isAutoBetting}/>
                 <InputField label="Stop on Loss" type="number" placeholder="0.00" value={settings.stopOnLoss === null ? '' : String(settings.stopOnLoss)} onChange={(e) => handleValueChange('stopOnLoss', e.target.value ? parseFloat(e.target.value) : null)} disabled={isAutoBetting}/>
            </div>
        </div>
    );
}

const AutoBetConditionControl: React.FC<{ label: string, action: AutoBetAction, value: number, onActionChange: (action: AutoBetAction) => void, onValueChange: (value: string) => void, disabled: boolean }> = (props) => (
    <div className="bg-slate-950/50 rounded-md border border-slate-700 shadow-inner">
        <label className="block text-xs text-slate-400 px-3 pt-1">{props.label}</label>
        <div className="flex items-center">
            <select value={props.action} onChange={(e) => props.onActionChange(e.target.value as AutoBetAction)} className="bg-transparent text-white font-mono text-sm focus:outline-none p-2 appearance-none" disabled={props.disabled}>
                <option value={AutoBetAction.RESET}>Reset</option>
                <option value={AutoBetAction.INCREASE_BY}>Increase by</option>
            </select>
            {props.action === AutoBetAction.INCREASE_BY && (
                <div className="flex items-center">
                    <input type="number" value={props.value} onChange={(e) => props.onValueChange(e.target.value)} className="w-12 bg-transparent text-white font-mono text-sm focus:outline-none" disabled={props.disabled} />
                    <span className="text-slate-400 text-sm">%</span>
                </div>
            )}
        </div>
    </div>
);


const InputField: React.FC<{ label: string; value: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean; type?: string; placeholder?: string; isInvalid?: boolean }> = ({ label, value, onChange, disabled, type = "number", placeholder, isInvalid }) => (
    <div className="relative">
        <span className="absolute left-3 top-1 text-xs text-slate-400 uppercase tracking-wider">{label}</span>
        <input
            type={type}
            step={type === 'number' ? '0.01' : undefined}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full bg-slate-950/50 rounded-md pt-4 pb-1 sm:pt-6 sm:pb-2 px-3 text-white font-mono text-sm sm:text-lg focus:outline-none transition-all border border-slate-700 shadow-inner disabled:opacity-50 ${isInvalid ? 'ring-2 ring-red-500/70 focus:ring-red-500' : 'focus:ring-2 focus:ring-orange-500 focus:shadow-[0_0_15px_rgba(251,146,60,0.5),_inset_0_0_8px_rgba(251,146,60,0.4)]'}`}
        />
    </div>
);

const BetControlButton: React.FC<{ onClick: () => void; children: React.ReactNode; disabled?: boolean; }> = ({ onClick, children, disabled }) => (
    <button onClick={onClick} disabled={disabled} className="w-full bg-slate-800/70 hover:bg-slate-700/70 rounded text-slate-300 text-xs sm:py-1.5 py-2.5 transition-all duration-200 disabled:opacity-50 disabled:hover:bg-slate-800/70 border border-slate-700 hover:border-orange-400 hover:text-orange-300">
        {children}
    </button>
);

const Controls: React.FC<ControlsProps> = (props) => {
  const { canBet, gameStatus, isAutoBetting, startAutoBet, stopAutoBet, placeBet, betAmount, history, t } = props;
  const [activeTab, setActiveTab] = useState<'manual' | 'auto'>('manual');
  
  const [autoSettings, setAutoSettings] = useState<Omit<AutoBetSettings, 'baseBet'>>({
      numberOfBets: 100,
      onWinAction: AutoBetAction.RESET,
      onWinValue: 0,
      onLossAction: AutoBetAction.RESET,
      onLossValue: 0,
      stopOnProfit: null,
      stopOnLoss: null,
  });

  const handleMainButtonClick = () => {
    if (isAutoBetting) {
        stopAutoBet();
    } else if (activeTab === 'manual') {
        placeBet();
    } else { // activeTab === 'auto'
        const fullSettings: AutoBetSettings = {
            ...autoSettings,
            baseBet: parseFloat(betAmount),
        };
        startAutoBet(fullSettings);
    }
  };

  const getButtonText = () => {
      if (isAutoBetting) return t('betsRemaining', props.betsRemaining);
      if (gameStatus === GameStatus.PLAYING) return props.isInstantBet ? t('resolving') : t('ascending');
      if (activeTab === 'auto') return t('startAutoBet');
      return t('placeBet');
  }
  
  const isButtonDisabled = () => {
      if (isAutoBetting) return false; // Stop button should always be enabled
      if (gameStatus !== GameStatus.IDLE) return true;
      if (activeTab === 'manual') return !canBet;
      // For auto bet, check if betAmount is valid before starting
      const bet = parseFloat(betAmount);
      return isNaN(bet) || bet <= 0 || bet > props.balance;
  }

  const mainButtonAnimation = !isAutoBetting && !isButtonDisabled() ? 'animate-orange-pulse-glow' : '';

  return (
    <div className="w-full flex flex-col gap-4">
        <div className="w-full bg-gradient-to-b from-black/60 to-black/40 rounded-lg shadow-2xl border border-slate-700/80">
            <div className="flex justify-between items-center border-b-2 border-slate-950/50">
                <div className="grid grid-cols-2 w-1/2">
                    <TabButton active={activeTab === 'manual'} onClick={() => setActiveTab('manual')}>{t('manual')}</TabButton>
                    <TabButton active={activeTab === 'auto'} onClick={() => setActiveTab('auto')}>{t('auto')}</TabButton>
                </div>
                 <div className="flex items-center gap-4 pr-4">
                    <IconButton onClick={props.toggleInstantBet} title="Toggle Instant Bet">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 transition-colors ${props.isInstantBet ? 'text-orange-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                            <path d="M11.983 1.904a.75.75 0 0 0-1.292-.904l-7.25 10.5a.75.75 0 0 0 .644 1.25h3.322l-2.305 4.5a.75.75 0 0 0 1.292.904l7.25-10.5a.75.75 0 0 0-.644-1.25h-3.322l2.305-4.5Z" />
                        </svg>
                    </IconButton>
                    <button onClick={props.openRules} className="text-xs text-slate-400 hover:text-white uppercase tracking-wider">{t('rules')}</button>
                    <button onClick={props.toggleFairness} className="text-xs text-slate-400 hover:text-white uppercase tracking-wider">{t('fairness')}</button>
                </div>
            </div>

            <div className="p-2 sm:p-4 space-y-1.5 sm:space-y-4">
                {activeTab === 'manual' ? (
                    <ManualBetPanel {...props} />
                ) : (
                    <AutoBetPanel settings={autoSettings} setSettings={setAutoSettings} isAutoBetting={isAutoBetting} />
                )}
                
                <button
                    onClick={handleMainButtonClick}
                    disabled={isButtonDisabled()}
                    className={`w-full py-1.5 sm:py-3 lg:py-5 rounded-lg text-sm sm:text-xl font-bold uppercase tracking-wider sm:tracking-widest transition-all duration-300 transform
                    ${isButtonDisabled()
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed border-b-4 border-slate-800'
                        : isAutoBetting
                            ? 'bg-gradient-to-b from-red-500 to-red-700 text-white hover:from-red-400 hover:to-red-600 active:scale-[0.98] border-b-4 border-red-900 shadow-lg shadow-red-600/30'
                            : 'bg-gradient-to-b from-orange-500 to-orange-700 text-slate-900 hover:from-orange-400 hover:to-orange-600 active:scale-[0.98] border-b-4 border-orange-900 shadow-2xl'
                    } ${mainButtonAnimation}`}
                >
                    {getButtonText()}
                </button>
            </div>
        </div>
        <HistoryBar history={history} />
    </div>
  );
};

export default Controls;