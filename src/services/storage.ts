import { UserGameProgress, LevelProgress } from '../types/game';

const STORAGE_KEY = 'mindflip_game_progress_v1';

export const DEFAULT_PROGRESS: UserGameProgress = {
  profile: {
    name: 'Brain Explorer',
    avatar: '🦊',
    title: 'Curious Novice',
  },
  coins: 100, // Starting bonus so player can try hints!
  unlockedLevels: 1,
  completedLevels: {},
  settings: {
    soundEnabled: true,
    musicEnabled: false, // Default soft
    hapticsEnabled: true,
    darkMode: true,
    showTutorial: true,
  },
  daily: {
    lastCompletedDate: '',
    currentStreak: 0,
    highestStreak: 0,
    todaySolved: false,
    todayPuzzleId: 1,
    claimedRewardToday: false,
  },
  claimedAchievements: [],
  totalPlayTimeSeconds: 0,
};

export class StorageService {
  private static instance: StorageService;
  private cachedProgress: UserGameProgress | null = null;

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  public getProgress(): UserGameProgress {
    if (this.cachedProgress) {
      return this.cachedProgress;
    }

    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return DEFAULT_PROGRESS;
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this.saveProgress(DEFAULT_PROGRESS);
        return DEFAULT_PROGRESS;
      }
      const parsed = JSON.parse(raw);
      // Merge with default to protect against schema evolution
      const merged: UserGameProgress = {
        ...DEFAULT_PROGRESS,
        ...parsed,
        profile: { ...DEFAULT_PROGRESS.profile, ...(parsed.profile || {}) },
        settings: { ...DEFAULT_PROGRESS.settings, ...(parsed.settings || {}) },
        daily: { ...DEFAULT_PROGRESS.daily, ...(parsed.daily || {}) },
        completedLevels: parsed.completedLevels || {},
        claimedAchievements: parsed.claimedAchievements || [],
      };
      this.cachedProgress = merged;
      return merged;
    } catch (e) {
      console.warn('MindFlip: Failed to read from localStorage, using defaults', e);
      return DEFAULT_PROGRESS;
    }
  }

  public saveProgress(progress: UserGameProgress): void {
    this.cachedProgress = progress;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      }
    } catch (e) {
      console.warn('MindFlip: Failed to save to localStorage', e);
    }
  }

  public completeLevel(
    levelId: number,
    stars: number,
    hintsUsed: number,
    attempts: number,
    coinsEarned: number
  ): UserGameProgress {
    const current = this.getProgress();
    const existing = current.completedLevels[levelId];
    
    // Keep highest stars and best time
    const bestStars = existing ? Math.max(existing.stars, stars) : stars;

    const newCompleted: LevelProgress = {
      levelId,
      completed: true,
      stars: bestStars,
      hintsUsed: existing ? Math.min(existing.hintsUsed, hintsUsed) : hintsUsed,
      attempts: (existing?.attempts || 0) + attempts,
      completedAt: new Date().toISOString(),
    };

    // Unlock next level if this is current highest
    const nextUnlocked = Math.max(current.unlockedLevels, levelId + 1);

    // Only award coins once per level, or bonus if improving stars
    const coinBonus = existing ? (stars > existing.stars ? 10 : 0) : coinsEarned;

    const updated: UserGameProgress = {
      ...current,
      coins: current.coins + coinBonus,
      unlockedLevels: nextUnlocked,
      completedLevels: {
        ...current.completedLevels,
        [levelId]: newCompleted,
      },
    };

    // Dynamic Title upgrade based on levels completed
    const totalDone = Object.keys(updated.completedLevels).length;
    if (totalDone >= 80) updated.profile.title = 'Grandmaster Mind';
    else if (totalDone >= 60) updated.profile.title = 'Logic Virtuoso';
    else if (totalDone >= 40) updated.profile.title = 'Puzzle Prodigy';
    else if (totalDone >= 20) updated.profile.title = 'Sharp Thinker';
    else if (totalDone >= 5) updated.profile.title = 'Brain Explorer';

    this.saveProgress(updated);
    return updated;
  }

  public spendCoins(amount: number): boolean {
    const current = this.getProgress();
    if (current.coins < amount) {
      return false;
    }
    const updated = {
      ...current,
      coins: current.coins - amount,
    };
    this.saveProgress(updated);
    return true;
  }

  public addCoins(amount: number): UserGameProgress {
    const current = this.getProgress();
    const updated = {
      ...current,
      coins: current.coins + amount,
    };
    this.saveProgress(updated);
    return updated;
  }

  public updateProfile(profile: Partial<UserGameProgress['profile']>): UserGameProgress {
    const current = this.getProgress();
    const updated = {
      ...current,
      profile: {
        ...current.profile,
        ...profile,
      },
    };
    this.saveProgress(updated);
    return updated;
  }

  public updateSettings(settings: Partial<UserGameProgress['settings']>): UserGameProgress {
    const current = this.getProgress();
    const updated = {
      ...current,
      settings: {
        ...current.settings,
        ...settings,
      },
    };
    this.saveProgress(updated);
    return updated;
  }

  public checkDailyStreak(): { isTodayDone: boolean; canClaimBonus: boolean; streak: number } {
    const current = this.getProgress();
    const todayStr = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    const isTodayDone = current.daily.lastCompletedDate === todayStr;
    const canClaimBonus = !current.daily.claimedRewardToday && current.daily.lastCompletedDate !== todayStr;

    let streak = current.daily.currentStreak;
    if (current.daily.lastCompletedDate !== todayStr && current.daily.lastCompletedDate !== yesterday && current.daily.lastCompletedDate !== '') {
      // Streak broken
      streak = 0;
    }

    return {
      isTodayDone,
      canClaimBonus,
      streak,
    };
  }

  public claimDailyReward(rewardCoins: number): UserGameProgress {
    const current = this.getProgress();
    const todayStr = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    let newStreak = current.daily.currentStreak;
    if (current.daily.lastCompletedDate === yesterday) {
      newStreak += 1;
    } else if (current.daily.lastCompletedDate !== todayStr) {
      newStreak = 1;
    }

    const updated: UserGameProgress = {
      ...current,
      coins: current.coins + rewardCoins,
      daily: {
        ...current.daily,
        lastCompletedDate: todayStr,
        currentStreak: newStreak,
        highestStreak: Math.max(current.daily.highestStreak, newStreak),
        claimedRewardToday: true,
        todaySolved: true,
      },
    };

    this.saveProgress(updated);
    return updated;
  }

  public claimAchievement(id: string, coinsReward: number): UserGameProgress {
    const current = this.getProgress();
    if (current.claimedAchievements.includes(id)) {
      return current;
    }

    const updated: UserGameProgress = {
      ...current,
      coins: current.coins + coinsReward,
      claimedAchievements: [...current.claimedAchievements, id],
    };

    this.saveProgress(updated);
    return updated;
  }

  public resetProgress(): UserGameProgress {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
    this.cachedProgress = null;
    return DEFAULT_PROGRESS;
  }
}

export const storage = StorageService.getInstance();
