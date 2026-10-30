import React from 'react';
import { Chapter, UserGameProgress } from '../../types/game';
import { CHAPTERS } from '../../data/chapters';
import { sound } from '../../services/sound';
import { Lock, Star, CheckCircle, ChevronRight, Sparkles } from 'lucide-react';

interface ChapterScreenProps {
  progress: UserGameProgress;
  onSelectChapter: (chapterId: 1 | 2 | 3 | 4 | 5) => void;
}

export const ChapterScreen: React.FC<ChapterScreenProps> = ({
  progress,
  onSelectChapter,
}) => {
  const totalStars = Object.values(progress.completedLevels).reduce(
    (sum, l) => sum + (l.stars || 0),
    0
  );

  return (
    <div className="flex-1 w-full max-w-md mx-auto flex flex-col p-4 pb-8 space-y-4">
      <div className="text-center my-2">
        <h2 className="font-display font-black text-2xl text-white">Select Chapter</h2>
        <p className="text-xs text-slate-400 mt-1">
          Collect stars to unlock the deeper mysteries of MindFlip
        </p>
      </div>

      <div className="space-y-3.5">
        {CHAPTERS.map((ch) => {
          const isUnlocked =
            totalStars >= ch.requiredStars || progress.unlockedLevels >= ch.startLevel;

          // Calculate completed levels in this chapter
          const chapterCompleted = Object.values(progress.completedLevels).filter(
            (l) => l.levelId >= ch.startLevel && l.levelId <= ch.endLevel
          ).length;

          // Stars earned in this chapter
          const chapterStars = Object.values(progress.completedLevels)
            .filter((l) => l.levelId >= ch.startLevel && l.levelId <= ch.endLevel)
            .reduce((sum, l) => sum + (l.stars || 0), 0);

          return (
            <div
              key={ch.id}
              onClick={() => {
                if (isUnlocked) {
                  sound.playTap();
                  onSelectChapter(ch.id);
                } else {
                  sound.playWrong();
                }
              }}
              className={`p-4 rounded-3xl border transition-all select-none relative overflow-hidden ${
                isUnlocked
                  ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/70 border-slate-700/80 hover:border-indigo-400 cursor-pointer shadow-lg active:scale-[0.98]'
                  : 'bg-slate-950 border-slate-900 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${
                      isUnlocked
                        ? 'bg-gradient-to-br ' + ch.themeColor + ' text-slate-950 font-black'
                        : 'bg-slate-900 text-slate-600'
                    }`}
                  >
                    {isUnlocked ? ch.icon : <Lock className="w-6 h-6 text-slate-600" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-400">
                        Chapter {ch.id} · Lv {ch.startLevel}-{ch.endLevel}
                      </span>
                      {chapterCompleted === 20 && (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>
                    <h3 className="font-display font-bold text-base text-white mt-0.5">
                      {ch.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {ch.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                  {isUnlocked ? (
                    <>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{chapterStars} / 60</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {chapterCompleted} / 20 Solved
                      </span>
                    </>
                  ) : (
                    <div className="text-right">
                      <div className="text-[11px] font-bold text-rose-300 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>{ch.requiredStars} ★ needed</span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        ({ch.requiredStars - totalStars} more)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar inside chapter */}
              {isUnlocked && (
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full"
                    style={{ width: `${(chapterCompleted / 20) * 100}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
