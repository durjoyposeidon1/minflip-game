import React, { useEffect } from 'react';
import { HelpCircle, RotateCcw, AlertCircle } from 'lucide-react';
import { sound } from '../../services/sound';

interface WrongModalProps {
  isOpen: boolean;
  onRetry: () => void;
  onOpenHints: () => void;
}

const QUOTES = [
  'Think different! Your first impulse might be a trap.',
  'Almost! Look at what was NOT said in the riddle.',
  'Tricky, isn\'t it? Take a fresh look from another perspective.',
  'Don\'t worry! Even geniuses need a second try.',
  'A puzzle is just an assumption waiting to be flipped.',
];

export const WrongModal: React.FC<WrongModalProps> = ({
  isOpen,
  onRetry,
  onOpenHints,
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playWrong();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-rose-500/40 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center animate-shake">
        {/* Wrong Icon */}
        <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center mb-3">
          <AlertCircle className="w-9 h-9 text-rose-400" />
        </div>

        <h2 className="text-2xl font-display font-bold text-white tracking-wide">
          Not Quite!
        </h2>
        <p className="text-xs text-rose-300 mt-0.5">MindFlip Trick Caught You</p>

        <p className="text-xs text-slate-300 my-5 bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5 italic leading-relaxed">
          "{quote}"
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2.5 w-full">
          <button
            onClick={() => {
              sound.playTap();
              onOpenHints();
            }}
            className="game-btn flex-1 py-3 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95"
          >
            <HelpCircle className="w-4 h-4" /> Need a Hint?
          </button>
          <button
            onClick={() => {
              sound.playTap();
              onRetry();
            }}
            className="game-btn flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-500/20 active:scale-95"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </div>
    </div>
  );
};
