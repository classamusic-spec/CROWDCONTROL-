import type { GridSize, LevelDefinition } from '@/types/game';

/**
 * Scoring. Stars are driven primarily by mistakes, with time vs. par as the
 * 3-star gate. See docs/PRODUCT_SPEC.md §4.
 */

export type LevelResult = {
  timeMs: number;
  moves: number;
  mistakes: number;
  hintsUsed: number;
};

/** Par time in ms: a generous budget scaled by grid size and character count. */
export function parTimeMs(gridSize: GridSize, characterCount: number): number {
  const perCharacter = gridSize <= 4 ? 1600 : gridSize === 5 ? 1900 : 2200;
  return characterCount * perCharacter;
}

/**
 * Stars (1-3):
 * - 3: zero mistakes, no hints, and time within par.
 * - 2: at most 2 mistakes.
 * - 1: completed.
 */
export function calculateStars(
  level: Pick<LevelDefinition, 'gridSize' | 'characters'>,
  result: LevelResult,
): 1 | 2 | 3 {
  const par = parTimeMs(level.gridSize, level.characters.length);
  if (
    result.mistakes === 0 &&
    result.hintsUsed === 0 &&
    result.timeMs <= par
  ) {
    return 3;
  }
  if (result.mistakes <= 2) return 2;
  return 1;
}

/** A perfect clear: 3 stars with zero mistakes and no hints. */
export function isPerfect(
  level: Pick<LevelDefinition, 'gridSize' | 'characters'>,
  result: LevelResult,
): boolean {
  return calculateStars(level, result) === 3 && result.mistakes === 0;
}

/** Par moves for a level equals the number of characters (one move each). */
export function parMovesFor(
  level: Pick<LevelDefinition, 'characters'>,
): number {
  return level.characters.length;
}
