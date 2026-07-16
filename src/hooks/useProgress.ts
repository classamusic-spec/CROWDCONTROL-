import { useAppState } from '@/hooks/AppState';

/** Progression + statistics + mutators. */
export function useProgress() {
  const {
    progress,
    statistics,
    recordLevelResult,
    setSelectedEnvironment,
    unlockCosmetic,
    equipCosmetic,
    addPlayTime,
    resetProgress,
  } = useAppState();
  return {
    progress,
    statistics,
    recordLevelResult,
    setSelectedEnvironment,
    unlockCosmetic,
    equipCosmetic,
    addPlayTime,
    resetProgress,
  };
}
