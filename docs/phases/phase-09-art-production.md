# Phase 9 — Full Art Production

## Objective

Complete the production art set: 12 characters, 6 environments, 5 onboarding
illustrations, branding, the full icon system, effects, store-listing
compositions, and audio (or a complete, documented audio queue). Bring every
asset in the manifest to a final, optimized, visually consistent state under
Asset Mode B.

## Scope

- 12 finished characters and 6 finished environments (procedural/SVG).
- 5 finalized onboarding illustrations.
- Branding (logo lockups, app icon, adaptive icon), full icon/arrow set.
- Effects (confetti/star burst) and store-listing compositions.
- Audio assets or a complete audio queue with exact specs.
- Manifest reconciled: every entry final and optimized.

## Files expected to change

- `src/components/characters/` (12 character definitions/variants)
- `src/components/environments/` (6 environment compositions)
- `assets/onboarding/` (5 final illustrations)
- `assets/branding/` (logo, `icon.png`, `adaptive-icon.png`, `splash.png`)
- `src/components/icons/` (finalized), `src/components/effects/Confetti.tsx`
- `assets/store/` (screenshots/compositions for listing)
- `assets/audio/` (sfx/music) or `docs/AUDIO_QUEUE.md`
- `src/data/assetManifest.ts` (all statuses final)
- `docs/ASSET_GENERATION_QUEUE.md`, `docs/DECISIONS.md` (update)
- `scripts/optimize-assets.mjs` (run over final set)

## Dependencies

- Phase 2 (asset pipeline, manifest, optimizer), Phase 8 (screens that consume
  the final art).
- Packages: `react-native-svg`, optional `sharp` for optimization; audio via
  `expo-av` if audio ships.

## Implementation tasks

1. Produce all 12 characters honoring Art Bible proportions, outline, and
   upper-left lighting; readable at 80–140px.
2. Produce all 6 environments with quiet centers and lower contrast than tokens.
3. Finalize the 5 onboarding illustrations to match the character/environment
   style.
4. Finalize branding: logo lockups, app icon, adaptive icon, splash art.
5. Finalize the icon/arrow set and the confetti/effects components.
6. Build store-listing compositions (no fake device chrome misrepresentation).
7. Ship audio assets via `expo-av`, or record a complete `AUDIO_QUEUE.md` with
   exact durations/formats/loop points if audio is deferred.
8. Run the optimizer over the entire final asset set.
9. Reconcile the manifest so no entry is `missing`; document any intentional
   temporary asset.
10. Perform a visual-consistency audit across all assets (palette, outline,
    lighting, camera).

## Tests required

- Manifest completeness test: no `missing` entries; every referenced asset
  resolves.
- `assets:verify` exits 0 over the full final set.
- Character coverage test: all 12 character ids and 6 environment ids exist and
  are equippable/selectable where applicable.
- Effects render test: confetti component mounts and respects reduced motion.

## Visual checks required

- Consistency audit: shared palette, outline weight, lighting direction, and
  camera angle across all 12 characters and 6 environments.
- Onboarding illustrations match the game's art style.
- App icon and adaptive icon render correctly at required sizes.
- Store compositions read as premium and accurate.

## Acceptance criteria

- Asset manifest is complete.
- No unintended temporary art (or every exception is documented).
- All production art is optimized.
- Visual consistency audit passes.

## Exit conditions

- `assets:verify` and manifest tests green; optimizer run recorded.
- Consistency audit signed off in `docs/MANUAL_VISUAL_QA.md`.
- STATUS + generation/audio queues updated; commit recorded.

## Rollback notes

Art is additive and guarded by the placeholder fallback, so rollback never
breaks rendering — a reverted asset falls back to procedural/placeholder. Keep
the manifest and files in sync in the same commit so `assets:verify` stays
green. If Mode-A regeneration later replaces placeholders, log the swap in the
generation queue and DECISIONS rather than silently overwriting.
