# Asset Generation Queue — Raster Upgrades (Mode A)

The app ships fully functional with native SVG + procedural art (Asset Mode B).
This queue lists every raster asset that would upgrade a placeholder, with an
exact prompt for `gpt-image-2` (or a compatible GPT Image model). Run
`npm run assets:generate` once `OPENAI_API_KEY` is present; outputs save to the
`runtimePath`/`filename` in `assets/asset-manifest.json`.

## Global prompt rules

Every prompt must specify: product name, category, subject, composition, art
style, camera angle, lighting, palette, background, transparency, readability,
elements to exclude, and exact mobile use. Never bake text into artwork.

Style anchor (prepend to all): *"Crowd Control Daily — premium casual mobile
puzzle game, original chibi art, rounded friendly shapes, soft two-tone shading,
consistent clean outline, soft light from upper-left, bright palette
(navy #071A3D base, accents #1688F8/#53C832/#FF9818/#8D55E8/#FFC928). No text,
no logos, no watermark."*

## Characters (24 raster targets — 12 identities × neutral + portrait)

Base character prompt (per identity, `char_<id>_neutral.png`,
1024×1024, transparent PNG):

```
Original premium casual mobile-game chibi character, rounded proportions,
large readable head, compact body, soft directional lighting from upper left,
consistent clean outline, friendly expression, simplified readable clothing,
no text, no logo, no watermark, no cropped limbs, transparent background,
designed to remain readable at 80-140 pixels tall. Character: {IDENTITY}.
```

Identity descriptors:
1. `bluehoodie` — kid in a blue hoodie, hood down, cheerful.
2. `pinkpigtail` — child with pink pigtails, pink top.
3. `greencap` — youth with a green baseball cap worn forward.
4. `purpleglasses` — character with round purple glasses.
5. `orangeheadphones` — teen with orange over-ear headphones.
6. `yellowoveralls` — child in yellow overalls.
7. `curlyhair` — character with big curly hair, teal shirt.
8. `oldertraveler` — older traveler with a small rolling bag silhouette cue.
9. `sportsfan` — sports fan with a striped scarf.
10. `student` — student with a backpack.
11. `mallshopper` — shopper holding a small shopping bag.
12. `festivalattendee` — festival-goer with a flower crown.

Portrait prompt (`char_<id>_portrait.png`, 1024×1024): same identity,
head-and-shoulders bust, centered, soft circular vignette, transparent.

> Directional poses are NOT generated — direction is shown by a native arrow
> badge over the shared base sprite (see ART_BIBLE). Optional back-facing and
> celebration poses may be queued later if desired.

## Environments (30 raster targets — 6 environments × 5 uses)

Environment prompt (per env/use):

```
Premium casual mobile-puzzle-game environment, slightly elevated top-down
camera, symmetrical readable composition, visually quiet center reserved for a
gameplay grid, detailed edges, soft lighting, original design, no characters,
no text, no watermark, no logos from real businesses. Scene: {SCENE}. Use:
{USE}. Keep the central ~60% low-contrast and uncluttered.
```

Scenes: `concert` (stage lights, crowd barrier framing), `airport` (terminal
windows, gate signage shapes without text), `subway` (platform, tiled walls,
tunnel), `themepark` (rides silhouettes, bunting), `school` (lockers, hallway),
`mall` (storefront frames, escalators). Uses & sizes: home 1024×1536, board
1536×1536, header 1536×1024, thumb 1024×1024, unlock 1024×1024. WebP output.

## Onboarding (5 optional raster upgrades)

Native SVG heroes already ship. Optional raster (1024×1536, transparent):
welcome (a friendly crowd waving), directions (four arrows around a character),
strategy (one character clearing a path), daily (calendar + streak flame),
rewards (unlocking a new environment).

## Branding (optional raster upgrades)

Native SVG logo/emblem already ship. If raster wanted: `icon_foreground.png`
1024×1024 transparent (emblem centered, ~66% safe zone), `splash_hero.png`
1024×1536 (emblem + characters on navy gradient), `store_feature.png`
1536×1024.

## After generation

1. Review candidates against `docs/ART_BIBLE.md` (contact sheet:
   `scripts/create-contact-sheets.ts`).
2. Select one production candidate; move rejects out of the runtime bundle.
3. Optimize (`npm run assets:optimize`).
4. Flip `status` to `ready` in the manifest and switch the runtime component to
   load the raster via its `runtimePath`.
