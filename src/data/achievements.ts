import { Achievement, UserGameProgress } from '../types/game';
import { ALL_PUZZLES } from './puzzles/allPuzzles';

export const BASE_ACHIEVEMENTS: Omit<Achievement, 'currentValue' | 'completed' | 'claimed'>[] = [
  {
    id: 'first_win',
    title: 'First Spark',
    description: 'Solve your very first MindFlip puzzle',
    icon: '💡',
    rewardCoins: 50,
    category: 'progress',
    targetValue: 1,
  },
  {
    id: 'chapter_1',
    title: 'Beginner Graduate',
    description: 'Complete all 20 levels in Chapter 1: Beginner Brain',
    icon: '🌱',
    rewardCoins: 100,
    category: 'progress',
    targetValue: 20,
  },
  {
    id: 'chapter_2',
    title: 'Master of Observation',
    description: 'Complete all 20 levels in Chapter 2: Observation Master',
    icon: '🔍',
    rewardCoins: 120,
    category: 'progress',
    targetValue: 20,
  },
  {
    id: 'chapter_3',
    title: 'Logic Virtuoso',
    description: 'Complete all 20 levels in Chapter 3: Logic Expert',
    icon: '🧩',
    rewardCoins: 150,
    category: 'progress',
    targetValue: 20,
  },
  {
    id: 'chapter_4',
    title: 'Math Sorcerer',
    description: 'Complete all 20 levels in Chapter 4: Math Genius',
    icon: '⚡',
    rewardCoins: 180,
    category: 'progress',
    targetValue: 20,
  },
  {
    id: 'century_mind',
    title: 'Century Mind (100/100)',
    description: 'Conquer all 100 levels of MindFlip!',
    icon: '👑',
    rewardCoins: 500,
    category: 'progress',
    targetValue: 100,
  },
  {
    id: 'star_collector_30',
    title: 'Starlight Seeker',
    description: 'Earn 30 total stars across any levels',
    icon: '⭐',
    rewardCoins: 75,
    category: 'stars',
    targetValue: 30,
  },
  {
    id: 'star_collector_100',
    title: 'Constellation Master',
    description: 'Earn 100 total stars',
    icon: '✨',
    rewardCoins: 150,
    category: 'stars',
    targetValue: 100,
  },
  {
    id: 'pure_intellect',
    title: 'Pure Intellect',
    description: 'Solve 10 levels with 3 stars without using any hints',
    icon: '🧠',
    rewardCoins: 100,
    category: 'skills',
    targetValue: 10,
  },
  {
    id: 'streak_3',
    title: 'Consistent Genius',
    description: 'Maintain a 3-day Daily Challenge streak',
    icon: '🔥',
    rewardCoins: 80,
    category: 'streak',
    targetValue: 3,
  },
  {
    id: 'coin_hoarder',
    title: 'Treasure Vault',
    description: 'Accumulate 300 coins in your bank',
    icon: '🪙',
    rewardCoins: 75,
    category: 'special',
    targetValue: 300,
  },
  {
    id: 'memory_master',
    title: 'Photographic Memory',
    description: 'Complete 8 memory challenges successfully',
    icon: '🃏',
    rewardCoins: 90,
    category: 'skills',
    targetValue: 8,
  },
];

export function computeAchievements(progress: UserGameProgress): Achievement[] {
  const completedEntries = Object.values(progress.completedLevels);
  const totalCompleted = completedEntries.length;
  
  const ch1Completed = completedEntries.filter(
    (l) => l.levelId >= 1 && l.levelId <= 20
  ).length;
  const ch2Completed = completedEntries.filter(
    (l) => l.levelId >= 21 && l.levelId <= 40
  ).length;
  const ch3Completed = completedEntries.filter(
    (l) => l.levelId >= 41 && l.levelId <= 60
  ).length;
  const ch4Completed = completedEntries.filter(
    (l) => l.levelId >= 61 && l.levelId <= 80
  ).length;
  
  const totalStars = completedEntries.reduce((sum, l) => sum + (l.stars || 0), 0);
  const noHintThreeStars = completedEntries.filter(
    (l) => l.stars === 3 && l.hintsUsed === 0
  ).length;

  const memoryCompleted = completedEntries.filter((l) => {
    const p = ALL_PUZZLES.find((item) => item.id === l.levelId);
    return p?.category === 'memory';
  }).length;

  return BASE_ACHIEVEMENTS.map((ach) => {
    let currentVal = 0;
    switch (ach.id) {
      case 'first_win':
        currentVal = totalCompleted;
        break;
      case 'chapter_1':
        currentVal = ch1Completed;
        break;
      case 'chapter_2':
        currentVal = ch2Completed;
        break;
      case 'chapter_3':
        currentVal = ch3Completed;
        break;
      case 'chapter_4':
        currentVal = ch4Completed;
        break;
      case 'century_mind':
        currentVal = totalCompleted;
        break;
      case 'star_collector_30':
      case 'star_collector_100':
        currentVal = totalStars;
        break;
      case 'pure_intellect':
        currentVal = noHintThreeStars;
        break;
      case 'streak_3':
        currentVal = progress.daily.highestStreak;
        break;
      case 'coin_hoarder':
        currentVal = progress.coins;
        break;
      case 'memory_master':
        currentVal = memoryCompleted;
        break;
      default:
        currentVal = 0;
    }

    const isComplete = currentVal >= ach.targetValue;
    const isClaimed = progress.claimedAchievements.includes(ach.id);

    return {
      ...ach,
      currentValue: Math.min(currentVal, ach.targetValue),
      completed: isComplete,
      claimed: isClaimed,
    };
  });
}
