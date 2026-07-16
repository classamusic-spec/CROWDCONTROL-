import { getJSON, setJSON } from '@/storage/base';
import { STORAGE_KEYS, defaultProgress } from '@/storage/defaults';
import { environments } from '@/data/environments';
import type { LevelProgress, ProgressState } from '@/types/storage';

function reviveLevel(raw: unknown): LevelProgress {
  const r = (raw ?? {}) as Partial<LevelProgress>;
  const stars = ([0, 1, 2, 3] as const).includes(r.stars as 0 | 1 | 2 | 3)
    ? (r.stars as 0 | 1 | 2 | 3)
    : 0;
  return {
    stars,
    completed: typeof r.completed === 'boolean' ? r.completed : false,
    bestTimeMs: typeof r.bestTimeMs === 'number' ? r.bestTimeMs : null,
    bestMoves: typeof r.bestMoves === 'number' ? r.bestMoves : null,
    fewestMistakes:
      typeof r.fewestMistakes === 'number' ? r.fewestMistakes : null,
    perfect: typeof r.perfect === 'boolean' ? r.perfect : false,
  };
}

export function reviveProgress(raw: unknown): ProgressState {
  const r = (raw ?? {}) as Partial<ProgressState>;
  const levels: Record<number, LevelProgress> = {};
  if (r.levels && typeof r.levels === 'object') {
    for (const [k, v] of Object.entries(r.levels)) {
      const n = Number(k);
      if (Number.isInteger(n) && n >= 1) levels[n] = reviveLevel(v);
    }
  }
  const envIds = new Set(environments.map((e) => e.id));
  const selected =
    typeof r.selectedEnvironment === 'string' && envIds.has(r.selectedEnvironment)
      ? r.selectedEnvironment
      : defaultProgress.selectedEnvironment;
  return {
    levels,
    highestUnlocked:
      typeof r.highestUnlocked === 'number' && r.highestUnlocked >= 1
        ? Math.floor(r.highestUnlocked)
        : 1,
    totalStars: typeof r.totalStars === 'number' ? r.totalStars : 0,
    charactersCleared:
      typeof r.charactersCleared === 'number' ? r.charactersCleared : 0,
    playTimeMs: typeof r.playTimeMs === 'number' ? r.playTimeMs : 0,
    cosmetics: Array.isArray(r.cosmetics)
      ? r.cosmetics.filter((c): c is string => typeof c === 'string')
      : [],
    equipped:
      r.equipped && typeof r.equipped === 'object'
        ? (r.equipped as Record<string, string>)
        : {},
    selectedEnvironment: selected,
  };
}

export async function loadProgress(): Promise<ProgressState> {
  return getJSON(STORAGE_KEYS.progress, defaultProgress, reviveProgress);
}

export async function saveProgress(state: ProgressState): Promise<boolean> {
  return setJSON(STORAGE_KEYS.progress, state);
}
