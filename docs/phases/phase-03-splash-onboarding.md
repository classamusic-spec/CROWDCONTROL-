# Phase 3 — Splash & Onboarding

## Objective

Deliver the first-run experience: a native splash that hands off to an animated
splash with no white flash, followed by a five-page onboarding flow with
persistence, reduced-motion support, and onboarding illustrations. Route
correctly for first-run vs. returning users.

## Scope

- Native splash configuration + animated splash component with smooth handoff.
- Five onboarding pages (concept, rules, directions, daily, cosmetics).
- Persisted onboarding-completion flag and first-run routing gate.
- Reduced-motion path that skips/dampens animations.
- Replayable onboarding entry point (from Settings/About).

## Files expected to change

- `app/_layout.tsx` (splash/onboarding routing gate)
- `app/splash.tsx` (or root boot handling)
- `app/onboarding/_layout.tsx`, `app/onboarding/index.tsx`
- `src/components/splash/AnimatedSplash.tsx`
- `src/components/onboarding/OnboardingPager.tsx`
- `src/components/onboarding/OnboardingPage.tsx`
- `src/storage/onboardingStorage.ts`
- `src/hooks/useReducedMotion.ts`
- `src/hooks/useFirstRun.ts`
- `assets/onboarding/` (five illustrations, procedural/SVG)
- `src/tests/onboarding.test.tsx`, `src/tests/splashRouting.test.tsx`

## Dependencies

- Phase 1 (router, theme), Phase 2 (assets, icons, illustrations).
- Packages: `react-native-reanimated`, `expo-splash-screen`, AsyncStorage
  wrapper, `react-native-gesture-handler`.

## Implementation tasks

1. Configure native splash background to match the animated splash's first
   frame so there is no white flash at handoff.
2. Keep the native splash visible until fonts/assets are ready, then cross-fade
   into `AnimatedSplash`.
3. Build `AnimatedSplash` (logo reveal + brand motion) using Reanimated.
4. Implement `onboardingStorage` (get/set completion, versioned).
5. Build the five-page pager with swipe + next/skip controls and page dots.
6. Author five onboarding pages with illustrations and native text only.
7. Add `useFirstRun` gate: first run → onboarding; returning → home.
8. Implement `useReducedMotion` and honor OS setting across splash + pager.
9. Add a "replay onboarding" entry so it can be re-entered later.

## Tests required

- First-run routing: no completion flag → onboarding renders.
- Returning-user routing: completion flag set → onboarding skipped, home shown.
- Persistence: completing onboarding writes the flag; reload keeps it skipped.
- Reduced motion: animations replaced by immediate transitions when enabled.
- Pager: reaching page 5 + "Get started" sets completion and navigates.

## Visual checks required

- No white flash between native and animated splash on cold start.
- Each onboarding page: illustration + native copy, correct safe areas.
- Page indicator reflects current page; swipe and buttons agree.
- Reduced-motion run shows content instantly with no jank.

## Acceptance criteria

- No white flash.
- First-run routing works.
- Returning-user routing works.
- Onboarding completion persists.
- Onboarding is replayable.

## Exit conditions

- Splash + onboarding tests green; typecheck/lint pass.
- Cold-start path verified to land on the correct screen for both user states.
- STATUS updated; commit recorded.

## Rollback notes

Onboarding writes a single versioned flag; rolling back the feature must not
strip the flag reader elsewhere. Revert the feature commit; the routing gate
should default to "show home" if the flag store is unavailable, so a partial
rollback never traps users on a missing onboarding route. No destructive
storage migration.
