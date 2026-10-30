import React, { useState } from 'react';
import { HelpCircle, Coins, Sparkles, X, Check, EyeOff, FastForward, Film } from 'lucide-react';
import { sound } from '../../services/sound';
import { admob } from '../../services/admobService';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerCoins: number;
  hint1Text: string;
  hint2Text: string;
  hint3Text: string;
  revealedHints: number[]; // e.g. [1, 2]
  onUnlockHint: (tier: number, cost: number) => void;
  onSkipLevel: (cost: number) => void;
  onAddCoins: (amount: number) => void;
}

export const HintModal: React.FC<HintModalProps> = ({
  isOpen,
  onClose,
  playerCoins,
  hint1Text,
  hint2Text,
  hint3Text,
  revealedHints,
  onUnlockHint,
  onSkipLevel,
  onAddCoins,
}) => {
  const [confirmTier, setConfirmTier] = useState<number | null>(null);
  const [confirmSkip, setConfirmSkip] = useState<boolean>(false);
  const [isAdLoading, setIsAdLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const hintCosts: Record<number, number> = {
    1: 15,
    2: 30,
    3: 50,
  };

  const handleSelectTier = (tier: number) => {
    sound.playTap();
    if (revealedHints.includes(tier)) return;
    setConfirmSkip(false);
    setConfirmTier(tier);
  };

  const handleConfirmUnlock = (tier: number) => {
    const cost = hintCosts[tier];
    if (playerCoins >= cost) {
      sound.playHint();
      onUnlockHint(tier, cost);
      setConfirmTier(null);
    } else {
      sound.playWrong();
    }
  };

  const handleConfirmSkip = () => {
    const skipCost = 60;
    if (playerCoins >= skipCost) {
      sound.playSuccess();
      onSkipLevel(skipCost);
      setConfirmSkip(false);
      onClose();
    } else {
      sound.playWrong();
    }
  };

  const handleWatchAdReward = async () => {
    setIsAdLoading(true);
    sound.playTap();
    const res = await admob.showRewardedAd('coins');
    setIsAdLoading(false);
    if (res.success) {
      sound.playCoin();
      onAddCoins(50);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-pop">
      <div className="w-full max-w-sm bg-slate-900 border-2 border-indigo-500/40 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-bold text-lg text-white">MindFlip Hints</h3>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/20 border border-amber-400/30 rounded-full text-xs font-bold text-amber-300">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{playerCoins}</span>
            </div>
            <button
              onClick={() => {
                sound.playTap();
                setConfirmTier(null);
                setConfirmSkip(false);
                onClose();
              }}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Confirmation Overlay for spending coins */}
        {confirmTier !== null && (
          <div className="my-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-400/40 text-center animate-pop">
            <p className="text-xs text-amber-200 font-semibold mb-2">
              Unlock Tier {confirmTier} Clue for{' '}
              <span className="font-bold text-amber-400">{hintCosts[confirmTier]} Coins</span>?
            </p>
            {playerCoins < hintCosts[confirmTier] ? (
              <div className="text-xs text-rose-300 mb-3">
                Not enough coins! Watch a quick video or solve previous levels.
              </div>
            ) : (
              <div className="flex gap-2 justify-center mt-3">
                <button
                  onClick={() => setConfirmTier(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleConfirmUnlock(confirmTier)}
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow"
                >
                  Spend {hintCosts[confirmTier]} Coins
                </button>
              </div>
            )}
          </div>
        )}

        {/* Confirmation Overlay for Skip Level */}
        {confirmSkip && (
          <div className="my-4 p-4 rounded-2xl bg-purple-500/10 border border-purple-400/40 text-center animate-pop">
            <p className="text-xs text-purple-200 font-semibold mb-2">
              Skip this level for <span className="font-bold text-purple-300">60 Coins</span>?
            </p>
            {playerCoins < 60 ? (
              <div className="text-xs text-rose-300 mb-3">Not enough coins to skip!</div>
            ) : (
              <div className="flex gap-2 justify-center mt-3">
                <button
                  onClick={() => setConfirmSkip(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSkip}
                  className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow"
                >
                  Confirm Skip
                </button>
              </div>
            )}
          </div>
        )}

        {/* 3 Hint Tiers */}
        <div className="space-y-3 my-4">
          {/* Tier 1 */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Tier 1: Gentle Nudge
              </span>
              {!revealedHints.includes(1) && (
                <button
                  onClick={() => handleSelectTier(1)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-[11px] font-bold text-white flex items-center gap-1"
                >
                  <Coins className="w-3 h-3 text-amber-300" /> 15
                </button>
              )}
            </div>
            {revealedHints.includes(1) ? (
              <p className="text-xs text-indigo-200 bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-500/30">
                {hint1Text}
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 italic">
                A subtle direction to point you along the right mental track.
              </p>
            )}
          </div>

          {/* Tier 2 */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <EyeOff className="w-3.5 h-3.5 text-blue-400" /> Tier 2: Deductive Clue
              </span>
              {!revealedHints.includes(2) && (
                <button
                  onClick={() => handleSelectTier(2)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-[11px] font-bold text-white flex items-center gap-1"
                >
                  <Coins className="w-3 h-3 text-amber-300" /> 30
                </button>
              )}
            </div>
            {revealedHints.includes(2) ? (
              <p className="text-xs text-blue-200 bg-blue-950/40 p-2.5 rounded-xl border border-blue-500/30">
                {hint2Text}
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 italic">
                Eliminates distractions and provides intermediate deductions.
              </p>
            )}
          </div>

          {/* Tier 3 */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-purple-400" /> Tier 3: Core Solution
              </span>
              {!revealedHints.includes(3) && (
                <button
                  onClick={() => handleSelectTier(3)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-[11px] font-bold text-white flex items-center gap-1"
                >
                  <Coins className="w-3 h-3 text-amber-300" /> 50
                </button>
              )}
            </div>
            {revealedHints.includes(3) ? (
              <p className="text-xs text-purple-200 bg-purple-950/40 p-2.5 rounded-xl border border-purple-500/30">
                {hint3Text}
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 italic">
                Direct explanation of the exact trick needed to complete the puzzle.
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions: Rewarded Ad / Skip */}
        <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
          {/* AdMob Rewarded Hook */}
          <button
            disabled={isAdLoading}
            onClick={handleWatchAdReward}
            className="w-full py-2.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Film className="w-4 h-4" />
            <span>{isAdLoading ? 'Loading Bonus...' : 'Claim +50 Free Coins (Rewarded Ad)'}</span>
          </button>

          {/* Skip level */}
          <button
            onClick={() => {
              sound.playTap();
              setConfirmTier(null);
              setConfirmSkip(true);
            }}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Skip This Level (60 Coins)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
