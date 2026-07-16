import { environments } from '@/data/environments';
import {
  SCHEMA_VERSION,
  type DailyState,
  type OnboardingState,
  type ProgressState,
  type Settings,
  type Statistics,
} from '@/types/storage';

/** Safe default values used on first run and for corrupt-data recovery. */

export const defaultSettings: Settings = {
  sound: true,
  music: true,
  haptics: true,
  reducedMotion: false,
  theme: 'system',
};

export const defaultProgress: ProgressState = {
  levels: {},
  highestUnlocked: 1,
  totalStars: 0,
  charactersCleared: 0,
  playTimeMs: 0,
  cosmetics: [],
  equipped: {},
  selectedEnvironment: environments[0]?.id ?? 'concert',
};

export const defaultDaily: DailyState = {
  history: {},
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: null,
};

export const defaultOnboarding: OnboardingState = {
  onboardingComplete: false,
  tutorialComplete: false,
};

export const defaultStatistics: Statistics = {
  levelsCompleted: 0,
  perfectLevels: 0,
  totalMistakes: 0,
  gamesPlayed: 0,
};

export const STORAGE_KEYS = {
  schema: 'ccd.schemaVersion',
  settings: 'ccd.settings',
  progress: 'ccd.progress',
  daily: 'ccd.daily',
  onboarding: 'ccd.onboarding',
  statistics: 'ccd.statistics',
} as const;

export { SCHEMA_VERSION };
