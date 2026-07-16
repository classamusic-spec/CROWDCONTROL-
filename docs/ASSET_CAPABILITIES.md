# Asset Capabilities — Environment Detection

Detected at Phase 0 start (date 2026-07-16). Re-run detection if the
environment changes.

| Capability                     | Available | Notes |
| ------------------------------ | --------- | ----- |
| Image-generation tooling       | ❌ No      | No local model / no CLI image generator. |
| `OPENAI_API_KEY`               | ❌ No      | Not set in environment. |
| Internet access (outbound)     | ⚠️ Proxied | HTTPS via agent proxy; not used at runtime (offline-first app). |
| Image-processing utilities     | ⚠️ Installable | `sharp` not preinstalled; can be added as a dev dep for optimization scripts. No ImageMagick/inkscape/rsvg. |
| SVG-generation capability      | ✅ Yes     | We author SVG by hand + `react-native-svg` renders it. |
| Screenshot capability          | ❌ No      | No simulator/device/browser render pipeline for this native app. |
| Simulator / device preview     | ❌ No      | Headless container; Expo dev server can boot but no device to render. |

## Consequences

- **Asset mode: B (procedural / vector placeholders).** See directive §5.2.
  All icons, arrows, badges, effects, logo, and character/environment art are
  produced as **original SVG + procedural native composites**. Every missing
  raster asset is documented in `docs/ASSET_GENERATION_QUEUE.md` with an exact
  prompt for later Mode-A regeneration.
- **No API keys are committed.** `scripts/generate-assets.mjs` is provided for
  Mode A but reads `OPENAI_API_KEY` only from the environment and is a no-op /
  clear error when the key is absent.
- **Visual QA is snapshot/layout-based**, not pixel screenshots. See
  `docs/MANUAL_VISUAL_QA.md` for the list of screenshots the user should attach
  later.
