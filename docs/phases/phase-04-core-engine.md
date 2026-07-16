# Phase 4 — Core Engine

## Objective

Implement the authoritative, pure game rules as UI-agnostic TypeScript: types,
path checking, move application, undo, restart, completion detection, and full
unit tests. This engine is the shared foundation for gameplay, tutorial,
generator, solver, and daily.

## Scope

- Shared engine/board/character types.
- Deterministic integer-grid path logic (no physics, no randomness here).
- Immutable move/undo/restart operations.
- Completion + remaining-count queries.
- Comprehensive unit tests covering rules and edge cases.

## Files expected to change

- `src/types/game.ts` (Direction, Character, Board, Move, LevelState)
- `src/engine/path.ts` (`isPathClear`, `getPathCells`, `getBlockingCharacters`)
- `src/engine/moves.ts` (`applyMove`, `undoMove`, `restartLevel`)
- `src/engine/status.ts` (`isLevelComplete`, `calculateRemainingCharacters`)
- `src/engine/index.ts` (public surface)
- `src/tests/engine/path.test.ts`
- `src/tests/engine/moves.test.ts`
- `src/tests/engine/status.test.ts`

## Dependencies

- Phase 1 (TypeScript/Jest toolchain). No UI packages.
- Must import nothing from React / React Native / Expo (enforced by lint rule).

## Implementation tasks

1. Define `Direction` union and `Character` (`id`, `row`, `col`, `direction`,
   `status`) and `Board`/`LevelState` types with an explicit grid size `N`.
2. `getPathCells(board, character)`: return the ordered edge-ward cells per the
   spec (up/down/left/right), exclusive of the character's own cell.
3. `getBlockingCharacters(board, character)`: uncleared characters on the path
   cells.
4. `isPathClear(board, character)`: true iff no blocking characters.
5. `applyMove(state, characterId)`: legal iff uncleared and path clear; return
   new immutable state with the character `cleared` and the move pushed to a
   history stack. Illegal taps return unchanged state + a mistake signal.
6. `undoMove(state)`: pop history, restore the last cleared character.
7. `restartLevel(state)`: reset all characters to uncleared, clear history,
   preserve the original layout.
8. `isLevelComplete(state)`: every character `cleared`.
9. `calculateRemainingCharacters(state)`: count of uncleared characters.
10. Guarantee immutability (no in-place mutation of input arrays/objects).

## Tests required

- `getPathCells`: correct cells for each direction, including edge-adjacent and
  full-row/column cases; empty when character is already at the edge.
- `isPathClear` / `getBlockingCharacters`: clear vs. blocked with one and
  multiple blockers; cleared characters do not block.
- `applyMove`: legal move clears the character and appends history; illegal move
  returns identical state (deep-equal) and flags a mistake; double-tap of an
  already-cleared character is a no-op (guards the double-removal bug).
- `undoMove`: inverse of `applyMove`; undo on empty history is a no-op.
- `restartLevel`: returns to the initial layout; history emptied.
- `isLevelComplete` / `calculateRemainingCharacters`: correct across partial and
  full clears.
- Immutability: original input objects are unchanged after each operation.

## Visual checks required

N/A — non-UI phase. The engine has no rendered surface; correctness is proven
entirely by unit tests.

## Acceptance criteria

- Engine tests pass.
- No UI dependency in the engine (lint boundary enforced).
- Board state is immutable where intended (inputs never mutated).

## Exit conditions

- All engine test suites green; `npm run typecheck` and `lint` pass.
- Public API in `src/engine/index.ts` stable enough for Phase 5 and 7 to build
  on without changes.
- STATUS updated; commit recorded.

## Rollback notes

Pure functions with no side effects, storage, or UI — the safest phase to roll
back. Revert the engine commit and dependent phases (5, 7) simply fail to
import, surfacing breakage immediately. Keep the public API in `index.ts`
stable; if a signature must change, update all callers in the same commit.
