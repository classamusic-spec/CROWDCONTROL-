import { addDays } from '@/utils/date';
import type {
  DailyEntry,
  DailyState,
  LevelProgress,
  ProgressState,
  Statistics,
} from '@/types/storage';

/**
 * Pure progression logic: how a completed level or daily result updates the
 * persisted state. No I/O — storage modules call these then persist the result.
 */

/** How many stars unlock the next environment gate is handled by data; this
 * simply advances the highest-unlocked level counter when a level is cleared. */
export function applyLevelResult(
  progress: ProgressState,
  statistics: Statistics,
  params: {
    levelNumber: number;
    stars: 1 | 2 | 3;
    timeMs: number;
    moves: number;
    mistakes: number;
    perfect: boolean;
    charactersCount: number;
    totalLevels: number;
  },
): { progress: ProgressState; statistics: Statistics } {
  const prev: LevelProgress = progress.levels[params.levelNumber] ?? {
    stars: 0,
    completed: false,
    bestTimeMs: null,
    bestMoves: null,
    fewestMistakes: null,
    perfect: false,
  };
  const wasCompleted = prev.completed;

  const nextLevel: LevelProgress = {
    stars: Math.max(prev.stars, params.stars) as 0 | 1 | 2 | 3,
    completed: true,
    bestTimeMs:
      prev.bestTimeMs == null ? params.timeMs : Math.min(prev.bestTimeMs, params.timeMs),
    bestMoves:
      prev.bestMoves == null ? params.moves : Math.min(prev.bestMoves, params.moves),
    fewestMistakes:
      prev.fewestMistakes == null
        ? params.mistakes
        : Math.min(prev.fewestMistakes, params.mistakes),
    perfect: prev.perfect || params.perfect,
  };

  const levels = { ...progress.levels, [params.levelNumber]: nextLevel };
  const totalStars = Object.values(levels).reduce((n, l) => n + l.stars, 0);

  const highestUnlocked = Math.min(
    params.totalLevels,
    Math.max(progress.highestUnlocked, params.levelNumber + 1),
  );

  const nextProgress: ProgressState = {
    ...progress,
    levels,
    totalStars,
    highestUnlocked,
    charactersCleared: progress.charactersCleared + params.charactersCount,
  };

  const nextStats: Statistics = {
    ...statistics,
    levelsCompleted: statistics.levelsCompleted + (wasCompleted ? 0 : 1),
    perfectLevels:
      statistics.perfectLevels + (params.perfect && !prev.perfect ? 1 : 0),
    totalMistakes: statistics.totalMistakes + params.mistakes,
    gamesPlayed: statistics.gamesPlayed + 1,
  };

  return { progress: nextProgress, statistics: nextStats };
}

/**
 * Apply a daily result. The FIRST completion for a date is official; later
 * replays never overwrite it. Streak advances only when the date is newer than
 * the last completed date and directly follows it.
 */
export function applyDailyResult(daily: DailyState, entry: DailyEntry): DailyState {
  // Already have an official result for this date → keep it unchanged.
  if (daily.history[entry.date]?.completed) return daily;

  const history = { ...daily.history, [entry.date]: { ...entry, completed: true } };

  let currentStreak = daily.currentStreak;
  const last = daily.lastCompletedDate;
  const isNewer = last == null || entry.date > last;
  if (isNewer) {
    currentStreak = last != null && addDays(last, 1) === entry.date ? currentStreak + 1 : 1;
  }
  const longestStreak = Math.max(daily.longestStreak, currentStreak);
  const lastCompletedDate = isNewer ? entry.date : last;

  return { history, currentStreak, longestStreak, lastCompletedDate };
}
