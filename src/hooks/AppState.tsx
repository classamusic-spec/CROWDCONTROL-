import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { applyDailyResult, applyLevelResult } from '@/engine/progression';
import {
  defaultDaily,
  defaultOnboarding,
  defaultProgress,
  defaultSettings,
  defaultStatistics,
} from '@/storage/defaults';
import { loadDaily, saveDaily } from '@/storage/dailyStorage';
import { loadOnboarding, saveOnboarding } from '@/storage/onboardingStorage';
import { loadProgress, saveProgress } from '@/storage/progressStorage';
import { loadSettings, saveSettings } from '@/storage/settingsStorage';
import { loadStatistics, saveStatistics } from '@/storage/statisticsStorage';
import { runMigrations } from '@/storage/storageMigrations';
import type {
  DailyEntry,
  DailyState,
  OnboardingState,
  ProgressState,
  Settings,
  Statistics,
} from '@/types/storage';

type LevelResultInput = {
  levelNumber: number;
  stars: 1 | 2 | 3;
  timeMs: number;
  moves: number;
  mistakes: number;
  perfect: boolean;
  charactersCount: number;
  totalLevels: number;
};

type AppStateValue = {
  ready: boolean;
  settings: Settings;
  progress: ProgressState;
  daily: DailyState;
  onboarding: OnboardingState;
  statistics: Statistics;
  updateSettings: (patch: Partial<Settings>) => void;
  recordLevelResult: (input: LevelResultInput) => void;
  recordDailyResult: (entry: DailyEntry) => void;
  completeOnboarding: () => void;
  completeTutorial: () => void;
  setSelectedEnvironment: (id: string) => void;
  unlockCosmetic: (id: string) => void;
  equipCosmetic: (slot: string, id: string) => void;
  addPlayTime: (ms: number) => void;
  resetProgress: () => void;
};

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [progress, setProgress] = useState<ProgressState>(defaultProgress);
  const [daily, setDaily] = useState<DailyState>(defaultDaily);
  const [onboarding, setOnboarding] = useState<OnboardingState>(defaultOnboarding);
  const [statistics, setStatistics] = useState<Statistics>(defaultStatistics);

  // Refs mirror the latest state so callbacks are stable AND never stale.
  const progressRef = useRef(progress);
  const statsRef = useRef(statistics);
  const dailyRef = useRef(daily);
  progressRef.current = progress;
  statsRef.current = statistics;
  dailyRef.current = daily;

  useEffect(() => {
    let active = true;
    (async () => {
      await runMigrations();
      const [s, p, d, o, st] = await Promise.all([
        loadSettings(),
        loadProgress(),
        loadDaily(),
        loadOnboarding(),
        loadStatistics(),
      ]);
      if (!active) return;
      setSettings(s);
      setProgress(p);
      setDaily(d);
      setOnboarding(o);
      setStatistics(st);
      setReady(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      void saveSettings(next);
      return next;
    });
  }, []);

  const recordLevelResult = useCallback((input: LevelResultInput) => {
    const { progress: np, statistics: ns } = applyLevelResult(
      progressRef.current,
      statsRef.current,
      input,
    );
    progressRef.current = np;
    statsRef.current = ns;
    setProgress(np);
    setStatistics(ns);
    void saveProgress(np);
    void saveStatistics(ns);
  }, []);

  const recordDailyResult = useCallback((entry: DailyEntry) => {
    const next = applyDailyResult(dailyRef.current, entry);
    dailyRef.current = next;
    setDaily(next);
    void saveDaily(next);
  }, []);

  const completeOnboarding = useCallback(() => {
    setOnboarding((prev) => {
      const next = { ...prev, onboardingComplete: true };
      void saveOnboarding(next);
      return next;
    });
  }, []);

  const completeTutorial = useCallback(() => {
    setOnboarding((prev) => {
      const next = { ...prev, tutorialComplete: true };
      void saveOnboarding(next);
      return next;
    });
    // Tutorial reward: Concert Rookie Outfit.
    setProgress((prev) => {
      if (prev.cosmetics.includes('outfit_concert_rookie')) return prev;
      const next = { ...prev, cosmetics: [...prev.cosmetics, 'outfit_concert_rookie'] };
      progressRef.current = next;
      void saveProgress(next);
      return next;
    });
  }, []);

  const setSelectedEnvironment = useCallback((id: string) => {
    setProgress((prev) => {
      const next = { ...prev, selectedEnvironment: id };
      progressRef.current = next;
      void saveProgress(next);
      return next;
    });
  }, []);

  const unlockCosmetic = useCallback((id: string) => {
    setProgress((prev) => {
      if (prev.cosmetics.includes(id)) return prev;
      const next = { ...prev, cosmetics: [...prev.cosmetics, id] };
      progressRef.current = next;
      void saveProgress(next);
      return next;
    });
  }, []);

  const equipCosmetic = useCallback((slot: string, id: string) => {
    setProgress((prev) => {
      const next = { ...prev, equipped: { ...prev.equipped, [slot]: id } };
      progressRef.current = next;
      void saveProgress(next);
      return next;
    });
  }, []);

  const addPlayTime = useCallback((ms: number) => {
    setProgress((prev) => {
      const next = { ...prev, playTimeMs: prev.playTimeMs + ms };
      progressRef.current = next;
      void saveProgress(next);
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    progressRef.current = defaultProgress;
    statsRef.current = defaultStatistics;
    dailyRef.current = defaultDaily;
    setProgress(defaultProgress);
    setStatistics(defaultStatistics);
    setDaily(defaultDaily);
    void saveProgress(defaultProgress);
    void saveStatistics(defaultStatistics);
    void saveDaily(defaultDaily);
  }, []);

  const value = useMemo<AppStateValue>(
    () => ({
      ready,
      settings,
      progress,
      daily,
      onboarding,
      statistics,
      updateSettings,
      recordLevelResult,
      recordDailyResult,
      completeOnboarding,
      completeTutorial,
      setSelectedEnvironment,
      unlockCosmetic,
      equipCosmetic,
      addPlayTime,
      resetProgress,
    }),
    [
      ready, settings, progress, daily, onboarding, statistics,
      updateSettings, recordLevelResult, recordDailyResult, completeOnboarding,
      completeTutorial, setSelectedEnvironment, unlockCosmetic, equipCosmetic,
      addPlayTime, resetProgress,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
