/**
 * create-contact-sheets.ts (npm run assets:contact)
 *
 * Builds an HTML contact sheet of generated raster candidates so they can be
 * reviewed against docs/ART_BIBLE.md before one is selected for production.
 * Writes assets/generated/contact-sheet.html referencing whatever candidate
 * images exist under assets/generated/ and assets/characters/.
 *
 *   npx tsx scripts/create-contact-sheets.ts
 */
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const root = process.cwd();
const SCAN_DIRS = ['assets/generated', 'assets/characters', 'assets/environments'];
const IMG_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp']);

const images: string[] = [];
for (const dir of SCAN_DIRS) {
  const abs = join(root, dir);
  if (!existsSync(abs)) continue;
  for (const name of readdirSync(abs)) {
    const p = join(abs, name);
    if (statSync(p).isFile() && IMG_EXT.has(extname(name).toLowerCase())) {
      images.push(relative(join(root, 'assets', 'generated'), p));
    }
  }
}

const outDir = join(root, 'assets', 'generated');
mkdirSync(outDir, { recursive: true });

const cards = images
  .map(
    (src) =>
      `<figure><img src="${src}" loading="lazy"/><figcaption>${src}</figcaption></figure>`,
  )
  .join('\n');

const html = `<!doctype html><meta charset="utf-8">
<title>Crowd Control Daily — Contact Sheet</title>
<style>
  body{background:#071A3D;color:#FFF8E9;font-family:system-ui;margin:24px}
  h1{font-weight:800}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px}
  figure{margin:0;background:#102F63;border-radius:12px;padding:8px;text-align:center}
  img{width:100%;height:160px;object-fit:contain;background:
    repeating-conic-gradient(#0E2A5C 0 25%, #102F63 0 50%) 50%/20px 20px}
  figcaption{font-size:11px;margin-top:6px;color:#AFC4E6;word-break:break-all}
  p.empty{color:#AFC4E6}
</style>
<h1>Contact Sheet — ${images.length} candidate(s)</h1>
${images.length ? `<div class="grid">${cards}</div>` : '<p class="empty">No raster candidates yet. Run assets:generate (Mode A) first.</p>'}
`;

const outPath = join(outDir, 'contact-sheet.html');
writeFileSync(outPath, html);
console.log(`Wrote ${outPath} (${images.length} images).`);
