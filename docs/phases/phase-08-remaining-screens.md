# Phase 8 — Remaining Screens

## Objective

Complete the app's navigable surface with premium, fully wired screens: home,
stats, customize (cosmetics), settings, about, and privacy — plus environment
progression display. No dead routes, no stub buttons; every control does
something real and persists where relevant.

## Scope

- Premium home screen (entry to play, daily, levels, customize, settings).
- Stats screen (aggregate statistics from storage).
- Customize screen (equip earned cosmetics: characters, outfits, environments,
  board themes, confetti).
- Settings (sound, reduced motion, replay onboarding, reset with confirm).
- About and Privacy screens.
- Environment progression surfaced from unlock state.

## Files expected to change

- `app/index.tsx` (home) or `app/(tabs)/` layout
- `app/stats.tsx`, `app/customize.tsx`, `app/settings.tsx`, `app/about.tsx`,
  `app/privacy.tsx`
- `src/storage/settingsStorage.ts`, `src/storage/cosmeticsStorage.ts`,
  `src/storage/statsStorage.ts`
- `src/hooks/useSettings.ts`, `src/hooks/useCosmetics.ts`, `src/hooks/useStats.ts`
- `src/data/cosmetics.ts`
- `src/components/home/`, `src/components/stats/`, `src/components/customize/`,
  `src/components/settings/`
- `src/tests/settingsStorage.test.ts`, `cosmeticsStorage.test.ts`,
  `stats.test.ts`

## Dependencies

- Phase 5 (gameplay), Phase 6 (progress/stars), Phase 7 (daily/streaks feed
  stats), Phase 2 (icons/art for cards).
- Packages: AsyncStorage wrapper; existing UI stack.

## Implementation tasks

1. Build the premium home screen with live entry points and progress teasers
   (streak, stars, current environment).
2. Implement `statsStorage` + `useStats`; render totals (levels cleared, stars,
   perfects, daily streaks, play time).
3. Implement `cosmeticsStorage` + `useCosmetics`; customize screen equips only
   earned items and persists the selection; equipped cosmetics reflect in game.
4. Implement `settingsStorage` + `useSettings`: sound, reduced motion, replay
   onboarding, and a destructive "reset progress" behind a confirmation.
5. Build About (version, credits, art-mode note) and Privacy (offline, no data
   collection) screens with native text.
6. Surface environment progression (unlocked vs. locked) using spec §7 gates.
7. Audit routing: every button navigates to a real route; no `+not-found`
   reachable from a primary control.

## Tests required

- `settingsStorage.test.ts`: each setting persists and reloads; reset clears
  progress only after confirmation and restores safe defaults.
- `cosmeticsStorage.test.ts`: equipping an unearned cosmetic is rejected; earned
  cosmetic equips and persists; equipped selection survives reload.
- `stats.test.ts`: aggregates derive correctly from progress/daily storage.
- Routing test: every home control resolves to a defined route (no dead links).

## Visual checks required

- Home screen reads as premium: correct palette, spacing, iconography.
- Customize shows locked vs. earned cosmetics; equip state is obvious.
- Settings toggles reflect stored values; reset shows a confirmation.
- Environment progression clearly distinguishes unlocked/locked.

## Acceptance criteria

- Every control works.
- No dead routes.
- Settings persist.
- Cosmetics equip correctly (and only when earned).

## Exit conditions

- All screen/storage tests green; typecheck/lint pass.
- Manual route audit finds no dead ends; every screen reachable and functional.
- STATUS updated; commit recorded.

## Rollback notes

Multiple new storage schemas (settings, cosmetics, stats) are introduced —
each must default safely on corruption or unknown version so a partial rollback
never bricks the home screen. Revert per-screen commits independently where
possible. Never let a reverted screen leave a home button pointing at a missing
route; guard navigation targets.
