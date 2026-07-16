/**
 * optimize-assets.ts (npm run assets:optimize)
 *
 * Produces optimized runtime derivatives of raster source art. Uses `sharp`
 * when available; otherwise reports what it would do and exits 0 (Mode B art
 * is vector/procedural and needs no raster optimization).
 *
 *   npx tsx scripts/optimize-assets.ts
 */
import { existsSync, readdirSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

const root = process.cwd();
const RASTER_DIRS = ['assets/characters', 'assets/environments', 'assets/branding'];
const RASTER_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp']);

function listRasters(): string[] {
  const out: string[] = [];
  for (const dir of RASTER_DIRS) {
    const abs = join(root, dir);
    if (!existsSync(abs)) continue;
    for (const name of readdirSync(abs)) {
      const p = join(abs, name);
      if (statSync(p).isFile() && RASTER_EXT.has(extname(name).toLowerCase())) {
        out.push(join(dir, name));
      }
    }
  }
  return out;
}

async function main(): Promise<void> {
  const rasters = listRasters();
  console.log(`Found ${rasters.length} raster asset(s).`);

  let sharp: typeof import('sharp') | null = null;
  try {
    sharp = (await import('sharp')).default as unknown as typeof import('sharp');
  } catch {
    sharp = null;
  }

  if (!sharp) {
    console.log('`sharp` is not installed — optimization skipped.');
    console.log('Current art is Mode B (vector/procedural); no raster to optimize.');
    console.log('To enable: npm i -D sharp, then re-run.');
    return;
  }

  let optimized = 0;
  for (const rel of rasters) {
    const abs = join(root, rel);
    try {
      const before = statSync(abs).size;
      const buf = await sharp(abs).png({ compressionLevel: 9, quality: 82 }).toBuffer();
      if (buf.length < before) {
        const { writeFileSync } = await import('node:fs');
        writeFileSync(abs, buf);
        optimized++;
        console.log(`  ✓ ${rel} ${before} → ${buf.length} bytes`);
      }
    } catch (err) {
      console.error(`  ✗ ${rel}: ${(err as Error).message}`);
    }
  }
  console.log(`Optimized ${optimized} file(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
