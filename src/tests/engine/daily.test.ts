import { createDailyLevel, dailyEnvironment } from '@/engine/dailySeed';
import { solveBoard, verifySolution } from '@/engine/levelSolver';
import { buildDailyShareText } from '@/utils/shareText';
import { dailyNumber, daysBetween, toUtcDateString } from '@/utils/date';

describe('daily challenge', () => {
  it('same date produces the same board', () => {
    const a = createDailyLevel('2026-03-14');
    const b = createDailyLevel('2026-03-14');
    expect(JSON.stringify(a)).toEqual(JSON.stringify(b));
  });

  it('different dates produce different boards', () => {
    const a = createDailyLevel('2026-03-14');
    const b = createDailyLevel('2026-03-15');
    expect(JSON.stringify(a.characters)).not.toEqual(
      JSON.stringify(b.characters),
    );
  });

  it('daily board is solvable and its solution verifies', () => {
    const level = createDailyLevel('2026-07-16');
    const solved = solveBoard(level.characters, level.gridSize);
    expect(solved.solvable).toBe(true);
    expect(verifySolution(level.characters, level.gridSize, level.knownSolution)).toBe(
      true,
    );
  });

  it('puzzle number counts UTC days from the epoch', () => {
    expect(dailyNumber('2025-01-01')).toBe(1);
    expect(dailyNumber('2025-01-02')).toBe(2);
    expect(daysBetween('2025-01-01', '2025-02-01')).toBe(31);
  });

  it('UTC date formatting ignores local timezone offset', () => {
    // A fixed instant; getUTC* is timezone-independent.
    const d = new Date(Date.UTC(2026, 6, 16, 23, 30, 0));
    expect(toUtcDateString(d)).toBe('2026-07-16');
  });

  it('environment rotates deterministically', () => {
    expect(dailyEnvironment('2026-03-14')).toBe(dailyEnvironment('2026-03-14'));
  });

  it('share text includes stats and never a solution', () => {
    const text = buildDailyShareText({
      puzzleNumber: 142,
      timeMs: 34000,
      moves: 24,
      mistakes: 0,
      streak: 7,
    });
    expect(text).toContain('CROWD CONTROL #142');
    expect(text).toContain('00:34');
    expect(text).toContain('24 moves');
    expect(text).toContain('7-day streak');
    expect(text).toContain('#CrowdControlDaily');
    // No character ids / solution leakage.
    expect(text).not.toMatch(/c\d+/);
  });
});
