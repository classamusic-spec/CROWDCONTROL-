import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Typed, corruption-safe AsyncStorage helpers. All persistence goes through
 * here so screens never touch AsyncStorage directly (see AGENTS.md).
 */

/**
 * Read + parse a JSON value. Returns `fallback` on missing OR corrupt data,
 * and (optionally) validates/normalizes via `revive`.
 */
export async function getJSON<T>(
  key: string,
  fallback: T,
  revive?: (raw: unknown) => T,
): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return fallback;
    const parsed: unknown = JSON.parse(raw);
    return revive ? revive(parsed) : (parsed as T);
  } catch {
    // Corrupt data → recover to safe default.
    return fallback;
  }
}

/** Serialize + write a JSON value. Returns true on success. */
export async function setJSON<T>(key: string, value: T): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/** Remove a key (best-effort). */
export async function remove(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // ignore
  }
}
