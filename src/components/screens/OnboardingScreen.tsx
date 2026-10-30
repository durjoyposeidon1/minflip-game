import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { sound } from '../../services/sound';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const STEPS = [
  {
    icon: '💡',
    title: 'Question Assumptions',
    subtitle: 'Nothing is as simple as it looks',
    description:
      'The obvious answer is often a clever trap! Look at the subtle wording, rotate objects in your mind, and question everyday logic.',
  },
  {
    icon: '👆',
    title: 'Tap, Drag & Flip',
    subtitle: 'Hands-on Interactive Puzzles',
    description:
      'Drag clouds to create rain, unplug lamps to turn off lights, find odd chameleons, and arrange sequence codes.',
  },
  {
    icon: '👑',
    title: 'Conquer 100 Levels',
    subtitle: 'From Novice to Grandmaster Mind',
    description:
      'Unlock 5 chapters, collect up to 3 stars per level, maintain your daily challenge streak, and unlock prestige achievements!',
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const handleNext = () => {
    sound.playTap();
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const stepData = STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white p-6 select-none">
      {/* Top bar: Skip button */}
      <div className="w-full flex justify-end">
        <button
          onClick={() => {
            sound.playTap();
            onComplete();
          }}
          className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg"
        >
          Skip
        </button>
      </div>

      {/* Center Card */}
      <div className="flex flex-col items-center text-center max-w-sm my-auto animate-pop">
        <div className="w-24 h-24 rounded-3xl bg-indigo-600/20 border-2 border-indigo-400/40 flex items-center justify-center text-5xl mb-6 shadow-xl shadow-indigo-500/20 animate-float">
          {stepData.icon}
        </div>

        <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
          {stepData.title}
        </h2>
        <p className="text-xs font-semibold text-amber-300 mt-1 uppercase tracking-wider">
          {stepData.subtitle}
        </p>

        <p className="text-sm text-slate-300 mt-4 leading-relaxed">
          {stepData.description}
        </p>
      </div>

      {/* Bottom controls: Dots & Next */}
      <div className="w-full max-w-sm flex flex-col items-center gap-6 mb-4">
        {/* Step dots */}
        <div className="flex gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? 'w-7 bg-amber-400'
                  : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleNext}
          className="game-btn w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-indigo-600 hover:opacity-95 text-slate-950 font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-95"
        >
          <span>{currentStep === STEPS.length - 1 ? 'Start Playing' : 'Next'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
