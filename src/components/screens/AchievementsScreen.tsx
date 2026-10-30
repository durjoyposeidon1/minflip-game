import React from 'react';
import { UserGameProgress, Achievement } from '../../types/game';
import { computeAchievements } from '../../data/achievements';
import { sound } from '../../services/sound';
import { Trophy, Check, Coins, Sparkles } from 'lucide-react';

interface AchievementsScreenProps {
  progress: UserGameProgress;
  onClaimAchievement: (id: string, coinsReward: number) => void;
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({
  progress,
  onClaimAchievement,
}) => {
  const achievements = computeAchievements(progress);
  const totalCompleted = achievements.filter((a) => a.completed).length;

  return (
    <div className="flex-1 w-full max-w-md mx-auto flex flex-col p-4 pb-8 space-y-4">
      {/* Header */}
      <div className="text-center my-2">
        <h2 className="font-display font-black text-2xl text-white">Achievements</h2>
        <p className="text-xs text-slate-400 mt-1">
          {totalCompleted} of {achievements.length} Badges Unlocked
        </p>
      </div>

      {/* Badges List */}
      <div className="space-y-3">
        {achievements.map((ach) => {
          const progressPercent = Math.min(
            100,
            Math.round((ach.currentValue / ach.targetValue) * 100)
          );

          return (
            <div
              key={ach.id}
              className={`p-4 rounded-3xl border transition-all flex items-center justify-between ${
                ach.claimed
                  ? 'bg-slate-900/60 border-slate-800/80 opacity-70'
                  : ach.completed
                  ? 'bg-gradient-to-r from-slate-900 to-indigo-950/80 border-indigo-400/60 shadow-lg'
                  : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                    ach.completed
                      ? 'bg-amber-500/20 border border-amber-400/50'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {ach.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-display font-bold text-sm text-white truncate">
                    {ach.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {ach.description}
                  </p>

                  {/* Progress bar */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {ach.currentValue}/{ach.targetValue}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action: Claim / Claimed / In Progress */}
              <div className="shrink-0">
                {ach.claimed ? (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 px-2.5 py-1 bg-slate-950 rounded-xl">
                    <Check className="w-3.5 h-3.5" />
                    <span>Done</span>
                  </div>
                ) : ach.completed ? (
                  <button
                    onClick={() => {
                      sound.playCoin();
                      onClaimAchievement(ach.id, ach.rewardCoins);
                    }}
                    className="game-btn px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md active:scale-95 animate-pulse"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>+{ach.rewardCoins}</span>
                  </button>
                ) : (
                  <div className="text-[11px] font-semibold text-slate-500 px-2 py-1">
                    +{ach.rewardCoins} 🪙
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
