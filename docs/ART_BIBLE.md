# Art Bible — Crowd Control Daily

> No `design-references/` images were attached to this build. The art direction
> below is derived from the directive's written visual standards and palette,
> and is the authoritative reference for all asset work until reference boards
> are supplied. See `docs/DECISIONS.md` (D-002).

## Visual identity

Premium casual-mobile-game quality. Chibi-inspired, rounded, friendly, bright,
clearly readable at small sizes, softly shaded, consistently outlined,
original, cohesive across all assets.

## Character system

- **Proportions:** large readable head (~40–45% of height), compact body,
  short limbs. Chibi. Target readable at **80–140px tall**.
- **Outline:** consistent clean outline, ~2–3px at source scale, darker shade
  of the local fill color (not pure black).
- **Lighting:** soft directional light from **upper-left**; single soft shadow.
- **Shading:** two-tone soft shading (base + one shadow, optional one
  highlight). No hard cel banding, no photorealism.
- **Expression:** friendly, simple faces. Never uncanny.
- **Direction indicator:** rendered by **native UI** (an arrow badge), NOT baked
  into the character art. The base character is shared across all four
  directions; only the arrow badge changes. This keeps art count low and
  arrows crisp/legible.
- **Naming:** `char_<id>_<pose>.<ext>` e.g. `char_bluehoodie_neutral.png`.

## Environment system

- **Camera:** slightly elevated top-down.
- **Composition:** symmetrical, readable, with a **visually quiet center**
  reserved for the gameplay grid. Detail lives at the edges/frame.
- **Contrast:** background must stay lower-contrast than characters so tokens
  read clearly. No characters, no text, no real-business logos in environment
  art.
- **Naming:** `env_<id>_<use>.<ext>` e.g. `env_concert_board.webp`.

## Arrows & icons

- **Arrows:** bold, rounded, high-contrast chevron/triangle. Legible at 24px.
  Color-coded per direction but always distinguishable by *shape/orientation*
  (never color alone).
- **Icons:** single consistent line+fill style, rounded joins, 2px stroke,
  24×24 base grid, exported as SVG React components.
- **Buttons:** rounded rectangles, soft drop shadow + subtle inner top
  highlight, pressed = scale 0.96 + reduced shadow. Gradient fills from the
  palette.

## Color palette (tokens)

```
Primary navy   #071A3D   Secondary navy #0E2A5C   Panel navy   #102F63
Bright blue    #1688F8   Deep blue      #0766D8
Green          #53C832   Dark green     #269B20
Orange         #FF9818   Dark orange    #E56C00
Yellow         #FFC928
Red            #F04444   Purple         #8D55E8   Pink         #E95A9D
Teal           #20B7B2
Cream          #FFF8E9   Warm panel     #F4EBD9   White        #FFFFFF
Muted blue     #AFC4E6
```

### Direction color mapping

- up → bright blue `#1688F8`
- down → purple `#8D55E8`
- left → orange `#FF9818`
- right → green `#53C832`

(Each direction is also distinguished by arrow orientation for accessibility.)

## Texture & finish

Flat-to-soft. Subtle gradients allowed. Minimal texture. No noisy detail, no
excessive micro-detail.

## Disallowed

Photorealism, uncanny faces, inconsistent proportions/outlines, embedded text
in artwork, illegible arrows, mismatched camera angles, random lighting
directions, existing commercial-game branding, copyrighted characters, blurry
upscales.

## Text rule

**All interface text is rendered natively.** No labels, timers, counters,
headlines, or instructions may live inside image assets.

## Asset formats

- Raster characters/environments: transparent **PNG** (or WebP) source at sizes
  in `docs/PRODUCT_SPEC.md` / directive §5.5; optimized runtime derivatives.
- Icons/arrows/effects/logo: **SVG** (as React components) wherever possible.
