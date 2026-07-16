# Phase 6 — Levels & Progression

## Objective

Ship the full single-player campaign: 60 solver-validated bundled levels, a
level-selection screen, star scoring, progressive unlocking, persistent
progress storage, and a results screen. Every level must be provably solvable.

## Scope

- 60 bundled levels (1–20 4×4 easy, 21–40 5×5 medium, 41–60 6×6 hard).
- Level select with lock state, best stars, and environment grouping.
- Star computation (mistakes primary, time vs. par secondary).
- Unlock gates by level reached; environment unlocks per spec §7.
- Progress + best-result persistence with migrations and safe defaults.
- Results screen after completion.

## Files expected to change

- `src/data/bundledLevels.ts` (60 committed, seed-generated levels)
- `src/data/environments.ts` (unlock thresholds)
- `src/engine/scoring.ts` (`calculateStars`, `parTimeFor`)
- `src/storage/progressStorage.ts` (progress, best results, earned stars)
- `src/hooks/useProgress.ts`
- `app/levels.tsx` (level select)
- `app/results.tsx`
- `src/components/levels/LevelCard.tsx`, `src/components/levels/StarRow.tsx`
- `src/components/results/ResultsSummary.tsx`
- `src/tests/scoring.test.ts`, `src/tests/progressStorage.test.ts`,
  `src/tests/bundledLevels.test.ts`

## Dependencies

- Phase 7 (generator/solver produce and validate the 60 levels).
- Phase 5 (playable board + results hand-off).
- Packages: AsyncStorage wrapper (from storage layer).

## Implementation tasks

1. Generate the 60 levels from fixed seeds (Phase 7 generator) and commit them
   as static data in `bundledLevels.ts`.
2. Implement `calculateStars` (3 = 0 mistakes & time ≤ par; 2 = ≤ 2 mistakes;
   1 = completed) and `parTimeFor(N, count)`.
3. Implement `progressStorage`: per-level best stars/time/mistakes, earned star
   total, highest level reached; schema version + migration + safe defaults on
   corruption.
4. Build `useProgress` exposing progress and unlock computations.
5. Build the level-select screen with lock/unlock, best stars, and environment
   sections.
6. Wire completion → results screen showing stars, time, mistakes, and
   next/replay actions; persist the best result.
7. Compute environment unlocks by highest level reached (spec §7 thresholds).
8. Ensure a locked level cannot be entered and unlocking is monotonic.

## Tests required

- `bundledLevels.test.ts`: all 60 levels load, have correct grid size per band,
  and pass the solver (solver-validated).
- `scoring.test.ts`: star boundaries (0 mistakes/under par → 3; 2 mistakes → 2;
  slow but clean → 2 or 3 per rule; completed → ≥1).
- `progressStorage.test.ts`: best result only improves (never regresses);
  corrupt payload recovers to defaults; migration bumps schema version.
- Unlock test: reaching level N unlocks the correct environments and next
  levels; locked levels stay locked.

## Visual checks required

- Level select shows lock icons, star rows, and environment grouping correctly.
- Results screen shows accurate stars/time/mistakes and working actions.
- Best-star badges reflect stored progress after reload.

## Acceptance criteria

- All 60 levels load.
- Progress persists across app restarts.
- Unlocking works (levels + environments).
- Every level is solver-validated.

## Exit conditions

- Level/scoring/storage tests green; `validate:levels` passes for all 60.
- Full loop (select → play → results → progress saved) works in-app.
- STATUS updated; commit recorded.

## Rollback notes

This phase introduces the progress schema, so rollback must preserve forward
data: never ship a migration that drops user progress on downgrade. Revert the
feature commit; `progressStorage` must tolerate an unknown/newer schema by
falling back to safe defaults rather than crashing. Bundled levels are static
data — reverting them is safe but re-run `validate:levels` afterward.
