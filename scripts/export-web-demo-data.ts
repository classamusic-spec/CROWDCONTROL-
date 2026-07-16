/**
 * Extracts real game data (bundled levels + a window of daily puzzles) into a
 * JSON blob for the standalone web demo. Uses the ACTUAL engine so the browser
 * build is faithful, not a reimplementation.
 *
 *   npx tsx scripts/export-web-demo-data.ts
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { bundledLevels } from '../src/data/bundledLevels';
import { characterVariants } from '../src/data/characters';
import { environments } from '../src/data/environments';
import { createDailyLevel } from '../src/engine/dailySeed';
import { addDays } from '../src/utils/date';

// A fixed "today" for the demo window (the build date). The demo lets you play
// any of these dates so the daily feature is testable offline.
const TODAY = '2026-07-16';
const dailies: Record<string, unknown> = {};
for (let i = -6; i <= 7; i++) {
  const date = addDays(TODAY, i);
  dailies[date] = createDailyLevel(date);
}

const data = {
  today: TODAY,
  levels: bundledLevels,
  dailies,
  environments,
  characters: characterVariants,
};

const out = join(process.cwd(), 'web-demo', 'game-data.json');
writeFileSync(out, JSON.stringify(data));
console.log(
  `Wrote ${out}: ${bundledLevels.length} levels, ${Object.keys(dailies).length} dailies`,
);
