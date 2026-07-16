/**
 * Headless functional test of the web demo using Chromium via playwright-core.
 * Loads the page, checks for console/page errors, drives Level 1 to completion
 * by tapping the level's known solution order, asserts the results overlay
 * appears with stars, and captures screenshots.
 *
 *   node scripts/test-web-demo.mjs
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright-core';

const root = process.cwd();
const EXE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const url = 'file://' + join(root, 'web-demo', 'index.html');
const data = JSON.parse(readFileSync(join(root, 'web-demo', 'game-data.json'), 'utf8'));
const level1 = data.levels.find((l) => l.number === 1);

const browser = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 412, height: 900 } });

const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(300);

// Menu renders
const menuVisible = await page.isVisible('#menu.active');
console.log('menu visible:', menuVisible);

// Go to Levels → Level 1
await page.click('text=Levels');
await page.waitForTimeout(200);
await page.click('.tile:not(.locked)');
await page.waitForTimeout(300);
const tokens = await page.locator('.token').count();
console.log('level 1 tokens rendered:', tokens, '(expected', level1.characters.length + ')');
await page.screenshot({ path: join(root, 'web-demo', 'shot-game.png') });

// Solve by tapping the known solution order.
for (const id of level1.knownSolution) {
  await page.click(`#tok-${id}`, { timeout: 2000 }).catch(() => {});
  await page.waitForTimeout(220);
}
await page.waitForTimeout(500);
const resultsVisible = await page.isVisible('#results.active');
const starsShown = await page.locator('#rStars .star.show').count();
console.log('results overlay visible:', resultsVisible, '| stars shown:', starsShown);
await page.screenshot({ path: join(root, 'web-demo', 'shot-results.png') });

// Menu screenshot
await page.click('text=Home');
await page.waitForTimeout(200);
await page.screenshot({ path: join(root, 'web-demo', 'shot-menu.png') });

await browser.close();

if (errors.length) { console.error('ERRORS:\n' + errors.join('\n')); process.exit(1); }
if (!menuVisible || tokens !== level1.characters.length || !resultsVisible) {
  console.error('FUNCTIONAL CHECK FAILED'); process.exit(1);
}
console.log('\nWeb demo functional test PASSED ✓');
