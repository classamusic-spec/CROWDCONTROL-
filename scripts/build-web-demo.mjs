/**
 * Builds the standalone web demo:
 *   - injects web-demo/game-data.json into web-demo/_content.html
 *   - writes web-demo/index.html   (full standalone document, open locally)
 *   - writes web-demo/artifact.html(content only, for the Artifact host)
 *   - verifies the PORTED engine solves every embedded level (faithfulness)
 *
 *   node scripts/build-web-demo.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dir = join(root, 'web-demo');
const data = JSON.parse(readFileSync(join(dir, 'game-data.json'), 'utf8'));
const content = readFileSync(join(dir, '_content.html'), 'utf8');

// ---- verify ported engine (must match src/engine) ----
const DELTA = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };
const pathCells = (ch, N) => {
  const [dr, dc] = DELTA[ch.direction];
  const cells = [];
  let r = ch.row + dr, c = ch.column + dc;
  while (r >= 0 && r < N && c >= 0 && c < N) { cells.push([r, c]); r += dr; c += dc; }
  return cells;
};
function solve(chars, N, max = 200000) {
  const byId = new Map(chars.map((p) => [p.id, p]));
  const memo = new Set();
  let states = 0;
  const legal = (rem) => {
    const m = [];
    for (const id of rem) {
      const p = byId.get(id);
      let ok = true;
      for (const [r, c] of pathCells(p, N)) {
        for (const q of rem) { if (q === id) continue; const o = byId.get(q); if (o.row === r && o.column === c) { ok = false; break; } }
        if (!ok) break;
      }
      if (ok) m.push(id);
    }
    return m;
  };
  const dfs = (rem, order) => {
    if (!rem.size) return order;
    if (states++ > max) return null;
    const k = [...rem].sort().join(',');
    if (memo.has(k)) return null;
    for (const id of legal(rem)) { rem.delete(id); order.push(id); const r = dfs(rem, order); if (r) return r; order.pop(); rem.add(id); }
    memo.add(k);
    return null;
  };
  return dfs(new Set(chars.map((p) => p.id)), []);
}

let checked = 0;
const all = [...data.levels, ...Object.values(data.dailies)];
for (const lv of all) {
  const sol = solve(lv.characters, lv.gridSize);
  if (!sol) throw new Error(`Ported engine could NOT solve level ${lv.id} — port mismatch!`);
  checked++;
}
console.log(`Ported-engine check: ${checked}/${all.length} embedded boards solvable ✓`);

// ---- inject ----
const injected = content.replace('__GAME_DATA__', JSON.stringify(data));
if (injected.includes('__GAME_DATA__')) throw new Error('data placeholder not replaced');

writeFileSync(join(dir, 'artifact.html'), injected);

const standalone = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1">
<title>Crowd Control Daily — Web Demo</title>
<style>html,body{margin:0;padding:0;background:#071A3D}</style>
</head>
<body>
${injected}
</body>
</html>`;
writeFileSync(join(dir, 'index.html'), standalone);

console.log(`Wrote web-demo/index.html (${standalone.length} bytes) and web-demo/artifact.html`);
