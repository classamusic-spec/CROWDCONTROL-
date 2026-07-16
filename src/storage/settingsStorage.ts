import { getJSON, setJSON } from '@/storage/base';
import { STORAGE_KEYS, defaultSettings } from '@/storage/defaults';
import type { Settings } from '@/types/storage';

/** Normalize any parsed value into a complete, valid Settings object. */
export function reviveSettings(raw: unknown): Settings {
  const r = (raw ?? {}) as Partial<Settings>;
  const themeOk =
    r.theme === 'system' || r.theme === 'dark' || r.theme === 'light';
  return {
    sound: typeof r.sound === 'boolean' ? r.sound : defaultSettings.sound,
    music: typeof r.music === 'boolean' ? r.music : defaultSettings.music,
    haptics: typeof r.haptics === 'boolean' ? r.haptics : defaultSettings.haptics,
    reducedMotion:
      typeof r.reducedMotion === 'boolean'
        ? r.reducedMotion
        : defaultSettings.reducedMotion,
    theme: themeOk ? r.theme! : defaultSettings.theme,
  };
}

export async function loadSettings(): Promise<Settings> {
  return getJSON(STORAGE_KEYS.settings, defaultSettings, reviveSettings);
}

export async function saveSettings(settings: Settings): Promise<boolean> {
  return setJSON(STORAGE_KEYS.settings, settings);
}
