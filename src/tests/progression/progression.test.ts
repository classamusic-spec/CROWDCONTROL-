import { applyDailyResult, applyLevelResult } from '@/engine/progression';
import { defaultDaily, defaultProgress, defaultStatistics } from '@/storage/defaults';
import type { DailyEntry } from '@/types/storage';

describe('applyLevelResult', () => {
  it('records a first completion and unlocks the next level', () => {
    const { progress, statistics } = applyLevelResult(
      defaultProgress,
      defaultStatistics,
      {
        levelNumber: 1,
        stars: 3,
        timeMs: 5000,
        moves: 6,
        mistakes: 0,
        perfect: true,
        charactersCount: 6,
        totalLevels: 60,
      },
    );
    expect(progress.levels[1]?.stars).toBe(3);
    expect(progress.highestUnlocked).toBe(2);
    expect(progress.totalStars).toBe(3);
    expect(progress.charactersCleared).toBe(6);
    expect(statistics.levelsCompleted).toBe(1);
    expect(statistics.perfectLevels).toBe(1);
  });

  it('keeps best stats and does not double-count completion on replay', () => {
    let progress = defaultProgress;
    let statistics = defaultStatistics;
    ({ progress, statistics } = applyLevelResult(progress, statistics, {
      levelNumber: 1, stars: 1, timeMs: 9000, moves: 8, mistakes: 3,
      perfect: false, charactersCount: 6, totalLevels: 60,
    }));
    ({ progress, statistics } = applyLevelResult(progress, statistics, {
      levelNumber: 1, stars: 3, timeMs: 4000, moves: 6, mistakes: 0,
      perfect: true, charactersCount: 6, totalLevels: 60,
    }));
    expect(progress.levels[1]?.stars).toBe(3);
    expect(progress.levels[1]?.bestTimeMs).toBe(4000);
    expect(progress.levels[1]?.fewestMistakes).toBe(0);
    expect(statistics.levelsCompleted).toBe(1); // not double counted
    expect(statistics.gamesPlayed).toBe(2);
  });

  it('does not unlock past the final level', () => {
    const { progress } = applyLevelResult(
      { ...defaultProgress, highestUnlocked: 60 },
      defaultStatistics,
      { levelNumber: 60, stars: 2, timeMs: 1, moves: 1, mistakes: 0,
        perfect: false, charactersCount: 18, totalLevels: 60 },
    );
    expect(progress.highestUnlocked).toBe(60);
  });
});

describe('applyDailyResult streaks', () => {
  const entry = (date: string): DailyEntry => ({
    date, puzzleNumber: 1, timeMs: 1000, moves: 5, mistakes: 0, hintsUsed: 0,
    completed: false,
  });

  it('starts a streak at 1', () => {
    const d = applyDailyResult(defaultDaily, entry('2026-03-01'));
    expect(d.currentStreak).toBe(1);
    expect(d.longestStreak).toBe(1);
    expect(d.lastCompletedDate).toBe('2026-03-01');
  });

  it('increments on consecutive days', () => {
    let d = applyDailyResult(defaultDaily, entry('2026-03-01'));
    d = applyDailyResult(d, entry('2026-03-02'));
    d = applyDailyResult(d, entry('2026-03-03'));
    expect(d.currentStreak).toBe(3);
    expect(d.longestStreak).toBe(3);
  });

  it('resets after a gap but keeps the longest', () => {
    let d = applyDailyResult(defaultDaily, entry('2026-03-01'));
    d = applyDailyResult(d, entry('2026-03-02'));
    d = applyDailyResult(d, entry('2026-03-05')); // gap
    expect(d.currentStreak).toBe(1);
    expect(d.longestStreak).toBe(2);
  });

  it('first completion is official; replay does not change it', () => {
    let d = applyDailyResult(defaultDaily, entry('2026-03-01'));
    const better = { ...entry('2026-03-01'), moves: 1, timeMs: 1 };
    d = applyDailyResult(d, better);
    expect(d.history['2026-03-01']?.moves).toBe(5); // unchanged official
    expect(d.currentStreak).toBe(1);
  });
});
