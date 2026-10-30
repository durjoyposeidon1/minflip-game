import React from 'react';
import { Play, RotateCcw, Grid, Volume2, VolumeX, Vibrate, X } from 'lucide-react';
import { sound } from '../../services/sound';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onGoHome: () => void;
  onGoLevels: () => void;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  onToggleSound: () => void;
  onToggleHaptics: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onResume,
  onRestart,
  onGoHome,
  onGoLevels,
  soundEnabled,
  hapticsEnabled,
  onToggleSound,
  onToggleHaptics,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-pop">
      <div className="w-full max-w-xs bg-slate-900 border-2 border-indigo-500/40 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center">
        <h3 className="font-display font-bold text-2xl text-white mb-1">Paused</h3>
        <p className="text-xs text-slate-400 mb-6">Take a breather, genius</p>

        {/* Action Buttons */}
        <div className="space-y-3 w-full">
          <button
            onClick={() => {
              sound.playTap();
              onResume();
            }}
            className="game-btn w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-indigo-500/20"
          >
            <Play className="w-4 h-4 fill-current" /> Resume Game
          </button>

          <button
            onClick={() => {
              sound.playTap();
              onRestart();
            }}
            className="game-btn w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 active:scale-95"
          >
            <RotateCcw className="w-4 h-4" /> Restart Level
          </button>

          <button
            onClick={() => {
              sound.playTap();
              onGoLevels();
            }}
            className="game-btn w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 active:scale-95"
          >
            <Grid className="w-4 h-4" /> Select Level
          </button>
        </div>

        {/* Quick Audio & Haptics toggles */}
        <div className="flex items-center justify-center gap-4 mt-6 pt-5 border-t border-slate-800 w-full">
          <button
            onClick={() => {
              sound.playTap();
              onToggleSound();
            }}
            className={`p-3 rounded-xl border transition-colors ${
              soundEnabled
                ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <button
            onClick={() => {
              sound.playTap();
              onToggleHaptics();
            }}
            className={`p-3 rounded-xl border transition-colors ${
              hapticsEnabled
                ? 'bg-amber-600/20 border-amber-500/50 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
            title="Toggle Vibration"
          >
            <Vibrate className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
