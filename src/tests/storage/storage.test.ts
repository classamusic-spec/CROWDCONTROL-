import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS, defaultSettings } from '@/storage/defaults';
import { loadSettings, saveSettings } from '@/storage/settingsStorage';
import { loadProgress, saveProgress } from '@/storage/progressStorage';
import { loadDaily } from '@/storage/dailyStorage';
import { loadOnboarding, saveOnboarding } from '@/storage/onboardingStorage';
import { runMigrations } from '@/storage/storageMigrations';

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('settings storage', () => {
  it('returns defaults when empty', async () => {
    expect(await loadSettings()).toEqual(defaultSettings);
  });

  it('round-trips saved settings', async () => {
    await saveSettings({ ...defaultSettings, sound: false, theme: 'dark' });
    const loaded = await loadSettings();
    expect(loaded.sound).toBe(false);
    expect(loaded.theme).toBe('dark');
  });

  it('recovers to defaults on corrupt data', async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.settings, '{not valid json');
    expect(await loadSettings()).toEqual(defaultSettings);
  });

  it('normalizes partial/invalid stored settings', async () => {
    await AsyncStorage.setItem(
      STORAGE_KEYS.settings,
      JSON.stringify({ sound: 'yes', theme: 'neon' }),
    );
    const loaded = await loadSettings();
    expect(loaded.sound).toBe(defaultSettings.sound);
    expect(loaded.theme).toBe(defaultSettings.theme);
  });
});

describe('progress storage', () => {
  it('defaults to level 1 unlocked', async () => {
    const p = await loadProgress();
    expect(p.highestUnlocked).toBe(1);
    expect(p.totalStars).toBe(0);
  });

  it('round-trips progress', async () => {
    const p = await loadProgress();
    p.levels[1] = {
      stars: 3,
      completed: true,
      bestTimeMs: 1000,
      bestMoves: 5,
      fewestMistakes: 0,
      perfect: true,
    };
    p.highestUnlocked = 2;
    await saveProgress(p);
    const loaded = await loadProgress();
    expect(loaded.levels[1]?.stars).toBe(3);
    expect(loaded.highestUnlocked).toBe(2);
  });

  it('drops invalid environment selections', async () => {
    await AsyncStorage.setItem(
      STORAGE_KEYS.progress,
      JSON.stringify({ selectedEnvironment: 'atlantis' }),
    );
    const loaded = await loadProgress();
    expect(loaded.selectedEnvironment).not.toBe('atlantis');
  });
});

describe('onboarding storage', () => {
  it('defaults to not-complete', async () => {
    const o = await loadOnboarding();
    expect(o.onboardingComplete).toBe(false);
    expect(o.tutorialComplete).toBe(false);
  });

  it('persists completion', async () => {
    await saveOnboarding({ onboardingComplete: true, tutorialComplete: false });
    expect((await loadOnboarding()).onboardingComplete).toBe(true);
  });
});

describe('daily storage & migrations', () => {
  it('daily defaults are empty', async () => {
    const d = await loadDaily();
    expect(d.currentStreak).toBe(0);
    expect(Object.keys(d.history)).toHaveLength(0);
  });

  it('runMigrations stamps the schema version', async () => {
    await runMigrations();
    expect(await AsyncStorage.getItem(STORAGE_KEYS.schema)).toBe('1');
  });
});
