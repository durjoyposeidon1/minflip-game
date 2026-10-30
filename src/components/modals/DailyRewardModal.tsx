import React from 'react';
import { Gift, Coins, Check, X, Sparkles, Flame } from 'lucide-react';
import { sound } from '../../services/sound';

interface DailyRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStreak: number;
  canClaim: boolean;
  onClaim: (coinsReward: number) => void;
}

const STREAK_DAYS = [
  { day: 1, coins: 25, label: 'Day 1' },
  { day: 2, coins: 35, label: 'Day 2' },
  { day: 3, coins: 50, label: 'Day 3' },
  { day: 4, coins: 65, label: 'Day 4' },
  { day: 5, coins: 80, label: 'Day 5' },
  { day: 6, coins: 100, label: 'Day 6' },
  { day: 7, coins: 150, label: 'Day 7 (Super Chest!)' },
];

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({
  isOpen,
  onClose,
  currentStreak,
  canClaim,
  onClaim,
}) => {
  if (!isOpen) return null;

  const activeDayIndex = Math.min(Math.max(currentStreak, 1) - 1, 6);
  const rewardForToday = STREAK_DAYS[activeDayIndex].coins;

  const handleClaimClick = () => {
    sound.playCoin();
    onClaim(rewardForToday);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-pop">
      <div className="w-full max-w-sm bg-slate-900 border-2 border-indigo-500/40 rounded-3xl p-5 shadow-2xl flex flex-col items-center">
        {/* Header */}
        <div className="flex items-center justify-between w-full pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-bold text-lg text-white">Daily Streak Rewards</h3>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Streak Flame Banner */}
        <div className="flex items-center gap-2 my-4 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-400/30">
          <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
          <span className="text-xs font-bold text-amber-300">
            {currentStreak} Day Brain Streak!
          </span>
        </div>

        {/* 7 Day Grid */}
        <div className="grid grid-cols-4 gap-2 w-full mb-5">
          {STREAK_DAYS.map((d, index) => {
            const isToday = index === activeDayIndex;
            const isPassed = index < activeDayIndex;

            return (
              <div
                key={d.day}
                className={`p-2.5 rounded-xl border flex flex-col items-center text-center relative ${
                  index === 6 ? 'col-span-2 bg-gradient-to-r from-amber-600/30 to-purple-600/30 border-amber-400/50' : ''
                } ${
                  isToday
                    ? 'bg-indigo-900/40 border-indigo-400 ring-2 ring-indigo-400/30'
                    : isPassed
                    ? 'bg-slate-900 border-slate-800 opacity-60'
                    : 'bg-slate-800/80 border-slate-700/60'
                }`}
              >
                <span className="text-[10px] text-slate-400 font-medium">Day {d.day}</span>
                <div className="text-xl my-1">{index === 6 ? '🎁' : '🪙'}</div>
                <span className="text-xs font-bold text-amber-300">+{d.coins}</span>

                {isPassed && (
                  <div className="absolute inset-0 bg-slate-950/70 rounded-xl flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Claim Button */}
        {canClaim ? (
          <button
            onClick={handleClaimClick}
            className="game-btn w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Claim +{rewardForToday} Coins</span>
          </button>
        ) : (
          <div className="w-full py-2.5 rounded-2xl bg-slate-800 text-slate-400 text-xs font-medium text-center border border-slate-700">
            Come back tomorrow for Day {Math.min(currentStreak + 1, 7)}!
          </div>
        )}
      </div>
    </div>
  );
};
