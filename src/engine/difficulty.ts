import { getPathCells } from '@/engine/pathChecker';
import type { CrowdCharacter, Difficulty, GridSize } from '@/types/game';

/**
 * Difficulty metrics for a board. Used by the generator to accept/reject
 * candidates and to label a level. Pure.
 */

export type DifficultyMetrics = {
  gridSize: GridSize;
  characterCount: number;
  /** Fraction of cells occupied. */
  density: number;
  /** How many characters can legally leave from the initial full board. */
  initialLegalMoves: number;
  /** Longest facing path length (a rough branching proxy). */
  solutionLength: number;
  /** 0..1 composite score. */
  score: number;
};

function initialLegalMoves(
  characters: readonly CrowdCharacter[],
  gridSize: GridSize,
): number {
  let count = 0;
  const cellKey = (r: number, c: number) => r * gridSize + c;
  const occupied = new Set<number>();
  for (const c of characters) occupied.add(cellKey(c.row, c.column));
  for (const ch of characters) {
    const path = getPathCells(ch, gridSize);
    const blocked = path.some((cell) => {
      const k = cellKey(cell.row, cell.column);
      return occupied.has(k) && k !== cellKey(ch.row, ch.column);
    });
    if (!blocked) count++;
  }
  return count;
}

export function computeMetrics(
  characters: readonly CrowdCharacter[],
  gridSize: GridSize,
): DifficultyMetrics {
  const cells = gridSize * gridSize;
  const characterCount = characters.length;
  const density = characterCount / cells;
  const legal = initialLegalMoves(characters, gridSize);
  // Fewer immediately-legal moves (relative to count) = more locked-in =
  // harder. Higher density = harder.
  const lockRatio = characterCount === 0 ? 0 : 1 - legal / characterCount;
  const score = Math.min(1, density * 0.6 + lockRatio * 0.6);
  return {
    gridSize,
    characterCount,
    density,
    initialLegalMoves: legal,
    solutionLength: characterCount,
    score,
  };
}

/** Map a grid size to its intended difficulty tier. */
export function tierForGrid(gridSize: GridSize): Difficulty {
  return gridSize === 4 ? 'easy' : gridSize === 5 ? 'medium' : 'hard';
}
