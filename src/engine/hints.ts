import { solveBoard } from '@/engine/levelSolver';
import type { BoardState } from '@/types/game';

/**
 * Hint system. Returns the id of a safe next move — one that keeps the board
 * solvable — by solving the *current* remaining board and taking the first
 * step of that solution. Returns null if there is no move (complete) or the
 * position is somehow stuck. Pure.
 */
export function getHint(state: BoardState): string | null {
  const active = state.characters.filter((c) => c.status !== 'cleared');
  if (active.length === 0) return null;
  const solved = solveBoard(active, state.gridSize);
  if (!solved.solvable || solved.solution.length === 0) return null;
  return solved.solution[0] ?? null;
}
