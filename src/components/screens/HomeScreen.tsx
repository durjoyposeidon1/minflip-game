import React from 'react';
import { UserGameProgress } from '../../types/game';
import { sound } from '../../services/sound';
import {
  Play,
  Flame,
  Trophy,
  Settings,
  Sparkles,
  ChevronRight,
  Brain,
  Lightbulb,
  Smartphone,
  Gift,
  HelpCircle,
} from 'lucide-react';
import { CHAPTERS } from '../../data/chapters';

interface HomeScreenProps {
  progress: UserGameProgress;
  onPlayLevel: (levelId: number) => void;
  onNavigate: (screen: any) => void;
  onOpenDailyBonus: () => void;
  onOpenCapacitorGuide: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  progress,
  onPlayLevel,
  onNavigate,
  onOpenDailyBonus,
  onOpenCapacitorGuide,
}) => {
  const completedCount = Object.keys(progress.completedLevels).length;
  const totalStars = Object.values(progress.completedLevels).reduce(
    (sum, l) => sum + (l.stars || 0),
    0
  );
  const nextLevelToPlay = Math.min(progress.unlockedLevels, 100);

  // Active chapter
  const currentChapter =
    CHAPTERS.find(
      (c) => nextLevelToPlay >= c.startLevel && nextLevelToPlay <= c.endLevel
    ) || CHAPTERS[0];

  const handleContinue = () => {
    sound.playTap();
    onPlayLevel(nextLevelToPlay);
  };

  return (
    <div className="flex-1 w-full max-w-md mx-auto flex flex-col p-4 pb-8 space-y-4">
      {/* 1. Player Profile Banner */}
      <div className="w-full bg-gradient-to-r from-slate-900 to-indigo-950/80 border border-slate-800 rounded-3xl p-4 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border-2 border-indigo-400/50 flex items-center justify-center text-3xl shadow-inner">
            {progress.profile.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-base text-white">
                {progress.profile.name}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-400/30">
                {progress.profile.title}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span>{completedCount} / 100 Solved</span>
              <span>·</span>
              <span className="text-amber-400 font-semibold">{totalStars} ★ Stars</span>
            </div>
          </div>
        </div>

        {/* Daily streak pill button */}
        <button
          onClick={() => {
            sound.playTap();
            onOpenDailyBonus();
          }}
          className="flex flex-col items-center p-2 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 transition-all active:scale-95"
          title="Daily Streak Rewards"
        >
          <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
          <span className="text-[11px] font-bold text-amber-300 mt-0.5">
            {progress.daily.currentStreak}d Streak
          </span>
        </button>
      </div>

      {/* 2. Primary CTA: Continue Playing Big Tactile Card */}
      <div className="w-full bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl p-5 shadow-xl shadow-indigo-600/25 text-white flex flex-col relative overflow-hidden">
        {/* Glow orb */}
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-amber-400/20 filter blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3 z-10">
          <span className="text-xs uppercase font-extrabold tracking-wider text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Next Challenge
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur font-semibold">
            Level {nextLevelToPlay} of 100
          </span>
        </div>

        <div className="mb-4 z-10">
          <h3 className="font-display font-black text-2xl text-white">
            {currentChapter.title}
          </h3>
          <p className="text-xs text-indigo-100/90 mt-0.5">
            {currentChapter.subtitle}
          </p>
        </div>

        {/* Progress bar inside chapter */}
        <div className="w-full bg-black/30 rounded-full h-2 mb-4 overflow-hidden z-10">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / 100) * 100}%` }}
          />
        </div>

        <button
          onClick={handleContinue}
          className="game-btn game-btn-shadow w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-black text-base flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] z-10 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>{completedCount === 0 ? 'Start MindFlip' : 'Continue Playing'}</span>
        </button>
      </div>

      {/* 3. Daily Challenge Banner */}
      <div
        onClick={() => {
          sound.playTap();
          onNavigate('daily_challenge');
        }}
        className="w-full bg-gradient-to-r from-slate-900 to-amber-950/40 border border-amber-500/30 rounded-3xl p-4 flex items-center justify-between cursor-pointer hover:border-amber-400/60 transition-all active:scale-[0.99] shadow"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-2xl">
            📅
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-display font-bold text-sm text-white">Daily Challenge</h4>
              {progress.daily.claimedRewardToday && (
                <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Solved Today
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Fresh date-seeded puzzle · +50 Bonus Coins
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-amber-400 shrink-0" />
      </div>

      {/* 4. Game Modes Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h4 className="font-display font-bold text-sm text-slate-200">Game Modes</h4>
          <button
            onClick={() => {
              sound.playTap();
              onNavigate('mode_select');
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Mode 1: Tricky Puzzle */}
          <div
            onClick={() => {
              sound.playTap();
              onNavigate('chapter_select');
            }}
            className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-400/40 cursor-pointer transition-all active:scale-[0.98] flex flex-col justify-between h-28"
          >
            <div className="text-2xl">🎭</div>
            <div>
              <div className="font-display font-bold text-xs text-white">Tricky Puzzle</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Riddles & Traps</div>
            </div>
          </div>

          {/* Mode 2: Math & Logic */}
          <div
            onClick={() => {
              sound.playTap();
              onNavigate('chapter_select');
            }}
            className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-400/40 cursor-pointer transition-all active:scale-[0.98] flex flex-col justify-between h-28"
          >
            <div className="text-2xl">⚡</div>
            <div>
              <div className="font-display font-bold text-xs text-white">Math & Logic</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Series & Matchsticks</div>
            </div>
          </div>

          {/* Mode 3: Visual Puzzle */}
          <div
            onClick={() => {
              sound.playTap();
              onNavigate('chapter_select');
            }}
            className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-400/40 cursor-pointer transition-all active:scale-[0.98] flex flex-col justify-between h-28"
          >
            <div className="text-2xl">🔍</div>
            <div>
              <div className="font-display font-bold text-xs text-white">Visual Puzzle</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Chameleons & Shadows</div>
            </div>
          </div>

          {/* Mode 4: Memory Challenge */}
          <div
            onClick={() => {
              sound.playTap();
              onNavigate('chapter_select');
            }}
            className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-purple-400/40 cursor-pointer transition-all active:scale-[0.98] flex flex-col justify-between h-28"
          >
            <div className="text-2xl">🃏</div>
            <div>
              <div className="font-display font-bold text-xs text-white">Memory Challenge</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Sequences & Cards</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Quick Utility Shortcuts: Achievements, Chapter Select, Android Capacitor */}
      <div className="grid grid-cols-3 gap-2 pt-2">
        <button
          onClick={() => {
            sound.playTap();
            onNavigate('achievements');
          }}
          className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex flex-col items-center text-center transition-colors active:scale-95"
        >
          <Trophy className="w-5 h-5 text-amber-400 mb-1" />
          <span className="text-[11px] font-semibold text-slate-200">Badges</span>
        </button>

        <button
          onClick={() => {
            sound.playTap();
            onNavigate('chapter_select');
          }}
          className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex flex-col items-center text-center transition-colors active:scale-95"
        >
          <Brain className="w-5 h-5 text-indigo-400 mb-1" />
          <span className="text-[11px] font-semibold text-slate-200">5 Chapters</span>
        </button>

        <button
          onClick={() => {
            sound.playTap();
            onOpenCapacitorGuide();
          }}
          className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex flex-col items-center text-center transition-colors active:scale-95"
        >
          <Smartphone className="w-5 h-5 text-emerald-400 mb-1" />
          <span className="text-[11px] font-semibold text-slate-200">APK Guide</span>
        </button>
      </div>
    </div>
  );
};
