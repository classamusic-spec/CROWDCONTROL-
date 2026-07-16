import { solveBoard, verifySolution } from '@/engine/levelSolver';
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

describe('solveBoard', () => {
  it('solves an empty board trivially', () => {
    const r = solveBoard([], 4);
    expect(r.solvable).toBe(true);
    expect(r.solution).toEqual([]);
  });

  it('solves a simple ordered board', () => {
    // 'a' faces up but is blocked by 'b'; 'b' faces left and is free.
    const board = [ch('a', 3, 0, 'up'), ch('b', 1, 0, 'left')];
    const r = solveBoard(board, 4);
    expect(r.solvable).toBe(true);
    expect(verifySolution(board, 4, r.solution)).toBe(true);
    // 'b' must be cleared before 'a'.
    expect(r.solution.indexOf('b')).toBeLessThan(r.solution.indexOf('a'));
  });

  it('detects an unsolvable deadlock (mutual block)', () => {
    // Two characters each blocking the other's only path.
    const board = [ch('a', 0, 0, 'right'), ch('b', 0, 1, 'left')];
    const r = solveBoard(board, 4);
    expect(r.solvable).toBe(false);
  });

  it('verifySolution rejects a wrong order', () => {
    const board = [ch('a', 3, 0, 'up'), ch('b', 1, 0, 'left')];
    expect(verifySolution(board, 4, ['a', 'b'])).toBe(false);
    expect(verifySolution(board, 4, ['b', 'a'])).toBe(true);
  });

  it('verifySolution rejects incomplete orders', () => {
    const board = [ch('a', 3, 0, 'up'), ch('b', 1, 0, 'left')];
    expect(verifySolution(board, 4, ['b'])).toBe(false);
  });

  it('solves a larger 6x6 board that generator produces', () => {
    const board: CrowdCharacter[] = [
      ch('a', 5, 0, 'up'),
      ch('b', 3, 0, 'right'),
      ch('c', 3, 5, 'up'),
    ];
    const gridSize: GridSize = 6;
    const r = solveBoard(board, gridSize);
    expect(r.solvable).toBe(true);
    expect(verifySolution(board, gridSize, r.solution)).toBe(true);
  });
});
