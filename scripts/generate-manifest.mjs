/**
 * generate-manifest.mjs
 * Reproducibly builds assets/asset-manifest.json — the machine-readable
 * inventory of every required asset. This is the single source of truth that
 * `scripts/verify-assets.ts` checks against the filesystem.
 *
 * Run: node scripts/generate-manifest.mjs
 *
 * NOTE: This does NOT generate images. Asset raster generation (Mode A) lives
 * in scripts/generate-assets.mjs and requires OPENAI_API_KEY.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// Asset Mode B is active (no image generation available), so raster art is
// marked "placeholder" and vector/procedural art is "ready".
const PLACEHOLDER = 'placeholder';
const READY = 'ready';

/** @type {Array<object>} */
const assets = [];
let seq = 0;
const add = (a) => {
  seq += 1;
  assets.push({
    id: a.id,
    filename: a.filename,
    category: a.category,
    use: a.use,
    dimensions: a.dimensions,
    format: a.format,
    transparency: a.transparency ?? false,
    method: a.method ?? 'svg',
    status: a.status ?? READY,
    version: a.version ?? '1.0.0',
    runtimePath: a.runtimePath,
    replacement: a.replacement ?? '',
  });
};

// ---- Branding ----
const branding = [
  ['logo_primary', 'Primary logo (Crowd Control Daily lockup)'],
  ['logo_compact', 'Compact stacked logo'],
  ['emblem', 'Wordmark-free emblem'],
  ['icon_foreground', 'App icon foreground'],
  ['icon_adaptive_foreground', 'Android adaptive icon foreground'],
  ['splash_hero', 'Splash hero composition'],
  ['store_feature', 'Store feature-art composition'],
];
for (const [id, use] of branding) {
  add({
    id: `brand_${id}`,
    filename: `${id}.svg`,
    category: 'branding',
    use,
    dimensions: id.includes('store') ? '1536x1024' : '1024x1024',
    format: 'svg',
    transparency: true,
    method: 'svg',
    status: READY,
    runtimePath: `src/components/branding/${id}`,
    replacement: 'Rendered natively as React SVG component; no raster needed.',
  });
}

// ---- Characters (12 identities) ----
const characters = [
  'bluehoodie', 'pinkpigtail', 'greencap', 'purpleglasses', 'orangeheadphones',
  'yellowoveralls', 'curlyhair', 'oldertraveler', 'sportsfan', 'student',
  'mallshopper', 'festivalattendee',
];
for (const c of characters) {
  add({
    id: `char_${c}_neutral`,
    filename: `char_${c}_neutral.png`,
    category: 'character',
    use: `Neutral standing pose for ${c}`,
    dimensions: '1024x1024',
    format: 'png',
    transparency: true,
    method: 'procedural-svg',
    status: PLACEHOLDER,
    runtimePath: `src/components/game/CrowdSprite (variant=${c})`,
    replacement: 'See docs/ASSET_GENERATION_QUEUE.md → character prompt.',
  });
  add({
    id: `char_${c}_portrait`,
    filename: `char_${c}_portrait.png`,
    category: 'character',
    use: `Portrait for ${c} (customize/onboarding)`,
    dimensions: '1024x1024',
    format: 'png',
    transparency: true,
    method: 'procedural-svg',
    status: PLACEHOLDER,
    runtimePath: `src/components/game/CrowdSprite (variant=${c}, portrait)`,
    replacement: 'See docs/ASSET_GENERATION_QUEUE.md → portrait prompt.',
  });
}

// ---- Environments (6) ----
const envs = ['concert', 'airport', 'subway', 'themepark', 'school', 'mall'];
const envUses = [
  ['home', 'Portrait home background', '1024x1536'],
  ['board', 'Square gameplay-board background', '1536x1536'],
  ['header', 'Level-select header', '1536x1024'],
  ['thumb', 'Thumbnail', '1024x1024'],
  ['unlock', 'Unlock-card background', '1024x1024'],
];
for (const e of envs) {
  for (const [use, desc, dim] of envUses) {
    add({
      id: `env_${e}_${use}`,
      filename: `env_${e}_${use}.webp`,
      category: 'environment',
      use: `${desc} — ${e}`,
      dimensions: dim,
      format: 'webp',
      transparency: false,
      method: 'procedural-gradient',
      status: PLACEHOLDER,
      runtimePath: `src/components/game/EnvironmentBackdrop (env=${e})`,
      replacement: 'See docs/ASSET_GENERATION_QUEUE.md → environment prompt.',
    });
  }
}

// ---- Onboarding (5 heroes) ----
const onboarding = [
  ['welcome', 'Welcome crowd'],
  ['directions', 'Four directions'],
  ['strategy', 'One move unlocks another'],
  ['daily', 'Daily challenge'],
  ['rewards', 'Environment rewards'],
];
for (const [id, use] of onboarding) {
  add({
    id: `onboard_${id}`,
    filename: `onboard_${id}.svg`,
    category: 'onboarding',
    use: `Onboarding hero — ${use}`,
    dimensions: '1024x1536',
    format: 'svg',
    transparency: true,
    method: 'procedural-svg',
    status: READY,
    runtimePath: `src/components/onboarding/OnboardingHero (id=${id})`,
    replacement: 'Rendered natively; raster upgrade optional.',
  });
}

// ---- Interface icons (SVG) ----
const icons = [
  'star', 'heart', 'arrow', 'timer', 'remaining', 'mistakes', 'restart',
  'undo', 'hint', 'settings', 'home', 'levels', 'stats', 'customize', 'share',
  'calendar', 'streak', 'lock', 'trophy', 'reward', 'sound', 'music',
  'haptics', 'reducedmotion', 'theme', 'replay', 'continue', 'pause', 'close',
  'back',
];
for (const i of icons) {
  add({
    id: `icon_${i}`,
    filename: `icon_${i}.svg`,
    category: 'icon',
    use: `UI icon: ${i}`,
    dimensions: '24x24',
    format: 'svg',
    transparency: true,
    method: 'svg',
    status: READY,
    runtimePath: `src/components/icons/index (name=${i})`,
    replacement: 'Native SVG component; no raster needed.',
  });
}

// ---- Effects ----
const effects = [
  'confetti', 'motionstreak', 'exittrail', 'hintring', 'blocked',
  'successburst', 'starburst', 'logoshine',
];
for (const fx of effects) {
  add({
    id: `fx_${fx}`,
    filename: `fx_${fx}.svg`,
    category: 'effect',
    use: `Effect: ${fx}`,
    dimensions: '128x128',
    format: 'svg',
    transparency: true,
    method: 'procedural-svg',
    status: READY,
    runtimePath: `src/components/feedback/* (${fx})`,
    replacement: 'Rendered natively with Reanimated + SVG.',
  });
}

// ---- Audio ----
const audio = [
  'button', 'exit', 'blocked', 'undo', 'restart', 'hint', 'starreveal',
  'levelcomplete', 'dailystreak', 'rewardunlock',
];
for (const s of audio) {
  add({
    id: `sfx_${s}`,
    filename: `sfx_${s}.m4a`,
    category: 'audio',
    use: `Sound effect: ${s}`,
    dimensions: 'n/a',
    format: 'm4a',
    transparency: false,
    method: 'programmatic-placeholder',
    status: PLACEHOLDER,
    runtimePath: `assets/audio/sfx_${s}.m4a`,
    replacement: 'See docs/AUDIO_GENERATION_QUEUE.md. Placeholder tones only.',
  });
}

const manifest = {
  schema: 1,
  product: 'Crowd Control Daily',
  generatedBy: 'scripts/generate-manifest.mjs',
  assetMode: 'B (procedural/vector)',
  counts: {
    total: assets.length,
    ready: assets.filter((a) => a.status === READY).length,
    placeholder: assets.filter((a) => a.status === PLACEHOLDER).length,
  },
  assets,
};

mkdirSync(join(root, 'assets'), { recursive: true });
writeFileSync(
  join(root, 'assets', 'asset-manifest.json'),
  JSON.stringify(manifest, null, 2) + '\n',
);
console.log(
  `Wrote assets/asset-manifest.json — ${manifest.counts.total} assets ` +
    `(${manifest.counts.ready} ready, ${manifest.counts.placeholder} placeholder)`,
);
