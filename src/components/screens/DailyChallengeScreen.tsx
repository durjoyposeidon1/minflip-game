import React from 'react';
import { UserGameProgress, PuzzleLevel } from '../../types/game';
import { getDailyPuzzle } from '../../data/puzzles/allPuzzles';
import { sound } from '../../services/sound';
import { Calendar, Flame, Play, CheckCircle, Sparkles, Trophy } from 'lucide-react';

interface DailyChallengeScreenProps {
  progress: UserGameProgress;
  onPlayPuzzle: (puzzleId: number) => void;
  onOpenStreakModal: () => void;
}

export const DailyChallengeScreen: React.FC<DailyChallengeScreenProps> = ({
  progress,
  onPlayPuzzle,
  onOpenStreakModal,
}) => {
  const todayStr = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const dailyPuzzle = getDailyPuzzle();
  const isSolvedToday = progress.daily.todaySolved;

  return (
    <div className="flex-1 w-full max-w-md mx-auto flex flex-col p-4 pb-8 space-y-4">
      {/* Date Header */}
      <div className="text-center my-2">
        <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>{todayStr}</span>
        </div>
        <h2 className="font-display font-black text-2xl text-white">Daily Challenge</h2>
        <p className="text-xs text-slate-400 mt-1">
          One unique mental obstacle every single day to train cognitive agility
        </p>
      </div>

      {/* Streak Hero Card */}
      <div className="w-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-indigo-500/20 border border-amber-400/40 rounded-3xl p-5 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400/50 flex items-center justify-center text-3xl">
            🔥
          </div>
          <div>
            <div className="text-xs text-amber-300 font-semibold">Active Brain Streak</div>
            <div className="font-display font-black text-2xl text-white">
              {progress.daily.currentStreak} Days
            </div>
            <div className="text-[11px] text-slate-400">
              Highest Streak: {progress.daily.highestStreak} Days
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playTap();
            onOpenStreakModal();
          }}
          className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow"
        >
          View Rewards
        </button>
      </div>

      {/* Today's Featured Riddle Card */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-400/30 flex items-center justify-center text-3xl mb-3">
          💡
        </div>

        <span className="text-xs text-indigo-300 font-bold uppercase tracking-wider">
          Today's Enigma · Puzzle #{dailyPuzzle.id}
        </span>
        <h3 className="font-display font-bold text-lg text-white mt-1 mb-2">
          {dailyPuzzle.title}
        </h3>

        <p className="text-xs text-slate-300 line-clamp-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 mb-4 w-full text-left">
          "{dailyPuzzle.question}"
        </p>

        {/* Bonus reward info */}
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Reward: +{dailyPuzzle.rewardCoins + 25} Coins & Streak Boost</span>
        </div>

        {/* Play CTA */}
        {isSolvedToday ? (
          <div className="w-full py-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-sm flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span>Solved for Today! Return Tomorrow</span>
          </div>
        ) : (
          <button
            onClick={() => {
              sound.playTap();
              onPlayPuzzle(dailyPuzzle.id);
            }}
            className="game-btn w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-display font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Solve Today's Challenge</span>
          </button>
        )}
      </div>
    </div>
  );
};
