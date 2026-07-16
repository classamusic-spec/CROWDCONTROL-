/**
 * Level validation command (npm run validate:levels).
 *
 *   1. Verifies every bundled level is solvable and that its stored
 *      knownSolution is a valid clear order.
 *   2. Generates >= 2000 random boards (mixed sizes) and runs each through the
 *      solver, asserting solvability and re-verifying the solution.
 *   3. Checks structural invariants: in-bounds, unique ids, valid directions,
 *      no duplicate cells.
 *
 * Exits non-zero on the first failure. Does not silence errors.
 */
import { bundledLevels } from '../src/data/bundledLevels';
import { computeMetrics } from '../src/engine/difficulty';
import { defaultConfig, generateBoard } from '../src/engine/levelGenerator';
import { solveBoard, verifySolution } from '../src/engine/levelSolver';
import type { CrowdCharacter, GridSize } from '../src/types/game';

const DIRECTIONS = new Set(['up', 'down', 'left', 'right']);

let failures = 0;
const fail = (msg: string) => {
  failures++;
  console.error(`  ✗ ${msg}`);
};

function checkStructure(
  characters: CrowdCharacter[],
  gridSize: GridSize,
  label: string,
): void {
  const ids = new Set<string>();
  const cells = new Set<number>();
  for (const c of characters) {
    if (c.row < 0 || c.row >= gridSize || c.column < 0 || c.column >= gridSize) {
      fail(`${label}: character ${c.id} out of bounds (${c.row},${c.column})`);
    }
    if (!DIRECTIONS.has(c.direction)) {
      fail(`${label}: character ${c.id} has invalid direction ${c.direction}`);
    }
    if (ids.has(c.id)) fail(`${label}: duplicate id ${c.id}`);
    ids.add(c.id);
    const cellKey = c.row * gridSize + c.column;
    if (cells.has(cellKey)) fail(`${label}: two characters share a cell`);
    cells.add(cellKey);
  }
}

console.log('Validating bundled levels…');
if (bundledLevels.length !== 60) {
  fail(`expected 60 bundled levels, found ${bundledLevels.length}`);
}
for (const level of bundledLevels) {
  const label = `bundled #${level.number}`;
  checkStructure(level.characters, level.gridSize, label);
  const solved = solveBoard(level.characters, level.gridSize);
  if (!solved.solvable) fail(`${label}: solver reports UNSOLVABLE`);
  if (!verifySolution(level.characters, level.gridSize, level.knownSolution)) {
    fail(`${label}: stored knownSolution is invalid`);
  }
  if (level.parMoves !== level.characters.length) {
    fail(`${label}: parMoves ${level.parMoves} != count ${level.characters.length}`);
  }
}
console.log(`  ✓ ${bundledLevels.length} bundled levels checked`);

const TARGET = 2000;
console.log(`Generating & solving ${TARGET} random boards…`);
const sizes: GridSize[] = [4, 5, 6];
let solvedCount = 0;
for (let i = 0; i < TARGET; i++) {
  const gridSize = sizes[i % sizes.length] as GridSize;
  const board = generateBoard(`validate:${gridSize}:${i}`, defaultConfig(gridSize));
  checkStructure(board.characters, gridSize, `random ${i}`);
  const solved = solveBoard(board.characters, gridSize);
  if (!solved.solvable) {
    fail(`random ${i} (${gridSize}x${gridSize}): UNSOLVABLE`);
    continue;
  }
  if (!verifySolution(board.characters, gridSize, board.knownSolution)) {
    fail(`random ${i}: knownSolution invalid`);
  }
  // Sanity: metrics computable and non-degenerate.
  const m = computeMetrics(board.characters, gridSize);
  if (m.characterCount === 0) fail(`random ${i}: empty board`);
  solvedCount++;
  if ((i + 1) % 500 === 0) console.log(`  …${i + 1}/${TARGET}`);
}
console.log(`  ✓ ${solvedCount}/${TARGET} random boards solvable & verified`);

if (failures > 0) {
  console.error(`\nVALIDATION FAILED: ${failures} problem(s).`);
  process.exit(1);
}
console.log('\nAll level validation passed.');
