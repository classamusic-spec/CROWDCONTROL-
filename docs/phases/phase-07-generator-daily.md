# Phase 7 — Generator, Solver & Daily

## Objective

Implement the deterministic puzzle pipeline: a seeded reverse-construction
generator, a DFS/backtracking solver with memoization, the daily challenge
(seeded by date), streak tracking, local share output, and a validation script
that runs the solver over ≥2000 boards. This produces and guarantees the levels
Phase 6 consumes.

## Scope

- Seeded RNG utility (deterministic, portable).
- Reverse-construction generator producing solvable boards of a given size.
- Solver that proves solvability and finds a solution order.
- Daily challenge: one puzzle per UTC date, deterministic numbering.
- Streak + per-date history storage; locally generated share text.
- `validate:levels` script over bundled + ≥2000 random boards.

## Files expected to change

- `src/utils/rng.ts` (seeded RNG)
- `src/utils/date.ts` (UTC date → seed, puzzle number since 2025-01-01)
- `src/engine/generator.ts` (`generateLevel(seed, size)`)
- `src/engine/solver.ts` (`solve(board)` with memoization/backtracking)
- `src/engine/daily.ts` (`getDailyPuzzle(dateString)`)
- `src/storage/dailyStorage.ts` (streaks, history, official result)
- `src/utils/shareText.ts` (spoiler-free share string)
- `app/daily.tsx`
- `scripts/validate-levels.ts`
- `src/tests/engine/generator.test.ts`, `solver.test.ts`, `daily.test.ts`,
  `rng.test.ts`, `shareText.test.ts`

## Dependencies

- Phase 4 (engine types + path/move rules).
- Packages: none beyond Phase 1; AsyncStorage wrapper for daily storage.

## Implementation tasks

1. Implement a seeded RNG (`rng.ts`) with reproducible sequences per seed.
2. Implement reverse construction: start from an empty board, place characters
   in a legal removal order so the puzzle is solvable by construction.
3. Implement `solve`: DFS/backtracking over legal moves with memoization on
   board state; return a solution order or `null`.
4. Guarantee generator output always passes the solver (assert in generation).
5. Implement `date.ts`: UTC-midnight date string and puzzle number =
   days-since-2025-01-01 + 1.
6. Implement `getDailyPuzzle(dateString)` seeding the generator by date.
7. Implement `dailyStorage`: first completion is official; track current and
   longest streak and per-date history; recover corrupt data to defaults.
8. Implement `shareText`: emoji/grid summary that never reveals the solution.
9. Build the daily route: play today's puzzle, show streak, share result.
10. Write `validate-levels.ts`: solve all 60 bundled levels + ≥2000 seeded
    random boards; non-zero exit on any unsolvable/regression.

## Tests required

- `rng.test.ts`: same seed → identical sequence; different seeds differ.
- `generator.test.ts`: generated boards are solvable and match the requested
  size; same seed → identical board.
- `solver.test.ts`: solves known-solvable boards, returns `null` for a crafted
  unsolvable board, and memoization does not change correctness.
- `daily.test.ts`: same date string → identical puzzle and puzzle number;
  numbering matches the 2025-01-01 epoch.
- `dailyStorage.test.ts`: first result is official and immutable; streak
  increments on consecutive dates and resets on a gap.
- `shareText.test.ts`: output contains no coordinates/solution data.

## Visual checks required

- Daily screen shows today's puzzle, puzzle number, and streak.
- Share sheet content is spoiler-free and readable.
- (Logic-heavy phase; most verification is via tests, not visuals.)

## Acceptance criteria

- Same date produces the same puzzle.
- 2000-board validation passes (`validate:levels`).
- Daily result persists (first completion is official).

## Exit conditions

- All generator/solver/daily/rng/share tests green.
- `npm run validate:levels` passes over bundled + ≥2000 boards.
- STATUS updated; commit recorded.

## Rollback notes

Generator/solver are pure; daily storage adds a schema. Rollback of pure logic
is safe but the 60 bundled levels depend on fixed seeds — do not change RNG or
generation logic without regenerating and re-validating levels in the same
commit. Daily storage must tolerate unknown schema by falling back to defaults,
so a partial rollback never corrupts streak history.
