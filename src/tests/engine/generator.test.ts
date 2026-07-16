import { computeMetrics } from '@/engine/difficulty';
import {
  CHARACTER_VARIANTS,
  defaultConfig,
  generateBoard,
  generateLevel,
} from '@/engine/levelGenerator';
import { solveBoard, verifySolution } from '@/engine/levelSolver';
import type { GridSize } from '@/types/game';

const SIZES: GridSize[] = [4, 5, 6];

describe('level generator', () => {
  it('is deterministic: same seed → identical board', () => {
    const a = generateBoard('seed-x', defaultConfig(5));
    const b = generateBoard('seed-x', defaultConfig(5));
    expect(JSON.stringify(a)).toEqual(JSON.stringify(b));
  });

  it('different seeds usually produce different boards', () => {
    const a = generateBoard('seed-a', defaultConfig(5));
    const b = generateBoard('seed-b', defaultConfig(5));
    expect(JSON.stringify(a)).not.toEqual(JSON.stringify(b));
  });

  it.each(SIZES)('produces valid, solvable %ix boards', (gridSize) => {
    const board = generateBoard(`gen-${gridSize}`, defaultConfig(gridSize));
    // bounds + unique ids + valid directions
    const ids = new Set<string>();
    const cells = new Set<number>();
    for (const c of board.characters) {
      expect(c.row).toBeGreaterThanOrEqual(0);
      expect(c.row).toBeLessThan(gridSize);
      expect(c.column).toBeGreaterThanOrEqual(0);
      expect(c.column).toBeLessThan(gridSize);
      expect(['up', 'down', 'left', 'right']).toContain(c.direction);
      expect(CHARACTER_VARIANTS).toContain(c.characterVariant as never);
      expect(ids.has(c.id)).toBe(false);
      ids.add(c.id);
      const key = c.row * gridSize + c.column;
      expect(cells.has(key)).toBe(false);
      cells.add(key);
    }
    // solvable + solution valid
    const solved = solveBoard(board.characters, gridSize);
    expect(solved.solvable).toBe(true);
    expect(verifySolution(board.characters, gridSize, board.knownSolution)).toBe(
      true,
    );
  });

  it('rejects trivial boards (respects maxInitialLegalRatio)', () => {
    const gridSize: GridSize = 5;
    const board = generateBoard('trivia', defaultConfig(gridSize));
    const m = computeMetrics(board.characters, gridSize);
    expect(m.initialLegalMoves / board.characters.length).toBeLessThanOrEqual(
      defaultConfig(gridSize).maxInitialLegalRatio + 1e-9,
    );
  });

  it('generateLevel wires number, environment, and par', () => {
    const level = generateLevel('lvl-seed', 7, 4, 'concert');
    expect(level.number).toBe(7);
    expect(level.environmentId).toBe('concert');
    expect(level.difficulty).toBe('easy');
    expect(level.parMoves).toBe(level.characters.length);
  });
});
