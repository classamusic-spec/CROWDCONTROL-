# Known Issues & Failure Log — Crowd Control Daily

Record every command failure: command, error, root cause, fix, follow-up test.

## Open

- **No device/simulator render available.** Visual QA is limited to
  layout/snapshot tests. Real screenshots must be captured by the user later;
  see `docs/MANUAL_VISUAL_QA.md`. (Non-blocking, environmental.)
- **Raster art is procedural placeholder.** Characters/environments are native
  SVG/procedural composites, not generated raster art. Tracked in
  `docs/ASSET_GENERATION_QUEUE.md`. (Non-blocking, documented.)

## Resolved

_(none yet)_
