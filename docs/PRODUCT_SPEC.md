# Product Specification — Crowd Control Daily

## 1. Identity

- **Name:** Crowd Control Daily
- **Tagline:** Clear the crowd. Find the right way out.
- **Genre:** Premium casual logic/puzzle, single-player, offline.
- **Audience:** Wide/all-ages, short repeat sessions, one-handed play.

## 2. Core loop

The player sees a square grid populated by chibi crowd characters. Every
character faces one of four directions: **up, down, left, right**.

A character can leave the board only when **every tile between it and the
corresponding edge is empty**. The player taps characters in a valid order
until the entire crowd clears.

- Tap a character with a clear path → it exits the board (a **move**).
- Tap a blocked character → it shakes, mistakes counter increments, no state
  change to the board.
- Board clears → timer stops, result is scored (1–3 stars), progress saved,
  results screen shown.

## 3. Rules (authoritative)

Given a grid of size `N` (4, 5, or 6) with characters at integer
`(row, column)` positions (row 0 = top, column 0 = left):

- **Path cells** for a character = the straight line of cells from the
  character (exclusive) to the board edge in its facing direction:
  - `up`: cells `(row-1, col) … (0, col)`
  - `down`: cells `(row+1, col) … (N-1, col)`
  - `left`: cells `(row, col-1) … (row, 0)`
  - `right`: cells `(row, col+1) … (row, N-1)`
- **Path is clear** if no *uncleared* character occupies any path cell.
- **Blocking characters** = uncleared characters on the path cells.
- A move is legal iff the tapped character is uncleared and its path is clear.
- The level is complete when every character has status `cleared`.

The engine never uses a physics engine; all rules are deterministic integer
grid checks.

## 4. Scoring

- **Stars (1–3)** per level based on mistakes (primary) and time vs. par:
  - 3 stars: 0 mistakes and time ≤ par time.
  - 2 stars: ≤ 2 mistakes.
  - 1 star: completed.
- **Perfect** = 3 stars with 0 mistakes.
- `parMoves` equals the number of characters (each character = exactly one
  move). Par time is derived from grid size and character count.

## 5. Levels & progression

- 60 bundled levels: 1–20 easy (4×4), 21–40 medium (5×5), 41–60 hard (6×6).
- Every level is solver-validated at build/test time.
- Star gates unlock environments (see §7).

## 6. Daily challenge

- One deterministic puzzle per UTC date, seeded by `YYYY-MM-DD`.
- Puzzle number = days since epoch date `2025-01-01` + 1.
- First completion defines the official result (time, moves, mistakes).
- Tracks current streak, longest streak, and per-date history.
- Share text is generated locally and never reveals the solution.

## 7. Environments

Six environments, unlocked by level number reached:

| Environment    | Unlocks at level |
| -------------- | ---------------- |
| Concert venue  | 1                |
| Airport        | 11               |
| Subway         | 21               |
| Theme park     | 31               |
| School         | 41               |
| Shopping mall  | 51               |

Environment art frames the board; the center stays visually quiet.

## 8. Screens

Splash (native + animated), Onboarding (5 pages), Tutorial (staged 4×4), Home,
Gameplay, Daily, Levels, Results, Stats, Customize, Settings, About, Privacy.
See `docs/phases/` for per-screen scope.

## 9. Cosmetics (earned, no purchases)

Characters, outfits, environments, board themes, confetti effects — all
unlocked with earned stars. Tutorial completion grants "Concert Rookie Outfit".

## 10. Storage (local only)

Schema version, onboarding/tutorial completion, settings, level progress, best
results, earned stars, cosmetics, selected environment, daily history, streaks,
statistics. Migrations supported; corrupt data recovers to safe defaults.

## 11. Accessibility

Roles + labels, ≥44pt touch targets, high contrast, reduced-motion path,
direction shown by arrow shape (not color alone), safe areas, text scaling.

## 12. Non-goals (v1)

Unity/Godot/Phaser/WebView renderers, Firebase/Supabase, auth, online
multiplayer, ads, subscriptions, real-money purchases, remote artwork.
