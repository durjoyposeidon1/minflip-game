import React from 'react';
import { Coins, Star, ArrowLeft, Settings as SettingsIcon, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { sound } from '../../services/sound';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  coins: number;
  stars?: number;
  onOpenSettings?: () => void;
  onOpenDailyBonus?: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
  coins,
  stars,
  onOpenSettings,
  onOpenDailyBonus,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="w-full flex items-center justify-between px-4 py-3 bg-slate-950/80 backdrop-blur border-b border-slate-800/80 sticky top-0 z-40 select-none">
      {/* Left: Back button or Logo mark */}
      <div className="flex items-center gap-2.5">
        {showBack && onBack ? (
          <button
            onClick={() => {
              sound.playTap();
              onBack();
            }}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors active:scale-95"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : null}

        {title ? (
          <h2 className="font-display font-bold text-base sm:text-lg text-white truncate max-w-[160px] sm:max-w-xs">
            {title}
          </h2>
        ) : (
          <div className="flex items-center gap-1.5 cursor-pointer">
            <span className="text-xl">🧠</span>
            <span className="font-display font-extrabold text-lg tracking-tight bg-gradient-to-r from-amber-400 via-indigo-300 to-teal-400 bg-clip-text text-transparent">
              MindFlip
            </span>
          </div>
        )}
      </div>

      {/* Right: Stars, Coins, Settings */}
      <div className="flex items-center gap-2">
        {/* Stars count (if provided) */}
        {typeof stars === 'number' && (
          <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/15 border border-amber-400/25 rounded-full text-xs font-bold text-amber-300">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="tabular-nums">{stars}</span>
          </div>
        )}

        {/* Coins counter */}
        <button
          onClick={() => {
            sound.playCoin();
            if (onOpenDailyBonus) onOpenDailyBonus();
          }}
          className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-full text-xs font-bold text-amber-300 hover:scale-105 active:scale-95 transition-transform"
          title="Coins Bank (Tap for bonus)"
        >
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <span className="tabular-nums font-mono">{coins}</span>
          <span className="text-[10px] text-amber-400/80 hidden sm:inline">+</span>
        </button>

        {/* Quick Sound Toggle (if available) */}
        {onToggleSound && typeof soundEnabled === 'boolean' && (
          <button
            onClick={() => {
              sound.playTap();
              onToggleSound();
            }}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors hidden sm:block"
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
          </button>
        )}

        {/* Settings button */}
        {onOpenSettings && (
          <button
            onClick={() => {
              sound.playTap();
              onOpenSettings();
            }}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors active:scale-95"
            aria-label="Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
