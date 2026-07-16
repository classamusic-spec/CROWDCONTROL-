# Phase 2 — Asset Pipeline

## Objective

Build the asset infrastructure: capability-driven generation, a typed asset
manifest with per-asset status, an SVG icon/arrow library, a contact-sheet
generator, an optimizer, and initial branding/character/environment art. Under
Asset Mode B (no `OPENAI_API_KEY`), procedural/vector art is the active source
of truth, with every raster placeholder logged for later regeneration.

## Scope

- Runtime asset resolution with a guaranteed placeholder fallback.
- SVG icon set and four direction arrows as React components.
- Manifest listing every required asset with a status enum.
- Build-time scripts: generate (Mode A stub), contact sheet, optimize, verify.
- Initial branding, initial characters, initial environment as procedural art.

## Files expected to change

- `src/data/assetManifest.ts`
- `src/utils/assetCapabilities.ts`
- `src/components/icons/` (SVG icon components + `index.ts`)
- `src/components/icons/arrows/` (Up/Down/Left/Right arrow components)
- `src/components/branding/Logo.tsx`
- `src/components/characters/ProceduralCharacter.tsx`
- `src/components/environments/ProceduralEnvironment.tsx`
- `scripts/generate-assets.mjs` (Mode A; reads `OPENAI_API_KEY` from env only)
- `scripts/make-contact-sheet.mjs`
- `scripts/optimize-assets.mjs`
- `scripts/verify-assets.mjs`
- `assets/branding/`, `assets/generated/.gitkeep`
- `docs/ASSET_GENERATION_QUEUE.md` (updated), `docs/ASSET_CAPABILITIES.md`

## Dependencies

- Phase 1 (Expo app, theme tokens).
- Packages: `react-native-svg`; dev: `sharp` (optional, for optimizer).

## Implementation tasks

1. Implement `assetCapabilities.ts` re-detecting image tooling / key presence.
2. Define `assetManifest.ts`: id, kind, path, status
   (`generated | procedural | placeholder | missing`), and Mode-A prompt.
3. Author SVG icons (settings gear, stats, star, hint, undo, restart, close,
   share, sound, back) and four arrows with distinct orientation + palette
   color per direction.
4. Build `ProceduralCharacter` and `ProceduralEnvironment` composites honoring
   Art Bible proportions, outline, upper-left lighting, quiet center.
5. Write the `Logo` branding component.
6. Implement `generate-assets.mjs`: Mode A when key present; clear no-op error
   when absent (never crashes the build, never commits a key).
7. Implement `make-contact-sheet.mjs`, `optimize-assets.mjs`, and
   `verify-assets.mjs` (manifest vs. files on disk).
8. Wire `assets:verify` npm script; add `assets:optimize`, `assets:sheet`.
9. Ensure every runtime asset lookup falls back to a visible placeholder.

## Tests required

- Manifest test: every entry has a valid status; no `missing` entries at
  runtime resolve to `undefined`.
- Asset resolver test: unknown id returns the placeholder, never throws.
- Arrow test: each of the four arrows renders and exposes an accessibility
  label distinct from color.
- `assets:verify` script exits 0 (manifest matches disk).

## Visual checks required

- Contact sheet renders all icons/arrows/characters at target sizes legibly.
- Arrows distinguishable by shape at 24px, not color alone.
- Procedural character readable at 80–140px; environment center stays quiet.

## Acceptance criteria

- Every required asset has a status in the manifest.
- Runtime assets load without missing imports.
- Temporary/placeholder assets are documented in the generation queue.
- No API keys are committed anywhere in the repo.

## Exit conditions

- `assets:verify` passes; contact sheet generated; optimizer runs.
- Icons/arrows/logo/procedural art usable by later UI phases.
- STATUS + generation queue updated; commit recorded.

## Rollback notes

Assets are additive; the manifest is the single source of truth. Rollback =
revert the asset commit; the placeholder fallback keeps the app renderable even
with a partially reverted asset set. Never rollback by deleting the placeholder
itself, as that removes the safety net. No storage/schema impact.
