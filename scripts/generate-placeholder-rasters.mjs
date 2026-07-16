/**
 * Generates the minimal raster placeholders that app.json requires (icon,
 * adaptive icon, splash, favicon). These are ORIGINAL, simple emblem
 * compositions drawn procedurally on the brand navy — clearly temporary and
 * queued for upgrade in docs/ASSET_GENERATION_QUEUE.md.
 *
 * Run: node scripts/generate-placeholder-rasters.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { encodePng, hex } from './lib/png.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const NAVY = hex('#071A3D');
const NAVY2 = hex('#0E2A5C');
const BLUE = hex('#1688F8');
const ORANGE = hex('#FF9818');
const GREEN = hex('#53C832');
const PURPLE = hex('#8D55E8');
const WHITE = hex('#FFFFFF');

/**
 * Emblem: four directional chevrons around a rounded center square on a
 * radial navy background. Readable at icon sizes, no text.
 */
function emblemPixel(size, transparent) {
  const cx = size / 2;
  const cy = size / 2;
  const unit = size / 24;
  return (x, y) => {
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Background: radial navy gradient (or transparent for adaptive fg).
    let bg;
    if (transparent) {
      bg = [0, 0, 0, 0];
    } else {
      const t = Math.min(1, dist / (size * 0.7));
      bg = [
        Math.round(NAVY2[0] + (NAVY[0] - NAVY2[0]) * t),
        Math.round(NAVY2[1] + (NAVY[1] - NAVY2[1]) * t),
        Math.round(NAVY2[2] + (NAVY[2] - NAVY2[2]) * t),
        255,
      ];
    }

    // Center rounded square (the "board").
    const half = unit * 4.2;
    const r = unit * 1.4;
    const inX = Math.abs(dx) < half;
    const inY = Math.abs(dy) < half;
    const corner =
      Math.abs(dx) > half - r && Math.abs(dy) > half - r
        ? Math.hypot(Math.abs(dx) - (half - r), Math.abs(dy) - (half - r)) <= r
        : true;
    if (inX && inY && corner) {
      // inner tile grid hint
      const gx = Math.floor((dx + half) / (half / 2)) % 2;
      const gy = Math.floor((dy + half) / (half / 2)) % 2;
      const base = (gx + gy) % 2 === 0 ? WHITE : hex('#AFC4E6');
      return [base[0], base[1], base[2], 255];
    }

    // Directional chevrons (triangles) at N/E/S/W.
    const chev = (ux, uy, color) => {
      // point along axis
      const along = ux !== 0 ? dx * ux : dy * uy; // distance outward
      const across = ux !== 0 ? dy : dx;
      const start = unit * 5.2;
      const end = unit * 8.6;
      if (along > start && along < end) {
        const width = (end - along) * 0.9;
        if (Math.abs(across) < width) return color;
      }
      return null;
    };
    const up = chev(0, -1, BLUE);
    if (up) return [...up, 255];
    const down = chev(0, 1, PURPLE);
    if (down) return [...down, 255];
    const left = chev(-1, 0, ORANGE);
    if (left) return [...left, 255];
    const right = chev(1, 0, GREEN);
    if (right) return [...right, 255];

    return bg;
  };
}

function write(path, size, transparent) {
  const full = join(root, path);
  mkdirSync(dirname(full), { recursive: true });
  const png = encodePng(size, size, emblemPixel(size, transparent));
  writeFileSync(full, png);
  console.log(`  wrote ${path} (${size}x${size}, ${png.length} bytes)`);
}

console.log('Generating placeholder rasters…');
write('assets/branding/icon.png', 1024, false);
write('assets/branding/adaptive-icon.png', 1024, true);
write('assets/branding/favicon.png', 96, false);
write('assets/splash/splash-icon.png', 512, true);
console.log('Done. These are temporary — see docs/ASSET_GENERATION_QUEUE.md.');
