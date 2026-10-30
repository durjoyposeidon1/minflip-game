import React, { useEffect } from 'react';
import { Star, Coins, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import { sound } from '../../services/sound';

interface CorrectModalProps {
  isOpen: boolean;
  stars: number;
  coinsEarned: number;
  explanation: string;
  onNextLevel: () => void;
  onReplay: () => void;
  isLastLevel?: boolean;
}

export const CorrectModal: React.FC<CorrectModalProps> = ({
  isOpen,
  stars,
  coinsEarned,
  explanation,
  onNextLevel,
  onReplay,
  isLastLevel = false,
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playSuccess();
      // Staggered star audio pops
      for (let i = 0; i < stars; i++) {
        setTimeout(() => sound.playStar(i), 300 + i * 250);
      }
    }
  }, [isOpen, stars]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-pop">
      <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-indigo-500/50 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mb-3 animate-bounce">
          <CheckCircle2 className="w-9 h-9 text-emerald-400" />
        </div>

        <h2 className="text-2xl font-display font-bold text-white tracking-wide">
          Brilliant Thinking!
        </h2>
        <p className="text-xs text-indigo-300 mt-0.5">MindFlip Cleared</p>

        {/* Stars */}
        <div className="flex items-center justify-center gap-2 my-4">
          {[1, 2, 3].map((starNum) => {
            const isEarned = starNum <= stars;
            return (
              <div
                key={starNum}
                className={`transition-all duration-300 transform ${
                  isEarned
                    ? 'scale-110 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                    : 'scale-90 text-slate-700'
                }`}
              >
                <Star
                  className={`w-9 h-9 ${
                    isEarned ? 'fill-amber-400' : 'fill-slate-800'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Coins Reward Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-400/30 rounded-full mb-4">
          <Coins className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-bold text-amber-300">+{coinsEarned} Coins Earned</span>
        </div>

        {/* Explanation Card */}
        <div className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl p-4 text-left mb-6 max-h-40 overflow-y-auto">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-indigo-400 mb-1">
            Why It Works:
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {explanation}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 w-full">
          <button
            onClick={() => {
              sound.playTap();
              onReplay();
            }}
            className="game-btn flex-1 py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95"
          >
            <RotateCcw className="w-4 h-4" /> Replay
          </button>
          <button
            onClick={() => {
              sound.playTap();
              onNextLevel();
            }}
            className="game-btn flex-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <span>{isLastLevel ? 'All Levels Won!' : 'Next Level'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
