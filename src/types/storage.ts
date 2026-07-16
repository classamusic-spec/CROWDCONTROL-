import type { Difficulty } from '@/types/game';

/** Persisted data shapes. Bump SCHEMA_VERSION when these change (+migration). */

export const SCHEMA_VERSION = 1;

export type ThemePreference = 'system' | 'dark' | 'light';

export type Settings = {
  sound: boolean;
  music: boolean;
  haptics: boolean;
  reducedMotion: boolean;
  theme: ThemePreference;
};

export type LevelProgress = {
  /** Best (max) stars earned, 0 if not completed. */
  stars: 0 | 1 | 2 | 3;
  completed: boolean;
  bestTimeMs: number | null;
  bestMoves: number | null;
  fewestMistakes: number | null;
  perfect: boolean;
};

export type ProgressState = {
  /** level number → progress */
  levels: Record<number, LevelProgress>;
  /** highest level number unlocked (>=1). */
  highestUnlocked: number;
  totalStars: number;
  charactersCleared: number;
  playTimeMs: number;
  /** owned cosmetic ids. */
  cosmetics: string[];
  /** equipped cosmetic ids by slot. */
  equipped: Record<string, string>;
  selectedEnvironment: string;
};

export type DailyEntry = {
  date: string; // YYYY-MM-DD
  puzzleNumber: number;
  timeMs: number;
  moves: number;
  mistakes: number;
  hintsUsed: number;
  completed: boolean;
};

export type DailyState = {
  /** date → official (first) result */
  history: Record<string, DailyEntry>;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
};

export type OnboardingState = {
  onboardingComplete: boolean;
  tutorialComplete: boolean;
};

export type Statistics = {
  levelsCompleted: number;
  perfectLevels: number;
  totalMistakes: number;
  gamesPlayed: number;
};

export type PersistedRoot = {
  schemaVersion: number;
  settings: Settings;
  progress: ProgressState;
  daily: DailyState;
  onboarding: OnboardingState;
  statistics: Statistics;
};

export type { Difficulty };
