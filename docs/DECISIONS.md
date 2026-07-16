# Decisions Log — Crowd Control Daily

Architectural and product decisions, newest first.

## D-006 — Direction color/shape mapping
Directions map to fixed colors (up=blue, down=purple, left=orange, right=green)
AND to arrow orientation, so direction is never conveyed by color alone
(accessibility). See `docs/ART_BIBLE.md`.

## D-005 — Daily puzzle numbering
Puzzle number = (days between `2025-01-01` UTC and the target UTC date) + 1.
Deterministic, offline, timezone-safe (uses UTC midnight).

## D-004 — Levels are generated deterministically and snapshotted
The 60 bundled levels are produced by the seeded reverse-construction generator
with fixed seeds and committed as static data in `src/data/bundledLevels.ts`.
`scripts/validate-levels.ts` re-validates them plus ≥2000 random boards through
the solver so regressions are caught in CI.

## D-003 — Engine is pure & UI-agnostic
`src/engine/` imports nothing from React/React Native/Expo. State is passed in
and new state returned (immutable updates). This makes the rules unit-testable
headlessly and reusable by the generator, solver, tutorial, and daily.

## D-002 — No design references supplied → Art Bible is authoritative
The directive references `design-references/` but no images were attached. We
proceed using the written visual standards + palette as the art bible. If
references are supplied later, reconcile and log a follow-up decision.

## D-001 — Asset Mode B (procedural/vector)
No image-generation tooling or `OPENAI_API_KEY` is available (see
`docs/ASSET_CAPABILITIES.md`). We ship original SVG + procedural native art as
production-quality placeholders, and document exact regeneration prompts in
`docs/ASSET_GENERATION_QUEUE.md`. `scripts/generate-assets.mjs` implements
Mode A for when a key is present.

## D-000 — Stack
Expo (managed) + expo-router + Reanimated + Gesture Handler + react-native-svg
+ AsyncStorage + TypeScript strict + Jest + RNTL, per directive §3.
