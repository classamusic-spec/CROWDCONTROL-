import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS, SCHEMA_VERSION } from '@/storage/defaults';

/**
 * Storage schema migrations. On app start, `runMigrations` reads the persisted
 * schema version and applies ordered transforms up to SCHEMA_VERSION, then
 * stamps the new version. Missing/corrupt version → treated as fresh (safe).
 *
 * Each migration takes the previous version's raw values and returns nothing
 * (it rewrites keys directly). Add new entries as the schema evolves.
 */

type Migration = (from: number) => Promise<void>;

// v0 → v1: no structural change; simply stamp version 1. Kept as an example of
// where future transforms plug in.
const MIGRATIONS: Record<number, Migration> = {
  1: async () => {
    // no-op: initial schema
  },
};

async function readVersion(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.schema);
    if (raw == null) return 0;
    const n = JSON.parse(raw);
    return typeof n === 'number' && Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

export async function runMigrations(): Promise<void> {
  const from = await readVersion();
  if (from >= SCHEMA_VERSION) return;
  for (let v = from + 1; v <= SCHEMA_VERSION; v++) {
    const migrate = MIGRATIONS[v];
    if (migrate) await migrate(from);
  }
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.schema,
      JSON.stringify(SCHEMA_VERSION),
    );
  } catch {
    // If we cannot stamp the version, migrations will simply re-run next time;
    // they are idempotent, so this is safe.
  }
}
