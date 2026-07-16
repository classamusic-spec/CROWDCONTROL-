import type {
  Cell,
  CrowdCharacter,
  Direction,
  GridSize,
} from '@/types/game';

/**
 * Pure path logic. A character can leave the board only when every cell between
 * it and the corresponding edge (in its facing direction) is empty of
 * uncleared characters. See docs/PRODUCT_SPEC.md §3.
 *
 * Coordinates: row 0 = top, column 0 = left.
 */

const DELTA: Record<Direction, Cell> = {
  up: { row: -1, column: 0 },
  down: { row: 1, column: 0 },
  left: { row: 0, column: -1 },
  right: { row: 0, column: 1 },
};

/**
 * The straight line of cells from the character (exclusive) to the edge in its
 * direction. Empty array if the character already sits on the exit edge.
 */
export function getPathCells(
  character: Pick<CrowdCharacter, 'row' | 'column' | 'direction'>,
  gridSize: GridSize,
): Cell[] {
  const { row: dr, column: dc } = DELTA[character.direction];
  const cells: Cell[] = [];
  let r = character.row + dr;
  let c = character.column + dc;
  while (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
    cells.push({ row: r, column: c });
    r += dr;
    c += dc;
  }
  return cells;
}

/** True if two coordinates refer to the same cell. */
function sameCell(a: Cell, b: { row: number; column: number }): boolean {
  return a.row === b.row && a.column === b.column;
}

/**
 * Characters (uncleared) that occupy the tapped character's path and therefore
 * block its exit. Returns [] when the path is clear. The character itself and
 * any already-cleared characters are never counted.
 */
export function getBlockingCharacters(
  character: CrowdCharacter,
  characters: readonly CrowdCharacter[],
  gridSize: GridSize,
): CrowdCharacter[] {
  const path = getPathCells(character, gridSize);
  if (path.length === 0) return [];
  const occupied = characters.filter(
    (c) => c.id !== character.id && c.status !== 'cleared',
  );
  const blockers: CrowdCharacter[] = [];
  for (const cell of path) {
    for (const other of occupied) {
      if (sameCell(cell, other)) blockers.push(other);
    }
  }
  return blockers;
}

/**
 * True when the character's exit path is completely clear of uncleared
 * characters (i.e. the move is legal).
 */
export function isPathClear(
  character: CrowdCharacter,
  characters: readonly CrowdCharacter[],
  gridSize: GridSize,
): boolean {
  return getBlockingCharacters(character, characters, gridSize).length === 0;
}
