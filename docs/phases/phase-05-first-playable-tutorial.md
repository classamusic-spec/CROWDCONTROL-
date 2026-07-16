# Phase 5 — First Playable & Tutorial

## Objective

Turn the pure engine into a playable board: a responsive grid, character
rendering with direction arrows, tap interaction, animations, timer, mistake
counter, hint, and a staged 4×4 tutorial. Produce the first genuinely playable
experience and one production-style level.

## Scope

- Responsive game board that scales to grid size and screen.
- Character tokens with direction arrow badges.
- Tap-to-move interaction wired to the engine (single source of truth).
- Exit/shake animations, timer, mistakes, and a hint affordance.
- Staged, guided 4×4 tutorial that teaches the rules step by step.

## Files expected to change

- `app/game.tsx` (gameplay route, thin)
- `app/tutorial.tsx`
- `src/components/board/GameBoard.tsx`
- `src/components/board/CharacterToken.tsx`
- `src/components/board/DirectionArrow.tsx`
- `src/components/game/GameHud.tsx` (timer, mistakes, hint)
- `src/hooks/useGame.ts` (drives engine state, timer, mistakes)
- `src/hooks/useHint.ts`
- `src/data/tutorialSteps.ts`
- `src/components/tutorial/TutorialOverlay.tsx`
- `src/tests/game/useGame.test.ts`, `src/tests/game/board.test.tsx`

## Dependencies

- Phase 4 (engine), Phase 2 (arrows, icons, procedural characters), Phase 1
  (theme/router).
- Packages: `react-native-reanimated`, `react-native-gesture-handler`.

## Implementation tasks

1. Build `GameBoard` computing tile size from `N` and available space; center
   within the quiet environment frame.
2. Render `CharacterToken` with the procedural character + `DirectionArrow`
   badge (color + orientation per direction).
3. Implement `useGame`: hold `LevelState`, timer, mistakes; call `applyMove` on
   tap and never mutate state directly.
4. Legal tap → exit animation toward the facing edge, then engine clears it;
   illegal tap → shake + increment mistakes (no board change).
5. Ensure exactly one removal per legal tap (no double-removal): drive removal
   from engine result, guard against duplicate gesture events.
6. Add timer start/stop tied to first move and completion.
7. Implement `useHint` surfacing one currently-legal move.
8. Author `tutorialSteps.ts` and `TutorialOverlay` for a staged 4×4 lesson:
   highlight, restrict taps, advance on correct action.
9. Honor reduced motion: skip/shorten animations, keep state transitions.

## Tests required

- `useGame`: legal tap clears exactly one character and advances timer state;
  illegal tap increments mistakes and leaves the board unchanged.
- Double-removal guard: two rapid taps on the same token yield a single clear.
- Board layout: renders `N×N` tokens for a given level; tokens carry correct
  accessibility labels including direction.
- Tutorial: each staged step only accepts the intended tap and advances;
  completing the final step routes out and can grant the tutorial reward.
- Reduced motion: interaction still resolves moves with animations disabled.

## Visual checks required

- Board is centered and fully visible on small and large device frames.
- Arrows legible on tokens; direction distinguishable by shape.
- Exit animation moves toward the facing edge; shake reads as "blocked".
- Tutorial highlights the correct token at each step; HUD shows timer/mistakes.

## Acceptance criteria

- Tutorial is fully playable end to end.
- One production-style level is playable.
- No double-removal bug.
- Reduced motion works.

## Exit conditions

- Game + tutorial tests green; typecheck/lint pass.
- A real level and the tutorial can each be cleared by hand in the app.
- STATUS updated; commit recorded.

## Rollback notes

Gameplay UI sits on top of the pure engine; rolling it back leaves the engine
and its tests intact. Revert the gameplay commit; no persisted progress schema
is introduced here (that arrives in Phase 6), so rollback has no storage
migration cost. Keep `useGame` as the only writer of game state to make future
reverts localized.
