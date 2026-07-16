import { getJSON, setJSON } from '@/storage/base';
import { STORAGE_KEYS, defaultStatistics } from '@/storage/defaults';
import type { Statistics } from '@/types/storage';

export function reviveStatistics(raw: unknown): Statistics {
  const r = (raw ?? {}) as Partial<Statistics>;
  const num = (v: unknown, d: number) => (typeof v === 'number' ? v : d);
  return {
    levelsCompleted: num(r.levelsCompleted, 0),
    perfectLevels: num(r.perfectLevels, 0),
    totalMistakes: num(r.totalMistakes, 0),
    gamesPlayed: num(r.gamesPlayed, 0),
  };
}

export async function loadStatistics(): Promise<Statistics> {
  return getJSON(STORAGE_KEYS.statistics, defaultStatistics, reviveStatistics);
}

export async function saveStatistics(stats: Statistics): Promise<boolean> {
  return setJSON(STORAGE_KEYS.statistics, stats);
}
