import { useMemo } from 'react';

import { createDailyLevel } from '@/engine/dailySeed';
import { useAppState } from '@/hooks/AppState';
import { todayUtc } from '@/utils/date';

/**
 * The daily challenge for a given UTC date (defaults to today). Exposes the
 * deterministic level, the official result (if any), and the recorder.
 */
export function useDailyChallenge(dateString: string = todayUtc()) {
  const { daily, recordDailyResult } = useAppState();
  const level = useMemo(() => createDailyLevel(dateString), [dateString]);
  const official = daily.history[dateString] ?? null;
  return {
    date: dateString,
    level,
    official,
    completed: official?.completed ?? false,
    currentStreak: daily.currentStreak,
    longestStreak: daily.longestStreak,
    history: daily.history,
    recordDailyResult,
  };
}
