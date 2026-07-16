import { useAppState } from '@/hooks/AppState';

/** Settings + updater. Thin wrapper over the app-state context. */
export function useSettings() {
  const { settings, updateSettings } = useAppState();
  return { settings, updateSettings };
}
