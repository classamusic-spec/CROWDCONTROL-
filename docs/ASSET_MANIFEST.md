# Asset Manifest — Crowd Control Daily

The authoritative machine-readable inventory is
[`assets/asset-manifest.json`](../assets/asset-manifest.json), generated
reproducibly by `scripts/generate-manifest.mjs` and validated by
`scripts/verify-assets.ts` (`npm run assets:verify`).

## Summary (114 assets)

| Category    | Count | Format | Status |
| ----------- | ----- | ------ | ------ |
| Branding    | 7     | SVG    | ready (native SVG) |
| Characters  | 24    | PNG    | placeholder (procedural SVG sprite) |
| Environments| 30    | WebP   | placeholder (procedural gradient) |
| Onboarding  | 5     | SVG    | ready (native SVG) |
| Icons       | 30    | SVG    | ready (native SVG) |
| Effects     | 8     | SVG    | ready (native SVG) |
| Audio       | 10    | m4a    | placeholder (programmatic tones) |

- **ready (50):** rendered natively as React SVG components / procedural
  composites — no external file required and no visual gaps.
- **placeholder (64):** currently procedural; queued for raster upgrade in
  `docs/ASSET_GENERATION_QUEUE.md` (art) and `docs/AUDIO_GENERATION_QUEUE.md`
  (audio). The app is fully functional with the placeholders.

## Manifest fields

Each entry in the JSON has: `id`, `filename`, `category`, `use`, `dimensions`,
`format`, `transparency`, `method`, `status`, `version`, `runtimePath`,
`replacement`.

## Asset Mode

**Mode B** (procedural/vector). No image-generation tooling or `OPENAI_API_KEY`
is available; see `docs/ASSET_CAPABILITIES.md`. `scripts/generate-assets.mjs`
implements Mode A for when a key is present.

## Naming conventions

- Characters: `char_<variant>_<pose>.<ext>`
- Environments: `env_<env>_<use>.<ext>`
- Onboarding: `onboard_<id>.svg`
- Icons: `icon_<name>.svg`  ·  Effects: `fx_<name>.svg`  ·  Audio: `sfx_<name>.m4a`
- Branding: `<id>.svg`

## Regenerating

```bash
node scripts/generate-manifest.mjs   # rebuild the JSON inventory
npm run assets:verify                # check manifest vs filesystem/runtime
npm run assets:generate              # Mode A raster generation (needs key)
```
