import React from 'react';
import { PuzzleCategory, UserGameProgress } from '../../types/game';
import { ALL_PUZZLES } from '../../data/puzzles/allPuzzles';
import { sound } from '../../services/sound';
import { Sparkles, Brain, Eye, Calculator, Layers, Calendar, ChevronRight } from 'lucide-react';

interface GameModeScreenProps {
  progress: UserGameProgress;
  onSelectCategory: (category: PuzzleCategory) => void;
  onOpenDaily: () => void;
  onOpenChapters: () => void;
}

interface ModeCardInfo {
  category: PuzzleCategory | 'daily';
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
}

const MODES: ModeCardInfo[] = [
  {
    category: 'tricky',
    title: 'Tricky Puzzle',
    subtitle: 'Riddles & Lateral Assumptions',
    description: 'Find hidden objects, identify trick questions, and question the obvious answers.',
    icon: '🎭',
    color: 'from-amber-500/20 to-orange-500/20 border-amber-400/40 text-amber-300',
  },
  {
    category: 'math',
    title: 'Math & Logic',
    subtitle: 'Matchsticks, Sequences & Formulas',
    description: 'Solve matchstick equations, missing series, and mathematical paradoxes.',
    icon: '⚡',
    color: 'from-blue-500/20 to-indigo-500/20 border-blue-400/40 text-blue-300',
  },
  {
    category: 'visual',
    title: 'Visual Puzzle',
    subtitle: 'Perception, Shadows & Oddities',
    description: 'Spot subtle differences, rotated shapes, and camouflaged jungle elements.',
    icon: '🔍',
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-400/40 text-emerald-300',
  },
  {
    category: 'memory',
    title: 'Memory Challenge',
    subtitle: 'Card Flips & Order Retention',
    description: 'Recall object sequences, reverse orders, and quadrant card pairings.',
    icon: '🃏',
    color: 'from-purple-500/20 to-fuchsia-500/20 border-purple-400/40 text-purple-300',
  },
  {
    category: 'daily',
    title: 'Daily Challenge',
    subtitle: 'Fresh Date-Seeded Riddle',
    description: 'Build your streak, claim daily reward coins, and test your brain every morning.',
    icon: '📅',
    color: 'from-rose-500/20 to-pink-500/20 border-rose-400/40 text-rose-300',
  },
];

export const GameModeScreen: React.FC<GameModeScreenProps> = ({
  progress,
  onSelectCategory,
  onOpenDaily,
  onOpenChapters,
}) => {
  return (
    <div className="flex-1 w-full max-w-md mx-auto flex flex-col p-4 pb-8 space-y-4">
      <div className="text-center my-2">
        <h2 className="font-display font-black text-2xl text-white">Game Modes</h2>
        <p className="text-xs text-slate-400 mt-1">
          Explore specialized brain training modes or dive into the 5 chapters
        </p>
      </div>

      <div className="space-y-3">
        {MODES.map((mode) => {
          const totalInCat =
            mode.category === 'daily'
              ? 1
              : ALL_PUZZLES.filter((p) => p.category === mode.category).length;

          const solvedInCat =
            mode.category === 'daily'
              ? progress.daily.todaySolved ? 1 : 0
              : Object.values(progress.completedLevels).filter((l) => {
                  const puzzle = ALL_PUZZLES.find((item) => item.id === l.levelId);
                  return puzzle?.category === mode.category;
                }).length;

          return (
            <div
              key={mode.category}
              onClick={() => {
                sound.playTap();
                if (mode.category === 'daily') {
                  onOpenDaily();
                } else {
                  // Filter and play levels of this category or view chapters
                  onOpenChapters();
                }
              }}
              className={`p-4 rounded-3xl bg-gradient-to-r ${mode.color} border flex items-center justify-between cursor-pointer hover:scale-[1.01] active:scale-[0.98] transition-all shadow-md select-none`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 rounded-2xl bg-slate-900/80 border border-slate-700/60 flex items-center justify-center text-3xl shrink-0">
                  {mode.icon}
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white">
                    {mode.title}
                  </h3>
                  <div className="text-xs text-slate-300 font-medium">
                    {mode.subtitle}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {mode.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                <span className="text-[11px] font-bold text-slate-300">
                  {solvedInCat} / {totalInCat}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
