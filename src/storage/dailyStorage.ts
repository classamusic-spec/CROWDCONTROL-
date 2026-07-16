import { getJSON, setJSON } from '@/storage/base';
import { STORAGE_KEYS, defaultDaily } from '@/storage/defaults';
import type { DailyEntry, DailyState } from '@/types/storage';

function reviveEntry(raw: unknown): DailyEntry | null {
  const r = (raw ?? {}) as Partial<DailyEntry>;
  if (typeof r.date !== 'string') return null;
  return {
    date: r.date,
    puzzleNumber: typeof r.puzzleNumber === 'number' ? r.puzzleNumber : 0,
    timeMs: typeof r.timeMs === 'number' ? r.timeMs : 0,
    moves: typeof r.moves === 'number' ? r.moves : 0,
    mistakes: typeof r.mistakes === 'number' ? r.mistakes : 0,
    hintsUsed: typeof r.hintsUsed === 'number' ? r.hintsUsed : 0,
    completed: typeof r.completed === 'boolean' ? r.completed : false,
  };
}

export function reviveDaily(raw: unknown): DailyState {
  const r = (raw ?? {}) as Partial<DailyState>;
  const history: Record<string, DailyEntry> = {};
  if (r.history && typeof r.history === 'object') {
    for (const [k, v] of Object.entries(r.history)) {
      const entry = reviveEntry(v);
      if (entry) history[k] = entry;
    }
  }
  return {
    history,
    currentStreak: typeof r.currentStreak === 'number' ? r.currentStreak : 0,
    longestStreak: typeof r.longestStreak === 'number' ? r.longestStreak : 0,
    lastCompletedDate:
      typeof r.lastCompletedDate === 'string' ? r.lastCompletedDate : null,
  };
}

export async function loadDaily(): Promise<DailyState> {
  return getJSON(STORAGE_KEYS.daily, defaultDaily, reviveDaily);
}

export async function saveDaily(state: DailyState): Promise<boolean> {
  return setJSON(STORAGE_KEYS.daily, state);
}
