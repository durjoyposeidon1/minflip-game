import React, { useState, useEffect } from 'react';
import { PuzzleLevel, UserGameProgress } from '../../types/game';
import { InteractivePuzzle } from '../puzzle/InteractivePuzzle';
import { CorrectModal } from '../modals/CorrectModal';
import { WrongModal } from '../modals/WrongModal';
import { HintModal } from '../modals/HintModal';
import { PauseModal } from '../modals/PauseModal';
import { Confetti } from '../common/Confetti';
import { sound } from '../../services/sound';
import { admob } from '../../services/admobService';
import {
  HelpCircle,
  Pause,
  RotateCcw,
  Sparkles,
  Award,
  FastForward,
} from 'lucide-react';

interface PuzzleGameScreenProps {
  level: PuzzleLevel;
  progress: UserGameProgress;
  onLevelComplete: (
    levelId: number,
    stars: number,
    hintsUsed: number,
    attempts: number,
    coinsEarned: number
  ) => void;
  onSpendCoins: (amount: number) => boolean;
  onAddCoins: (amount: number) => void;
  onNextLevel: (nextId: number) => void;
  onGoHome: () => void;
  onGoLevels: () => void;
  onToggleSound: () => void;
  onToggleHaptics: () => void;
}

export const PuzzleGameScreen: React.FC<PuzzleGameScreenProps> = ({
  level,
  progress,
  onLevelComplete,
  onSpendCoins,
  onAddCoins,
  onNextLevel,
  onGoHome,
  onGoLevels,
  onToggleSound,
  onToggleHaptics,
}) => {
  // Modal states
  const [isCorrectModalOpen, setIsCorrectModalOpen] = useState(false);
  const [isWrongModalOpen, setIsWrongModalOpen] = useState(false);
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Level session state
  const [attempts, setAttempts] = useState(1);
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [starsAwarded, setStarsAwarded] = useState(3);
  const [coinsAwarded, setCoinsAwarded] = useState(level.rewardCoins);

  // Reset state on level change
  useEffect(() => {
    setIsCorrectModalOpen(false);
    setIsWrongModalOpen(false);
    setIsHintModalOpen(false);
    setIsPauseModalOpen(false);
    setShowConfetti(false);
    setAttempts(1);
    setRevealedHints([]);
    setIsAnswerSubmitted(false);
  }, [level.id]);

  // Answer validation
  const handleAnswerSubmit = (submittedAnswer: any) => {
    if (isAnswerSubmitted) return; // Prevent double submission
    setIsAnswerSubmitted(true);

    let isCorrect = false;

    // Check match depending on answer format
    if (Array.isArray(level.correctAnswer)) {
      if (Array.isArray(submittedAnswer)) {
        isCorrect =
          submittedAnswer.length === level.correctAnswer.length &&
          submittedAnswer.every((val, idx) => val === (level.correctAnswer as any)[idx]);
      }
    } else if (typeof level.correctAnswer === 'number') {
      isCorrect = Number(submittedAnswer) === level.correctAnswer;
    } else {
      isCorrect = String(submittedAnswer) === String(level.correctAnswer);
    }

    if (isCorrect) {
      // Calculate Stars based on hints used and attempts
      let stars = 3;
      if (revealedHints.length >= 2 || attempts >= 3) {
        stars = 1;
      } else if (revealedHints.length === 1 || attempts === 2) {
        stars = 2;
      }

      setStarsAwarded(stars);
      setCoinsAwarded(level.rewardCoins);
      setShowConfetti(true);

      // Save progress
      onLevelComplete(
        level.id,
        stars,
        revealedHints.length,
        attempts,
        level.rewardCoins
      );

      // Show interstitial AdMob hook every 5 levels
      admob.showInterstitialIfAppropriate(level.id);

      setTimeout(() => {
        setIsCorrectModalOpen(true);
      }, 500);
    } else {
      setAttempts((prev) => prev + 1);
      setTimeout(() => {
        setIsWrongModalOpen(true);
      }, 400);
    }
  };

  const handleRetryAfterWrong = () => {
    setIsWrongModalOpen(false);
    setIsAnswerSubmitted(false);
  };

  const handleRestartLevel = () => {
    sound.playTap();
    setIsAnswerSubmitted(false);
    setIsWrongModalOpen(false);
    setIsCorrectModalOpen(false);
    setIsPauseModalOpen(false);
    setAttempts((prev) => prev + 1);
  };

  const handleUnlockHint = (tier: number, cost: number) => {
    const success = onSpendCoins(cost);
    if (success) {
      setRevealedHints((prev) => [...prev, tier]);
    }
  };

  const handleSkipLevel = (cost: number) => {
    const success = onSpendCoins(cost);
    if (success) {
      // Complete level with 1 star and advance
      onLevelComplete(level.id, 1, 3, attempts, 10);
      onNextLevel(Math.min(level.id + 1, 100));
    }
  };

  return (
    <div className="flex-1 w-full max-w-md mx-auto flex flex-col justify-between p-4 pb-6 space-y-4">
      {/* 1. Header Level Info Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-400/30">
            Level {level.id}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            Chapter {level.chapterId} · {level.category.toUpperCase()}
          </span>
        </div>

        {/* Level Controls: Restart, Pause */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRestartLevel}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors active:scale-95"
            title="Restart Level"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              sound.playTap();
              setIsPauseModalOpen(true);
            }}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors active:scale-95"
            title="Pause Game"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Question Prompt Container */}
      <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg text-center flex flex-col items-center">
        <h2 className="font-display font-bold text-lg sm:text-xl text-white leading-snug">
          {level.question}
        </h2>
        {level.instructions && (
          <p className="text-xs text-indigo-300/90 mt-2 font-medium">
            💡 {level.instructions}
          </p>
        )}
      </div>

      {/* 3. Interactive Puzzle Surface */}
      <div className="flex-1 flex flex-col items-center justify-center py-2 w-full">
        <InteractivePuzzle
          level={level}
          onAnswerSubmit={handleAnswerSubmit}
          isAnswerSubmitted={isAnswerSubmitted}
          disabledOptions={
            revealedHints.includes(2) && level.interactionType === 'choice'
              ? [
                  level.options?.find((o) => o.id !== level.correctAnswer)?.id || '',
                ]
              : []
          }
        />
      </div>

      {/* 4. Bottom Controls: Hint Button & Skip */}
      <div className="w-full flex items-center justify-between gap-3 pt-2">
        <button
          onClick={() => {
            sound.playTap();
            setIsHintModalOpen(true);
          }}
          className="game-btn flex-1 py-3 px-4 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 shadow-sm"
        >
          <HelpCircle className="w-4 h-4" />
          <span>
            {revealedHints.length > 0 ? `Hints (${revealedHints.length}/3)` : 'Hint'}
          </span>
        </button>

        <button
          onClick={() => {
            sound.playTap();
            setIsHintModalOpen(true);
          }}
          className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors active:scale-95"
          title="Quick Skip"
        >
          <FastForward className="w-4 h-4" />
        </button>
      </div>

      {/* Confetti Particle Burst */}
      <Confetti active={showConfetti} />

      {/* Correct Victory Modal */}
      <CorrectModal
        isOpen={isCorrectModalOpen}
        stars={starsAwarded}
        coinsEarned={coinsAwarded}
        explanation={level.explanation}
        onNextLevel={() => {
          setIsCorrectModalOpen(false);
          onNextLevel(Math.min(level.id + 1, 100));
        }}
        onReplay={handleRestartLevel}
        isLastLevel={level.id === 100}
      />

      {/* Wrong Answer Modal */}
      <WrongModal
        isOpen={isWrongModalOpen}
        onRetry={handleRetryAfterWrong}
        onOpenHints={() => {
          setIsWrongModalOpen(false);
          setIsHintModalOpen(true);
        }}
      />

      {/* Hint Modal */}
      <HintModal
        isOpen={isHintModalOpen}
        onClose={() => setIsHintModalOpen(false)}
        playerCoins={progress.coins}
        hint1Text={level.hint1}
        hint2Text={level.hint2}
        hint3Text={level.hint3}
        revealedHints={revealedHints}
        onUnlockHint={handleUnlockHint}
        onSkipLevel={handleSkipLevel}
        onAddCoins={onAddCoins}
      />

      {/* Pause Modal */}
      <PauseModal
        isOpen={isPauseModalOpen}
        onResume={() => setIsPauseModalOpen(false)}
        onRestart={handleRestartLevel}
        onGoHome={onGoHome}
        onGoLevels={onGoLevels}
        soundEnabled={progress.settings.soundEnabled}
        hapticsEnabled={progress.settings.hapticsEnabled}
        onToggleSound={onToggleSound}
        onToggleHaptics={onToggleHaptics}
      />
    </div>
  );
};
