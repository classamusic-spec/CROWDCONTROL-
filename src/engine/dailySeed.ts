import { generateLevel } from '@/engine/levelGenerator';
import { dailyNumber } from '@/utils/date';
import { createRng } from '@/utils/seededRandom';
import type { GridSize, LevelDefinition } from '@/types/game';

/**
 * Deterministic daily challenge. The seed is the UTC date string `YYYY-MM-DD`,
 * so the same date always yields the same puzzle worldwide, offline. Grid size
 * and environment are also derived from the seed for day-to-day variety.
 */

const ENVIRONMENTS = [
  'concert',
  'airport',
  'subway',
  'themepark',
  'school',
  'mall',
] as const;

/** Choose a grid size for a given date (weighted toward 5×5). */
export function dailyGridSize(dateString: string): GridSize {
  const rng = createRng(`grid:${dateString}`);
  const roll = rng.next();
  if (roll < 0.3) return 4;
  if (roll < 0.75) return 5;
  return 6;
}

/** Choose an environment for a given date. */
export function dailyEnvironment(dateString: string): string {
  const n = dailyNumber(dateString);
  const idx = ((n % ENVIRONMENTS.length) + ENVIRONMENTS.length) % ENVIRONMENTS.length;
  return ENVIRONMENTS[idx] ?? ENVIRONMENTS[0];
}

/** Build the full daily LevelDefinition for a UTC date string. */
export function createDailyLevel(dateString: string): LevelDefinition {
  const number = dailyNumber(dateString);
  const gridSize = dailyGridSize(dateString);
  const environmentId = dailyEnvironment(dateString);
  const level = generateLevel(
    `daily:${dateString}`,
    number,
    gridSize,
    environmentId,
  );
  return {
    ...level,
    id: `daily-${dateString}`,
    title: `Daily #${number}`,
  };
}
