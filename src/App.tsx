/**
 * MindFlip – Original 2D Brain & Logic Puzzle Game
 * "Think Different. Solve Everything."
 */

import React, { useState, useEffect } from 'react';
import { ScreenState, UserGameProgress, Chapter, PuzzleLevel, PuzzleCategory } from './types/game';
import { storage } from './services/storage';
import { sound } from './services/sound';
import { admob } from './services/admobService';
import { CHAPTERS } from './data/chapters';
import { ALL_PUZZLES, getPuzzleById, getDailyPuzzle } from './data/puzzles/allPuzzles';

// Common Components
import { Header } from './components/common/Header';
import { DailyRewardModal } from './components/modals/DailyRewardModal';
import { CapacitorGuideModal } from './components/screens/CapacitorGuideModal';

// Screens
import { SplashScreen } from './components/screens/SplashScreen';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { GameModeScreen } from './components/screens/GameModeScreen';
import { ChapterScreen } from './components/screens/ChapterScreen';
import { LevelSelectScreen } from './components/screens/LevelSelectScreen';
import { PuzzleGameScreen } from './components/screens/PuzzleGameScreen';
import { DailyChallengeScreen } from './components/screens/DailyChallengeScreen';
import { AchievementsScreen } from './components/screens/AchievementsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';

export default function App() {
  const [progress, setProgress] = useState<UserGameProgress>(() => storage.getProgress());
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('splash');
  const [screenHistory, setScreenHistory] = useState<ScreenState[]>([]);
  
  // Active Chapter & Level
  const [selectedChapterId, setSelectedChapterId] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [activeLevelId, setActiveLevelId] = useState<number>(1);

  // Modals
  const [isDailyRewardOpen, setIsDailyRewardOpen] = useState(false);
  const [isCapacitorGuideOpen, setIsCapacitorGuideOpen] = useState(false);

  // Initialize Sound settings & AdMob
  useEffect(() => {
    sound.setSoundEnabled(progress.settings.soundEnabled);
    sound.setMusicEnabled(progress.settings.musicEnabled);
    sound.setHapticsEnabled(progress.settings.hapticsEnabled);
    admob.initialize();
  }, []);

  // Handle Android Back Button / Browser Back History
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (screenHistory.length > 0) {
        e.preventDefault();
        const prev = screenHistory[screenHistory.length - 1];
        setScreenHistory((old) => old.slice(0, -1));
        setCurrentScreen(prev);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [screenHistory]);

  const navigateTo = (nextScreen: ScreenState) => {
    if (nextScreen !== currentScreen) {
      setScreenHistory((prev) => [...prev, currentScreen]);
      window.history.pushState({ screen: nextScreen }, '');
      setCurrentScreen(nextScreen);
    }
  };

  const handleBack = () => {
    sound.playTap();
    if (screenHistory.length > 0) {
      const prev = screenHistory[screenHistory.length - 1];
      setScreenHistory((old) => old.slice(0, -1));
      setCurrentScreen(prev);
    } else {
      setCurrentScreen('home');
    }
  };

  // Level Play Trigger
  const handlePlayLevel = (levelId: number) => {
    setActiveLevelId(levelId);
    // Find chapter of this level
    const ch = CHAPTERS.find((c) => levelId >= c.startLevel && levelId <= c.endLevel);
    if (ch) {
      setSelectedChapterId(ch.id);
    }
    navigateTo('gameplay');
  };

  // Level Complete Handler
  const handleLevelComplete = (
    levelId: number,
    stars: number,
    hintsUsed: number,
    attempts: number,
    coinsEarned: number
  ) => {
    const updated = storage.completeLevel(
      levelId,
      stars,
      hintsUsed,
      attempts,
      coinsEarned
    );
    setProgress(updated);
  };

  // Spend Coins Handler
  const handleSpendCoins = (amount: number): boolean => {
    const success = storage.spendCoins(amount);
    if (success) {
      setProgress(storage.getProgress());
    }
    return success;
  };

  // Add Coins
  const handleAddCoins = (amount: number) => {
    const updated = storage.addCoins(amount);
    setProgress(updated);
  };

  // Claim Daily Streak
  const handleClaimDailyReward = (coinsReward: number) => {
    const updated = storage.claimDailyReward(coinsReward);
    setProgress(updated);
    setIsDailyRewardOpen(false);
  };

  // Claim Achievement
  const handleClaimAchievement = (id: string, coinsReward: number) => {
    const updated = storage.claimAchievement(id, coinsReward);
    setProgress(updated);
  };

  // Update Settings
  const handleUpdateSettings = (newSettings: Partial<UserGameProgress['settings']>) => {
    const updated = storage.updateSettings(newSettings);
    setProgress(updated);
  };

  // Update Profile
  const handleUpdateProfile = (newProfile: Partial<UserGameProgress['profile']>) => {
    const updated = storage.updateProfile(newProfile);
    setProgress(updated);
  };

  // Reset Progress
  const handleResetProgress = () => {
    const reset = storage.resetProgress();
    setProgress(reset);
    setCurrentScreen('home');
    setScreenHistory([]);
  };

  // Sound Toggle Shortcut in Header
  const handleToggleSound = () => {
    const nextVal = !progress.settings.soundEnabled;
    sound.setSoundEnabled(nextVal);
    handleUpdateSettings({ soundEnabled: nextVal });
  };

  const handleToggleHaptics = () => {
    const nextVal = !progress.settings.hapticsEnabled;
    sound.setHapticsEnabled(nextVal);
    handleUpdateSettings({ hapticsEnabled: nextVal });
  };

  // Active level data
  const currentPuzzle = getPuzzleById(activeLevelId) || ALL_PUZZLES[0];
  const currentChapter = CHAPTERS.find((c) => c.id === selectedChapterId) || CHAPTERS[0];

  // Daily challenge status
  const dailyStreakStatus = storage.checkDailyStreak();

  // Render Screens
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center justify-between font-sans antialiased">
      {/* 1. Splash Screen */}
      {currentScreen === 'splash' && (
        <SplashScreen
          onFinish={() => {
            if (progress.settings.showTutorial && Object.keys(progress.completedLevels).length === 0) {
              setCurrentScreen('onboarding');
            } else {
              setCurrentScreen('home');
            }
          }}
        />
      )}

      {/* 2. Onboarding Screen */}
      {currentScreen === 'onboarding' && (
        <OnboardingScreen
          onComplete={() => {
            handleUpdateSettings({ showTutorial: false });
            setCurrentScreen('home');
          }}
        />
      )}

      {/* App Shell for standard game screens */}
      {currentScreen !== 'splash' && currentScreen !== 'onboarding' && (
        <div className="w-full max-w-md min-h-screen flex flex-col bg-slate-950 relative shadow-2xl border-x border-slate-900">
          {/* Top Status Header */}
          <Header
            title={
              currentScreen === 'gameplay'
                ? `Level ${currentPuzzle.id}`
                : currentScreen === 'chapter_select'
                ? 'Chapters'
                : currentScreen === 'level_select'
                ? currentChapter.title
                : currentScreen === 'mode_select'
                ? 'Game Modes'
                : currentScreen === 'daily_challenge'
                ? 'Daily Challenge'
                : currentScreen === 'achievements'
                ? 'Badges'
                : currentScreen === 'settings'
                ? 'Settings'
                : undefined
            }
            showBack={currentScreen !== 'home'}
            onBack={handleBack}
            coins={progress.coins}
            stars={
              currentScreen !== 'home'
                ? Object.values(progress.completedLevels).reduce(
                    (s, l) => s + (l.stars || 0),
                    0
                  )
                : undefined
            }
            onOpenSettings={() => navigateTo('settings')}
            onOpenDailyBonus={() => setIsDailyRewardOpen(true)}
            soundEnabled={progress.settings.soundEnabled}
            onToggleSound={handleToggleSound}
          />

          {/* Screen Content View */}
          <main className="flex-1 flex flex-col">
            {currentScreen === 'home' && (
              <HomeScreen
                progress={progress}
                onPlayLevel={handlePlayLevel}
                onNavigate={navigateTo}
                onOpenDailyBonus={() => setIsDailyRewardOpen(true)}
                onOpenCapacitorGuide={() => setIsCapacitorGuideOpen(true)}
              />
            )}

            {currentScreen === 'chapter_select' && (
              <ChapterScreen
                progress={progress}
                onSelectChapter={(chId) => {
                  setSelectedChapterId(chId);
                  navigateTo('level_select');
                }}
              />
            )}

            {currentScreen === 'level_select' && (
              <LevelSelectScreen
                chapter={currentChapter}
                progress={progress}
                onSelectLevel={handlePlayLevel}
                onBackToChapters={() => navigateTo('chapter_select')}
              />
            )}

            {currentScreen === 'mode_select' && (
              <GameModeScreen
                progress={progress}
                onSelectCategory={() => navigateTo('chapter_select')}
                onOpenDaily={() => navigateTo('daily_challenge')}
                onOpenChapters={() => navigateTo('chapter_select')}
              />
            )}

            {currentScreen === 'gameplay' && (
              <PuzzleGameScreen
                level={currentPuzzle}
                progress={progress}
                onLevelComplete={handleLevelComplete}
                onSpendCoins={handleSpendCoins}
                onAddCoins={handleAddCoins}
                onNextLevel={(nextId) => {
                  setActiveLevelId(nextId);
                }}
                onGoHome={() => navigateTo('home')}
                onGoLevels={() => navigateTo('level_select')}
                onToggleSound={handleToggleSound}
                onToggleHaptics={handleToggleHaptics}
              />
            )}

            {currentScreen === 'daily_challenge' && (
              <DailyChallengeScreen
                progress={progress}
                onPlayPuzzle={handlePlayLevel}
                onOpenStreakModal={() => setIsDailyRewardOpen(true)}
              />
            )}

            {currentScreen === 'achievements' && (
              <AchievementsScreen
                progress={progress}
                onClaimAchievement={handleClaimAchievement}
              />
            )}

            {currentScreen === 'settings' && (
              <SettingsScreen
                progress={progress}
                onUpdateSettings={handleUpdateSettings}
                onUpdateProfile={handleUpdateProfile}
                onResetProgress={handleResetProgress}
                onOpenCapacitorGuide={() => setIsCapacitorGuideOpen(true)}
              />
            )}
          </main>

          {/* 7-Day Streak Rewards Modal */}
          <DailyRewardModal
            isOpen={isDailyRewardOpen}
            onClose={() => setIsDailyRewardOpen(false)}
            currentStreak={dailyStreakStatus.streak}
            canClaim={dailyStreakStatus.canClaimBonus}
            onClaim={handleClaimDailyReward}
          />

          {/* Capacitor Android Packaging Modal */}
          <CapacitorGuideModal
            isOpen={isCapacitorGuideOpen}
            onClose={() => setIsCapacitorGuideOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
