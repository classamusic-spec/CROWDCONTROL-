/**
 * generate-store-assets.ts (npx tsx scripts/generate-store-assets.ts)
 *
 * Produces procedural store composition placeholders (feature graphic + splash
 * hero) on the brand navy gradient using the dependency-free PNG encoder.
 * Clearly temporary — upgrade via Mode A (docs/ASSET_GENERATION_QUEUE.md).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { encodePng, hex } from './lib/png.mjs';

const root = process.cwd();
const NAVY = hex('#071A3D') as [number, number, number];
const NAVY2 = hex('#0E2A5C') as [number, number, number];
const BLUE = hex('#1688F8') as [number, number, number];
const ORANGE = hex('#FF9818') as [number, number, number];

function gradient(
  w: number,
  h: number,
): (x: number, y: number) => [number, number, number, number] {
  return (x, y) => {
    const t = y / h;
    const r = Math.round(NAVY2[0] + (NAVY[0] - NAVY2[0]) * t);
    const g = Math.round(NAVY2[1] + (NAVY[1] - NAVY2[1]) * t);
    const b = Math.round(NAVY2[2] + (NAVY[2] - NAVY2[2]) * t);
    // A couple of soft accent glows.
    const glow = (cx: number, cy: number, col: [number, number, number]) => {
      const d = Math.hypot(x - cx, y - cy) / (w * 0.5);
      const k = Math.max(0, 1 - d);
      return k * k * 0.35;
    };
    const gb = glow(w * 0.25, h * 0.3, BLUE);
    const go = glow(w * 0.8, h * 0.7, ORANGE);
    return [
      Math.min(255, Math.round(r + BLUE[0] * gb + ORANGE[0] * go)),
      Math.min(255, Math.round(g + BLUE[1] * gb + ORANGE[1] * go)),
      Math.min(255, Math.round(b + BLUE[2] * gb + ORANGE[2] * go)),
      255,
    ];
  };
}

function write(rel: string, w: number, h: number): void {
  const abs = join(root, rel);
  mkdirSync(dirname(abs), { recursive: true });
  const png = encodePng(w, h, gradient(w, h));
  writeFileSync(abs, png);
  console.log(`  wrote ${rel} (${w}x${h}, ${png.length} bytes)`);
}

console.log('Generating store composition placeholders…');
write('assets/store/feature-graphic.png', 1024, 500);
write('assets/store/hero.png', 1536, 1024);
write('assets/splash/splash-hero.png', 1024, 1536);
console.log('Done. Temporary — upgrade via Mode A (ASSET_GENERATION_QUEUE.md).');
