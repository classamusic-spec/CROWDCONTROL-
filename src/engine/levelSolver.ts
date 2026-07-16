import { getPathCells } from '@/engine/pathChecker';
import type { CrowdCharacter, GridSize } from '@/types/game';

/**
 * Depth-first solver with memoization. Determines whether a board of crowd
 * characters can be fully cleared and, if so, returns one valid clear order
 * (list of character ids). Memoizes visited "remaining sets" so shared
 * sub-states are not re-explored.
 *
 * Pure: operates only on character data + grid size.
 */

export type SolveResult = {
  solvable: boolean;
  /** A valid clear order (character ids), or [] if unsolvable/empty. */
  solution: string[];
  /** Diagnostic: number of DFS states expanded. */
  statesExplored: number;
};

type Piece = {
  id: string;
  row: number;
  column: number;
  path: { row: number; column: number }[];
};

/** Precompute each character's path cells once. */
function toPieces(
  characters: readonly CrowdCharacter[],
  gridSize: GridSize,
): Piece[] {
  return characters.map((c) => ({
    id: c.id,
    row: c.row,
    column: c.column,
    path: getPathCells(c, gridSize),
  }));
}

/**
 * Solve. `maxStates` bounds the search so a pathological board cannot hang the
 * validation run; exceeding it returns solvable:false (treated as reject).
 */
export function solveBoard(
  characters: readonly CrowdCharacter[],
  gridSize: GridSize,
  maxStates = 200000,
): SolveResult {
  const pieces = toPieces(characters, gridSize);
  const byId = new Map(pieces.map((p) => [p.id, p]));
  // Occupancy key: cell -> id currently there. Fixed positions, so a piece is
  // "present" iff its id is in the remaining set.
  const cellKey = (r: number, c: number) => r * gridSize + c;
  const occupant = new Map<number, string>();
  for (const p of pieces) occupant.set(cellKey(p.row, p.column), p.id);

  const memo = new Set<string>();
  let statesExplored = 0;

  // remaining is a Set of ids still on the board.
  const remainingKey = (remaining: Set<string>) =>
    [...remaining].sort().join(',');

  const legalMoves = (remaining: Set<string>): string[] => {
    const moves: string[] = [];
    for (const id of remaining) {
      const p = byId.get(id) as Piece;
      let clear = true;
      for (const cell of p.path) {
        const occ = occupant.get(cellKey(cell.row, cell.column));
        if (occ !== undefined && occ !== id && remaining.has(occ)) {
          clear = false;
          break;
        }
      }
      if (clear) moves.push(id);
    }
    return moves;
  };

  const dfs = (remaining: Set<string>, order: string[]): string[] | null => {
    if (remaining.size === 0) return order;
    if (statesExplored++ > maxStates) return null;
    const key = remainingKey(remaining);
    if (memo.has(key)) return null;

    const moves = legalMoves(remaining);
    for (const id of moves) {
      remaining.delete(id);
      order.push(id);
      const result = dfs(remaining, order);
      if (result) return result;
      order.pop();
      remaining.add(id);
    }
    memo.add(key);
    return null;
  };

  if (pieces.length === 0) {
    return { solvable: true, solution: [], statesExplored: 0 };
  }

  const start = new Set(pieces.map((p) => p.id));
  const solution = dfs(start, []);
  return {
    solvable: solution !== null,
    solution: solution ?? [],
    statesExplored,
  };
}

/** True if the given clear order is a fully valid solution for the board. */
export function verifySolution(
  characters: readonly CrowdCharacter[],
  gridSize: GridSize,
  order: readonly string[],
): boolean {
  const pieces = toPieces(characters, gridSize);
  const byId = new Map(pieces.map((p) => [p.id, p]));
  if (order.length !== pieces.length) return false;
  const remaining = new Set(pieces.map((p) => p.id));
  const cellKey = (r: number, c: number) => r * gridSize + c;
  const occupant = new Map<number, string>();
  for (const p of pieces) occupant.set(cellKey(p.row, p.column), p.id);

  for (const id of order) {
    const p = byId.get(id);
    if (!p || !remaining.has(id)) return false;
    for (const cell of p.path) {
      const occ = occupant.get(cellKey(cell.row, cell.column));
      if (occ !== undefined && occ !== id && remaining.has(occ)) return false;
    }
    remaining.delete(id);
  }
  return remaining.size === 0;
}
