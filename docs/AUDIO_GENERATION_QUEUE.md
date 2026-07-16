# Audio Generation Queue — Crowd Control Daily

No audio-generation tool is available in this environment. The app ships with
**short programmatic placeholder tones** (safe, original, royalty-free) so audio
settings and haptics are fully wired and testable. This queue specifies the
final SFX to source or synthesize later. Do **not** download unverified
copyrighted audio.

Format: 44.1 kHz, mono, `.m4a` (AAC) or `.wav`, ≤ 400 ms unless noted,
normalized to about −14 LUFS, quick fade in/out to avoid clicks.

| id                | Trigger                | Character / spec |
| ----------------- | ---------------------- | ---------------- |
| `sfx_button`      | Any button press       | Soft rounded tick, ~60 ms |
| `sfx_exit`        | Valid character exit    | Bright rising "whoosh-pop", ~180 ms |
| `sfx_blocked`     | Blocked (illegal) tap   | Low soft "thud/buzz", ~120 ms |
| `sfx_undo`        | Undo                    | Reverse of exit, descending, ~180 ms |
| `sfx_restart`     | Restart level           | Quick shuffle sweep, ~200 ms |
| `sfx_hint`        | Hint used               | Gentle sparkle/chime, ~250 ms |
| `sfx_starreveal`  | Each star reveal        | Ascending chime step (3 pitches), ~150 ms each |
| `sfx_levelcomplete`| Level complete          | Warm success flourish, ~700 ms |
| `sfx_dailystreak` | Daily streak increment  | Rising 3-note motif + soft flame, ~500 ms |
| `sfx_rewardunlock`| Cosmetic/env unlock     | Celebratory shimmer, ~600 ms |

## Replacement procedure

1. Drop the final file at `assets/audio/<id>.m4a` (same filename).
2. Keep the same `id`; update `status` → `ready` and bump `version` in
   `assets/asset-manifest.json` (via `scripts/generate-manifest.mjs` or by hand).
3. `src/data/audio.ts` maps ids → `require()`d files; no other change needed.
4. All playback already respects the Sound/Music settings (`useAudio`).

## Placeholder implementation note

Placeholders are generated as tiny synthesized tones so the bundle stays small
and license-clean. They are clearly labeled temporary in `docs/STATUS.md`.
