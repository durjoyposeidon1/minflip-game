export type PuzzleCategory = 'tricky' | 'math' | 'visual' | 'memory' | 'logic';

export type InteractionType =
  | 'choice'              // Multiple cards/buttons
  | 'find_odd'            // Grid of visual elements, tap the unusual one
  | 'matchstick'          // Move or remove a matchstick
  | 'number_input'        // Keypad input for arithmetic/number answers
  | 'interactive_scene'   // Dragging/toggling/tapping elements in an SVG scene
  | 'sequence'            // Tap items in a specific order
  | 'memory_cards'        // Pair matching memory cards
  | 'connect_wire'        // Connect corresponding logic points
  | 'slider_balance';     // Adjust balance or scale

export interface ChoiceOption {
  id: string | number;
  label: string;
  sublabel?: string;
  icon?: string;
  svgContent?: string;
}

export interface MatchstickItem {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active: boolean;
}

export interface InteractiveSceneElement {
  id: string;
  type: 'draggable' | 'tappable' | 'toggle' | 'target' | 'static';
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width?: number;
  height?: number;
  label?: string;
  icon?: string;
  color?: string;
  state?: any;
  targetId?: string; // where draggable can drop
  renderCustom?: string; // custom SVG keyword
}

export interface PuzzleLevel {
  id: number;              // 1 to 100
  chapterId: 1 | 2 | 3 | 4 | 5;
  levelNumber: number;     // 1 to 20 within chapter
  category: PuzzleCategory;
  title: string;
  question: string;
  instructions: string;
  interactionType: InteractionType;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rewardCoins: number;
  
  // Data specific to interactionType
  options?: ChoiceOption[];
  correctAnswer: any; // id, array of ids, number, or boolean state
  
  // Custom interaction configurations
  interactiveElements?: InteractiveSceneElement[];
  matchstickData?: {
    sticks: MatchstickItem[];
    equationFormula: string;
    maxMoves: number;
    targetResult: number;
  };
  sequenceItems?: { id: string | number; label: string; icon?: string }[];
  memoryCards?: { id: string; pairKey: string; icon: string; label: string }[];
  gridOddData?: {
    items: { id: number; symbol: string; isOdd: boolean; detail?: string }[];
    gridCols: number;
  };

  // Explanation and hints
  explanation: string;
  hint1: string; // Small nudge (15 coins)
  hint2: string; // Eliminate option / partial answer (30 coins)
  hint3: string; // Key solution (50 coins)
}

export interface Chapter {
  id: 1 | 2 | 3 | 4 | 5;
  title: string;
  subtitle: string;
  description: string;
  themeColor: string;
  accentBg: string;
  startLevel: number;
  endLevel: number;
  requiredStars: number;
  icon: string;
}

export interface LevelProgress {
  levelId: number;
  completed: boolean;
  stars: number; // 1, 2, 3
  hintsUsed: number;
  attempts: number;
  bestTimeSeconds?: number;
  completedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rewardCoins: number;
  category: 'progress' | 'stars' | 'streak' | 'skills' | 'special';
  currentValue: number;
  targetValue: number;
  completed: boolean;
  claimed: boolean;
}

export interface UserProfile {
  name: string;
  avatar: string;
  title: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
  darkMode: boolean;
  showTutorial: boolean;
}

export interface DailyChallengeState {
  lastCompletedDate: string; // YYYY-MM-DD
  currentStreak: number;
  highestStreak: number;
  todaySolved: boolean;
  todayPuzzleId: number;
  claimedRewardToday: boolean;
}

export interface UserGameProgress {
  profile: UserProfile;
  coins: number;
  unlockedLevels: number; // Highest level unlocked (e.g. 1 means level 1 is playable)
  completedLevels: Record<number, LevelProgress>;
  settings: GameSettings;
  daily: DailyChallengeState;
  claimedAchievements: string[];
  totalPlayTimeSeconds: number;
}

export type ScreenState =
  | 'splash'
  | 'onboarding'
  | 'home'
  | 'mode_select'
  | 'chapter_select'
  | 'level_select'
  | 'gameplay'
  | 'daily_challenge'
  | 'achievements'
  | 'settings';
