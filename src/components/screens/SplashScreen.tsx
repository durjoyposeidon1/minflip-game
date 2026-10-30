import React, { useEffect } from 'react';
import { Sparkles, Brain } from 'lucide-react';
import { sound } from '../../services/sound';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    // Sound chime on splash
    const timerAudio = setTimeout(() => {
      sound.playTap();
    }, 400);

    // Auto-advance after 2.4s or on click
    const timer = setTimeout(() => {
      onFinish();
    }, 2400);

    return () => {
      clearTimeout(timerAudio);
      clearTimeout(timer);
    };
  }, [onFinish]);

  return (
    <div
      onClick={onFinish}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white cursor-pointer select-none p-6"
    >
      {/* Glow aura */}
      <div className="absolute w-72 h-72 rounded-full bg-indigo-500/20 filter blur-3xl animate-pulse pointer-events-none" />

      {/* Main Animated Logo Icon */}
      <div className="relative mb-6 animate-pop">
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-400 p-1 shadow-2xl shadow-indigo-500/40 transform hover:scale-105 transition-transform">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center relative overflow-hidden">
            <span className="text-6xl animate-float">🧠</span>
            <div className="absolute -top-1 -right-1 text-2xl animate-bounce">💡</div>
          </div>
        </div>
      </div>

      {/* Title */}
      <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight bg-gradient-to-r from-amber-300 via-indigo-200 to-teal-300 bg-clip-text text-transparent">
        MindFlip
      </h1>

      {/* Tagline */}
      <p className="text-sm sm:text-base text-indigo-300 font-medium tracking-wide mt-2">
        “Think Different. Solve Everything.”
      </p>

      {/* Subtitle features */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mt-6">
        <span>100 Levels</span>
        <span>·</span>
        <span>5 Chapters</span>
        <span>·</span>
        <span>Original Puzzles</span>
      </div>

      {/* Loading indicator / Tap to start */}
      <div className="mt-12 flex flex-col items-center gap-2">
        <div className="w-36 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-amber-400 to-indigo-500 animate-[pulse_1.5s_infinite]" />
        </div>
        <span className="text-[11px] text-slate-500 tracking-wider uppercase mt-1">
          Tap anywhere to start
        </span>
      </div>
    </div>
  );
};
