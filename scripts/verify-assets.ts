/**
 * Asset verification (npm run assets:verify).
 *
 *   1. Loads assets/asset-manifest.json and checks every entry has all
 *      required fields and a recognized status.
 *   2. Confirms the raster files the app actually bundles (icon, adaptive
 *      icon, favicon, splash) exist on disk.
 *   3. Reports ready vs placeholder counts and lists queued placeholders.
 *
 * Exits non-zero on any structural problem or missing required file.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

type Asset = {
  id: string;
  filename: string;
  category: string;
  use: string;
  dimensions: string;
  format: string;
  transparency: boolean;
  method: string;
  status: string;
  version: string;
  runtimePath: string;
  replacement: string;
};

const root = process.cwd();
const manifestPath = join(root, 'assets', 'asset-manifest.json');

let failures = 0;
const fail = (m: string) => {
  failures++;
  console.error(`  ✗ ${m}`);
};

if (!existsSync(manifestPath)) {
  console.error('assets/asset-manifest.json not found — run assets:manifest');
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
  assets: Asset[];
  counts?: { total: number; ready: number; placeholder: number };
};

const REQUIRED_FIELDS: (keyof Asset)[] = [
  'id',
  'filename',
  'category',
  'use',
  'dimensions',
  'format',
  'transparency',
  'method',
  'status',
  'version',
  'runtimePath',
  'replacement',
];
const VALID_STATUS = new Set(['ready', 'placeholder']);

const ids = new Set<string>();
for (const a of manifest.assets) {
  for (const f of REQUIRED_FIELDS) {
    if (a[f] === undefined || a[f] === null || a[f] === '') {
      // `replacement` and `use` may legitimately be short but not empty.
      fail(`asset ${a.id ?? '(no id)'} missing field "${f}"`);
    }
  }
  if (!VALID_STATUS.has(a.status)) fail(`asset ${a.id} invalid status "${a.status}"`);
  if (ids.has(a.id)) fail(`duplicate asset id ${a.id}`);
  ids.add(a.id);
}

// Files that must physically exist for the app to build.
const REQUIRED_FILES = [
  'assets/branding/icon.png',
  'assets/branding/adaptive-icon.png',
  'assets/branding/favicon.png',
  'assets/splash/splash-icon.png',
];
for (const rel of REQUIRED_FILES) {
  if (!existsSync(join(root, rel))) fail(`required bundle file missing: ${rel}`);
}

const ready = manifest.assets.filter((a) => a.status === 'ready').length;
const placeholder = manifest.assets.filter((a) => a.status === 'placeholder');

console.log(`Manifest: ${manifest.assets.length} assets`);
console.log(`  ready:       ${ready}`);
console.log(`  placeholder: ${placeholder.length}`);
if (placeholder.length > 0) {
  console.log('  placeholders are procedural/native and queued for raster');
  console.log('  upgrade (docs/ASSET_GENERATION_QUEUE.md / AUDIO_GENERATION_QUEUE.md).');
}

if (failures > 0) {
  console.error(`\nASSET VERIFY FAILED: ${failures} problem(s).`);
  process.exit(1);
}
console.log('\nAsset verification passed.');
