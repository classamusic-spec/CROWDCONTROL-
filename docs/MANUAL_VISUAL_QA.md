# Manual Visual QA — Screenshots to Capture

This environment has **no device/simulator render pipeline**, so automated
pixel screenshots are not possible here (see `docs/ASSET_CAPABILITIES.md`).
Visual QA in-repo is limited to layout/snapshot/unit tests. When you run the
app on a device or Expo Go, please capture the following and attach them so the
visual gates in `docs/phases/*` can be closed.

## How to run

```bash
npm install
npx expo start           # scan QR with Expo Go, or press i / a for simulators
```

## Screenshots to attach (portrait, at least one small + one large device)

1. **Animated splash** mid-sequence (logo assembling) and final frame.
2. **Onboarding** pages 1–5 (each hero + copy + progress dots).
3. **Tutorial** — a guided step showing the highlighted character + coach copy.
4. **Home** — environment background, logo, star total, streak, primary buttons,
   bottom nav.
5. **Gameplay** — a mid-game 5×5 board with HUD (timer, mistakes, remaining),
   Undo/Hint/Restart, one blocked-shake and one exit animation if capturable.
6. **Results** — 3 animated stars, time/moves/mistakes, best result, buttons.
7. **Daily** — puzzle-of-the-day board + streak + share sheet.
8. **Levels** — level-select grid with locked/unlocked + star counts.
9. **Stats** — totals + daily calendar + environment progress.
10. **Customize** — cosmetic tiles (locked/unlocked/equipped).
11. **Settings** — all toggles; verify reduced-motion + theme visibly change UI.
12. **About / Privacy** — full text screens.

## What to check against `docs/ART_BIBLE.md`

Hierarchy, alignment, spacing, typography, image quality, button depth, safe
areas, grid readability, character readability, color consistency, small-screen
behavior. Record gaps back into `docs/KNOWN_ISSUES.md` and fix the most visible.
