/**
 * generate-assets.mjs — Mode A raster asset generation via the OpenAI Image API.
 *
 * This is REPRODUCIBLE and SAFE:
 *   - Reads OPENAI_API_KEY only from the environment. Never hardcodes/prints it.
 *   - If the key or the `openai` SDK is missing, it prints setup guidance and
 *     exits 0 (the app already ships with Mode B procedural art).
 *   - Prompts come from docs/ASSET_GENERATION_QUEUE.md and are encoded below.
 *   - Outputs are written to the paths in assets/asset-manifest.json.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... node scripts/generate-assets.mjs [--only=characters]
 *
 * Requires (Mode A only): npm i -D openai
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const root = process.cwd();
const MODEL = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2';

const key = process.env.OPENAI_API_KEY;
if (!key) {
  console.log('OPENAI_API_KEY is not set — Mode A generation skipped.');
  console.log('The app ships with Mode B procedural/vector art, so this is not');
  console.log('an error. To generate raster upgrades:');
  console.log('  1) npm i -D openai');
  console.log('  2) OPENAI_API_KEY=sk-... node scripts/generate-assets.mjs');
  console.log('Prompts: docs/ASSET_GENERATION_QUEUE.md');
  process.exit(0);
}

let OpenAI;
try {
  ({ default: OpenAI } = await import('openai'));
} catch {
  console.error('The `openai` package is not installed. Run: npm i -D openai');
  process.exit(1);
}

const STYLE =
  'Crowd Control Daily — premium casual mobile puzzle game, original chibi art, ' +
  'rounded friendly shapes, soft two-tone shading, consistent clean outline, ' +
  'soft light from upper-left, bright palette (navy #071A3D base, accents ' +
  '#1688F8/#53C832/#FF9818/#8D55E8/#FFC928). No text, no logos, no watermark.';

const CHARACTERS = {
  bluehoodie: 'kid in a blue hoodie, hood down, cheerful',
  pinkpigtail: 'child with pink pigtails, pink top',
  greencap: 'youth with a green baseball cap worn forward',
  purpleglasses: 'character with round purple glasses',
  orangeheadphones: 'teen with orange over-ear headphones',
  yellowoveralls: 'child in yellow overalls',
  curlyhair: 'character with big curly hair, teal shirt',
  oldertraveler: 'older traveler with a small rolling bag',
  sportsfan: 'sports fan with a striped scarf',
  student: 'student with a backpack',
  mallshopper: 'shopper holding a small shopping bag',
  festivalattendee: 'festival-goer with a flower crown',
};

/** Build the full generation queue (id → {prompt, size, out}). */
function buildQueue() {
  const queue = [];
  for (const [id, desc] of Object.entries(CHARACTERS)) {
    queue.push({
      id: `char_${id}_neutral`,
      out: `assets/characters/char_${id}_neutral.png`,
      size: '1024x1024',
      prompt:
        `${STYLE} Original premium casual mobile-game chibi character, rounded ` +
        `proportions, large readable head, compact body, friendly expression, ` +
        `simplified readable clothing, transparent background, readable at ` +
        `80-140px tall. Character: ${desc}.`,
    });
  }
  return queue;
}

const onlyArg = process.argv.find((a) => a.startsWith('--only='));
const only = onlyArg ? onlyArg.split('=')[1] : null;

const client = new OpenAI({ apiKey: key });
const queue = buildQueue().filter((q) => !only || q.id.startsWith(`${only}`));

console.log(`Generating ${queue.length} assets with ${MODEL}…`);
const meta = [];
for (const item of queue) {
  const outPath = join(root, item.out);
  if (existsSync(outPath) && !process.env.FORCE) {
    console.log(`  · skip existing ${item.out}`);
    continue;
  }
  try {
    const res = await client.images.generate({
      model: MODEL,
      prompt: item.prompt,
      size: item.size,
      background: 'transparent',
    });
    const b64 = res.data?.[0]?.b64_json;
    if (!b64) throw new Error('no image data returned');
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, Buffer.from(b64, 'base64'));
    meta.push({ id: item.id, out: item.out, model: MODEL, size: item.size });
    console.log(`  ✓ ${item.out}`);
  } catch (err) {
    console.error(`  ✗ ${item.id}: ${err.message}`);
  }
}

// Record generation metadata (no secrets).
if (meta.length > 0) {
  const metaPath = join(root, 'assets', 'generated', 'generation-metadata.json');
  mkdirSync(dirname(metaPath), { recursive: true });
  writeFileSync(metaPath, JSON.stringify({ model: MODEL, assets: meta }, null, 2));
  console.log(`Wrote metadata for ${meta.length} assets.`);
}
console.log('Done. Review candidates, then flip manifest status to "ready".');
