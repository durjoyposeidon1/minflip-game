import React from 'react';
import { Chapter, UserGameProgress } from '../../types/game';
import { getPuzzlesByChapter } from '../../data/puzzles/allPuzzles';
import { sound } from '../../services/sound';
import { Lock, Star, ChevronLeft, Check } from 'lucide-react';

interface LevelSelectScreenProps {
  chapter: Chapter;
  progress: UserGameProgress;
  onSelectLevel: (levelId: number) => void;
  onBackToChapters: () => void;
}

export const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({
  chapter,
  progress,
  onSelectLevel,
  onBackToChapters,
}) => {
  const puzzles = getPuzzlesByChapter(chapter.id);

  return (
    <div className="flex-1 w-full max-w-md mx-auto flex flex-col p-4 pb-8 space-y-4">
      {/* Chapter Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            Chapter {chapter.id}
          </span>
          <h2 className="font-display font-black text-2xl text-white">
            {chapter.title}
          </h2>
        </div>
        <button
          onClick={() => {
            sound.playTap();
            onBackToChapters();
          }}
          className="text-xs text-indigo-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800"
        >
          All Chapters
        </button>
      </div>

      <p className="text-xs text-slate-400">
        {chapter.description}
      </p>

      {/* 20 Levels Grid: 4 columns x 5 rows */}
      <div className="grid grid-cols-4 gap-3 pt-2">
        {puzzles.map((puzzle) => {
          const isUnlocked = puzzle.id <= progress.unlockedLevels;
          const levelInfo = progress.completedLevels[puzzle.id];
          const isCompleted = levelInfo?.completed;
          const stars = levelInfo?.stars || 0;

          return (
            <button
              key={puzzle.id}
              disabled={!isUnlocked}
              onClick={() => {
                if (isUnlocked) {
                  sound.playTap();
                  onSelectLevel(puzzle.id);
                } else {
                  sound.playWrong();
                }
              }}
              className={`game-btn h-20 rounded-2xl flex flex-col items-center justify-center p-2 border transition-all select-none relative ${
                isCompleted
                  ? 'bg-slate-900/90 border-emerald-500/50 text-white shadow-md hover:border-emerald-400'
                  : isUnlocked
                  ? 'bg-gradient-to-b from-indigo-900/60 to-purple-900/60 border-indigo-500/60 text-white shadow-md hover:scale-105 active:scale-95'
                  : 'bg-slate-950 border-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
              }`}
            >
              {/* Top corner difficulty indicator */}
              <span className="absolute top-1 right-1.5 text-[8px] font-semibold text-slate-400">
                {puzzle.category[0].toUpperCase()}
              </span>

              {isUnlocked ? (
                <>
                  <span className="font-display font-black text-xl text-white">
                    {puzzle.id}
                  </span>

                  {/* 3 Stars display */}
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
                          s <= stars
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700 fill-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <Lock className="w-5 h-5 text-slate-600 mb-0.5" />
                  <span className="text-[10px] text-slate-600 font-bold">{puzzle.id}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
