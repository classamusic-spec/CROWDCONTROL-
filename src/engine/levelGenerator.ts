import { computeMetrics, tierForGrid } from '@/engine/difficulty';
import { solveBoard, verifySolution } from '@/engine/levelSolver';
import { createRng, type Rng } from '@/utils/seededRandom';
import type {
  CrowdCharacter,
  Difficulty,
  Direction,
  GridSize,
  LevelDefinition,
} from '@/types/game';

/**
 * Deterministic seeded level generator using reverse-construction:
 *
 *   1. Begin empty.
 *   2. Repeatedly place a character on an empty cell facing a direction whose
 *      path is currently clear of already-placed characters.
 *   3. Record insertion order; the reverse of that order is a valid solution.
 *   4. Validate the candidate with the solver and difficulty metrics.
 *   5. Reject trivial / unsolvable boards and retry with a derived seed.
 *
 * Same seed + config → identical level, on every platform. Pure (no I/O).
 */

const DIRECTIONS: Direction[] = ['up', 'down', 'left', 'right'];

// The 12 base character identities (see docs/ASSET_MANIFEST.md).
export const CHARACTER_VARIANTS = [
  'bluehoodie',
  'pinkpigtail',
  'greencap',
  'purpleglasses',
  'orangeheadphones',
  'yellowoveralls',
  'curlyhair',
  'oldertraveler',
  'sportsfan',
  'student',
  'mallshopper',
  'festivalattendee',
] as const;

export type GenConfig = {
  gridSize: GridSize;
  targetCount: number;
  /** Minimum acceptable character count. */
  minCount: number;
  /**
   * Reject boards where more than this fraction of characters can leave from
   * the initial full board (too trivial). 0..1.
   */
  maxInitialLegalRatio: number;
};

/** Default config per difficulty tier. */
export function defaultConfig(gridSize: GridSize): GenConfig {
  switch (gridSize) {
    case 4:
      return { gridSize, targetCount: 7, minCount: 5, maxInitialLegalRatio: 0.85 };
    case 5:
      return { gridSize, targetCount: 12, minCount: 9, maxInitialLegalRatio: 0.7 };
    case 6:
      return { gridSize, targetCount: 18, minCount: 14, maxInitialLegalRatio: 0.6 };
  }
}

type Placed = {
  id: string;
  row: number;
  column: number;
  direction: Direction;
};

function pathClearForPlacement(
  row: number,
  column: number,
  direction: Direction,
  gridSize: GridSize,
  occupied: Set<number>,
): boolean {
  const d =
    direction === 'up'
      ? { r: -1, c: 0 }
      : direction === 'down'
        ? { r: 1, c: 0 }
        : direction === 'left'
          ? { r: 0, c: -1 }
          : { r: 0, c: 1 };
  let r = row + d.r;
  let c = column + d.c;
  while (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
    if (occupied.has(r * gridSize + c)) return false;
    r += d.r;
    c += d.c;
  }
  return true;
}

/** One construction attempt. Returns placed characters in insertion order. */
function constructOnce(config: GenConfig, rng: Rng): Placed[] {
  const { gridSize, targetCount } = config;
  const occupied = new Set<number>();
  const placed: Placed[] = [];

  const allCells: { row: number; column: number }[] = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) allCells.push({ row: r, column: c });
  }

  let attempts = 0;
  const maxAttempts = targetCount * 40;
  while (placed.length < targetCount && attempts < maxAttempts) {
    attempts++;
    const emptyCells = rng.shuffle(
      allCells.filter((cell) => !occupied.has(cell.row * gridSize + cell.column)),
    );
    let placedThis = false;
    for (const cell of emptyCells) {
      const dirs = rng.shuffle(DIRECTIONS);
      for (const dir of dirs) {
        if (
          pathClearForPlacement(cell.row, cell.column, dir, gridSize, occupied)
        ) {
          placed.push({
            id: `c${placed.length}`,
            row: cell.row,
            column: cell.column,
            direction: dir,
          });
          occupied.add(cell.row * gridSize + cell.column);
          placedThis = true;
          break;
        }
      }
      if (placedThis) break;
    }
    if (!placedThis) break; // board is saturated
  }
  return placed;
}

function toCharacters(placed: Placed[], rng: Rng): CrowdCharacter[] {
  return placed.map((p) => ({
    id: p.id,
    row: p.row,
    column: p.column,
    direction: p.direction,
    characterVariant: rng.pick(CHARACTER_VARIANTS),
    outfitVariant: 'default',
    status: 'active' as const,
  }));
}

export type GeneratedLevel = {
  characters: CrowdCharacter[];
  knownSolution: string[];
  gridSize: GridSize;
  difficulty: Difficulty;
};

/**
 * Generate a validated board for the given seed & config. Retries with derived
 * seeds until a non-trivial, solver-validated board is produced. Throws if it
 * cannot after many attempts (should not happen with default configs).
 */
export function generateBoard(
  seed: string,
  config: GenConfig,
  maxRetries = 200,
): GeneratedLevel {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const rng = createRng(`${seed}#${attempt}`);
    const placed = constructOnce(config, rng);
    if (placed.length < config.minCount) continue;

    const characters = toCharacters(placed, rng);
    const gridSize = config.gridSize;

    // Reverse insertion order is a candidate solution.
    const candidateSolution = placed.map((p) => p.id).reverse();
    if (!verifySolution(characters, gridSize, candidateSolution)) {
      // Construction invariant violated — should not happen; skip defensively.
      continue;
    }

    // Reject trivial boards.
    const metrics = computeMetrics(characters, gridSize);
    if (metrics.initialLegalMoves / characters.length > config.maxInitialLegalRatio) {
      continue;
    }

    // Independent solver confirmation (defence in depth) + memoized solve.
    const solved = solveBoard(characters, gridSize);
    if (!solved.solvable) continue;

    return {
      characters,
      knownSolution: candidateSolution,
      gridSize,
      difficulty: tierForGrid(gridSize),
    };
  }
  throw new Error(`generateBoard: could not generate for seed "${seed}"`);
}

/** Generate a full LevelDefinition (with number, environment, par). */
export function generateLevel(
  seed: string,
  number: number,
  gridSize: GridSize,
  environmentId: string,
  config: GenConfig = defaultConfig(gridSize),
): LevelDefinition {
  const board = generateBoard(seed, config);
  return {
    id: `lvl-${number}`,
    number,
    gridSize,
    difficulty: board.difficulty,
    environmentId,
    characters: board.characters,
    knownSolution: board.knownSolution,
    parMoves: board.characters.length,
  };
}
