import {
  getBlockingCharacters,
  getPathCells,
  isPathClear,
} from '@/engine/pathChecker';
import type { CrowdCharacter, Direction, GridSize } from '@/types/game';

function ch(
  id: string,
  row: number,
  column: number,
  direction: Direction,
): CrowdCharacter {
  return {
    id,
    row,
    column,
    direction,
    characterVariant: 'bluehoodie',
    outfitVariant: 'default',
    status: 'active',
  };
}

const N: GridSize = 4;

describe('getPathCells', () => {
  it('up: lists cells from character to top edge', () => {
    expect(getPathCells({ row: 2, column: 1, direction: 'up' }, N)).toEqual([
      { row: 1, column: 1 },
      { row: 0, column: 1 },
    ]);
  });
  it('down: lists cells to bottom edge', () => {
    expect(getPathCells({ row: 1, column: 0, direction: 'down' }, N)).toEqual([
      { row: 2, column: 0 },
      { row: 3, column: 0 },
    ]);
  });
  it('left: lists cells to left edge', () => {
    expect(getPathCells({ row: 3, column: 2, direction: 'left' }, N)).toEqual([
      { row: 3, column: 1 },
      { row: 3, column: 0 },
    ]);
  });
  it('right: lists cells to right edge', () => {
    expect(getPathCells({ row: 0, column: 1, direction: 'right' }, N)).toEqual([
      { row: 0, column: 2 },
      { row: 0, column: 3 },
    ]);
  });
  it('edge position facing its edge has an empty path', () => {
    expect(getPathCells({ row: 0, column: 0, direction: 'up' }, N)).toEqual([]);
    expect(getPathCells({ row: 3, column: 3, direction: 'right' }, N)).toEqual(
      [],
    );
  });
});

describe('isPathClear / getBlockingCharacters', () => {
  it('clear path returns true and no blockers', () => {
    const a = ch('a', 3, 0, 'up');
    expect(isPathClear(a, [a], N)).toBe(true);
    expect(getBlockingCharacters(a, [a], N)).toEqual([]);
  });

  it('a single blocker in the path blocks the move', () => {
    const a = ch('a', 3, 0, 'up');
    const b = ch('b', 1, 0, 'left');
    expect(isPathClear(a, [a, b], N)).toBe(false);
    expect(getBlockingCharacters(a, [a, b], N).map((c) => c.id)).toEqual(['b']);
  });

  it('reports multiple blockers', () => {
    const a = ch('a', 3, 2, 'up');
    const b = ch('b', 2, 2, 'left');
    const c = ch('c', 0, 2, 'right');
    const blockers = getBlockingCharacters(a, [a, b, c], N).map((x) => x.id);
    expect(blockers).toEqual(['b', 'c']);
  });

  it('ignores cleared characters when checking the path', () => {
    const a = ch('a', 3, 0, 'up');
    const b = { ...ch('b', 1, 0, 'left'), status: 'cleared' as const };
    expect(isPathClear(a, [a, b], N)).toBe(true);
  });

  it('a character on a perpendicular row/col does not block', () => {
    const a = ch('a', 3, 0, 'up'); // path is column 0
    const b = ch('b', 1, 1, 'up'); // column 1
    expect(isPathClear(a, [a, b], N)).toBe(true);
  });

  it('works on a 6x6 board', () => {
    const a = ch('a', 5, 5, 'up');
    const b = ch('b', 0, 5, 'left');
    expect(isPathClear(a, [a, b], 6)).toBe(false);
  });
});
