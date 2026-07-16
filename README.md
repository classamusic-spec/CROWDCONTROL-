# Crowd Control Daily

## Overview

Crowd Control Daily is a premium, single-player, **offline** puzzle game for iOS
and Android, built with Expo React Native + TypeScript.

Players clear a square grid of chibi crowd characters. Every character faces one
of four directions (up, down, left, right) and can only leave the board when the
straight line of tiles between it and the corresponding edge is empty. Tap a
character with a clear path and it exits; tap a blocked one and it shakes and
counts as a mistake. Clear the whole crowd to finish the level, which is scored
1–3 stars based on mistakes and time versus par.

The game ships with 60 handcrafted, solver-validated levels across three grid
sizes, a deterministic daily challenge with streak tracking, six unlockable
environments, and earned cosmetics. There are **no ads, no in-app purchases, no
accounts, and no required network connectivity**.

## Technology

- **Expo SDK 52**, **React Native 0.76**
- **TypeScript** (strict)
- **expo-router** — file-based routing (thin route screens in `app/`)
- **react-native-reanimated** — animation
- **react-native-gesture-handler** — gestures
- **react-native-svg** — vector art, icons, arrows, procedural characters/environments
- **@react-native-async-storage/async-storage** — local persistence
- **expo-haptics**, **expo-audio**, **expo-sharing**, **expo-image**,
  **expo-linear-gradient**, **expo-splash-screen** — platform features
- **Jest** + **React Native Testing Library** (`@testing-library/react-native`,
  `jest-expo`) — testing

## Setup

```bash
npm install
```

## Running locally

```bash
npx expo start        # start the Expo dev server
npx expo start --ios      # or: npm run ios
npx expo start --android  # or: npm run android
npx expo start --web      # or: npm run web
```

Open the project in Expo Go or a development build on a device/simulator, or
press the platform key in the dev server.

## Testing

```bash
npm test            # jest
npm run typecheck   # tsc --noEmit (strict)
npm run lint        # eslint .
```

## Level validation

```bash
npm run validate:levels
```

This runs the **60 bundled levels** plus **2000+ randomly generated boards**
(mixed grid sizes) through the pure solver, verifying every board is solvable
and that stored metadata (par moves, etc.) is consistent.

## Asset generation

The build ships in **Mode B (procedural / vector)**: all icons, arrows, badges,
effects, logo, and character/environment art are original SVG + procedural
native composites rendered with `react-native-svg`. No raster art or image
tooling is required to run the game.

```bash
node scripts/generate-manifest.mjs   # regenerate assets/asset-manifest.json
npm run assets:verify                # verify the manifest against files on disk
```

Mode A (raster generation via an external image API) is provided but inactive:
`npm run assets:generate` reads `OPENAI_API_KEY` **only from the environment**
and is a clear no-op when the key is absent. No keys are committed.

## Asset replacement

To swap a procedural placeholder for a real raster:

1. Drop the raster file at the `runtimePath` recorded for that asset in
   `assets/asset-manifest.json`.
2. Flip that asset's `status` to `ready` in the manifest and point the runtime
   component at the raster via its `runtimePath`.
3. Re-run `npm run assets:verify`.

See `docs/ASSET_GENERATION_QUEUE.md` for the per-asset queue, expected
filenames/sizes, and regeneration prompts.

## Audio replacement

Audio currently ships as silent placeholder entries. To enable a real sound:

1. Drop the file at `assets/audio/sfx_<id>.m4a`.
2. Update the matching entry in the registry at `src/data/audio.ts` to
   `require('../../assets/audio/sfx_<id>.m4a')`.

See `docs/AUDIO_GENERATION_QUEUE.md` for the full list of queued sounds.

## Adding characters

Add the character to `src/data/characters.ts`, then register its art in the
asset manifest (`node scripts/generate-manifest.mjs`).

## Adding environments

Add the environment to `src/data/environments.ts`, including its `unlockLevel`
(the level number at which it unlocks), then register its art in the manifest.

## Adding levels

Edit the count/config in `scripts/generate-levels.ts`, then run:

```bash
npx tsx scripts/generate-levels.ts
```

This writes `src/data/bundledLevels.ts` and is solver-checked during generation.
Follow up with `npm run validate:levels`.

## EAS builds

```bash
eas build --profile development   # internal dev client build
eas build --profile preview       # internal preview (Android APK)
eas build --profile production     # production (auto-increment version)
```

Profiles and channels are defined in `eas.json`.

## Architecture

- `app/` — Expo Router routes, kept thin (presentation only).
- `src/engine/` — pure game logic (path checking, moves, generator, solver); no
  React/UI imports.
- `src/data/` — static data (levels, characters, environments, cosmetics) and
  design tokens in `src/data/theme.ts`.
- `src/hooks/` — React hooks (game, progress, settings, audio…).
- `src/storage/` — typed AsyncStorage wrappers + migrations.
- `src/components/`, `src/types/`, `src/utils/`, `src/tests/` — UI, shared types,
  pure helpers, and Jest tests.

The engine is deterministic integer-grid logic; there is no physics engine.

## Storage

All persistence is local, behind typed modules in `src/storage/` wrapping
AsyncStorage. Data carries a **schema version** and supports **migrations**;
**corrupt data recovers to safe defaults**. Keys are namespaced under `ccd.*`.
Stored data includes onboarding/tutorial completion, settings, level progress,
best results, earned stars, cosmetics, selected environment, daily history,
streaks, and statistics.

## Known limitations

- **Art is procedural/SVG placeholder.** All raster character and environment
  art is currently original, production-quality procedural/SVG placeholder,
  queued for a raster upgrade (see `docs/ASSET_GENERATION_QUEUE.md`).
- **Audio is placeholder.** Sound effects are silent placeholder entries queued
  for production audio (see `docs/AUDIO_GENERATION_QUEUE.md`).
- **No device screenshots** were captured in the headless build environment. The
  list of screenshots to capture on-device is in `docs/MANUAL_VISUAL_QA.md`.
