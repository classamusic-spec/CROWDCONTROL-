# Release Review — Phases 9 & 10

## Art / visual consistency audit (Phase 9)

All runtime art shares one system, so the game reads as cohesive despite being
Asset Mode B (procedural/SVG):

- **Single source of truth:** every color comes from `src/data/theme.ts`
  `palette`; no ad-hoc hex in components (enforced by review + lint of `src/`).
- **Characters:** all 12 identities render through one `CrowdSprite` (shared
  proportions, outline, shading, upper-left light) — guaranteeing consistent
  proportions/outlines per the ART_BIBLE.
- **Directions:** one `DirectionArrow` mark, color + orientation, used on the
  board, splash, emblem, and onboarding — uniform arrow treatment.
- **Environments:** one `EnvironmentBackdrop` with a quiet center and edge
  decoration per theme; six environments differ only by palette + decoration
  kind, so framing is consistent and the board stays readable.
- **Icons:** 30 icons in one `Icon` component, single stroke/fill style.
- **Manifest:** 114 assets tracked; `assets:verify` passes; every placeholder
  has a documented raster/ audio upgrade prompt. No *undocumented* temporary
  art remains.

## Accessibility review (Phase 10)

- Roles + labels on every touchable (`Button`, `IconButton`, `BottomNav` tabs,
  board tokens, toggles use `switch`).
- Direction is conveyed by **arrow orientation AND color** — never color alone.
- Touch targets ≥ 44pt (`theme.layout.minTouchTarget`; buttons/rows sized to it).
- Reduced motion: `useReducedMotionPref()` (OS setting OR in-app toggle) gates
  splash, exit/shake/confetti/hint animations; state always changes instantly,
  so **no information is motion-only**.
- Safe areas via `SafeAreaProvider` + `ScreenBackground` edges.
- High-contrast light text on navy; results/stat values use bold weights.

## Performance review (Phase 10)

- No physics engine; board is pure integer math.
- Animations use Reanimated shared values (UI thread), short durations
  (`theme.motion`), and are interrupt-safe (re-tapping mid-exit is ignored by
  the engine's `leaving`/`cleared` guard — no input deadlock).
- Solver bounded by `maxStates` so hints/validation can never hang.
- Production bundle builds: `expo export` → 1358 modules, 3.89 MB iOS bundle.

## Gates (all green)

```
tsc --noEmit           ✓
eslint .               ✓
jest                   ✓  84 tests
validate:levels        ✓  60 bundled + 2000 random boards solvable
assets:verify          ✓  114 assets
expo export (ios)      ✓  bundles clean
```

## Pending (environmental, non-blocking)

Physical-device visual capture (`docs/MANUAL_VISUAL_QA.md`), raster art upgrade
(`docs/ASSET_GENERATION_QUEUE.md`), audio SFX (`docs/AUDIO_GENERATION_QUEUE.md`),
and store-account credentials (`docs/DEFINITION_OF_DONE.md`).
