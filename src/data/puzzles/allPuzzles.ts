import { PuzzleCategory, PuzzleLevel } from '../../types/game';
import { CHAPTER_1_PUZZLES } from './chapter1';
import { CHAPTER_2_PUZZLES } from './chapter2';
import { CHAPTER_3_PUZZLES } from './chapter3';
import { CHAPTER_4_PUZZLES } from './chapter4';
import { CHAPTER_5_PUZZLES } from './chapter5';

export const ALL_PUZZLES: PuzzleLevel[] = [
  ...CHAPTER_1_PUZZLES,
  ...CHAPTER_2_PUZZLES,
  ...CHAPTER_3_PUZZLES,
  ...CHAPTER_4_PUZZLES,
  ...CHAPTER_5_PUZZLES,
];

// Map by ID for O(1) lookup
export const PUZZLE_BY_ID: Record<number, PuzzleLevel> = {};
ALL_PUZZLES.forEach((p) => {
  PUZZLE_BY_ID[p.id] = p;
});

export function getPuzzleById(id: number): PuzzleLevel | undefined {
  return PUZZLE_BY_ID[id] || ALL_PUZZLES[0];
}

export function getPuzzlesByChapter(chapterId: 1 | 2 | 3 | 4 | 5): PuzzleLevel[] {
  return ALL_PUZZLES.filter((p) => p.chapterId === chapterId);
}

export function getPuzzlesByCategory(category: PuzzleCategory): PuzzleLevel[] {
  return ALL_PUZZLES.filter((p) => p.category === category);
}

export function getDailyPuzzle(dateString?: string): PuzzleLevel {
  const d = dateString ? new Date(dateString) : new Date();
  // Deterministic daily index based on day of year
  const startOfYear = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  // Pick from the 100 puzzles deterministically
  const puzzleIndex = (dayOfYear * 7 + 13) % ALL_PUZZLES.length;
  return ALL_PUZZLES[puzzleIndex];
}
