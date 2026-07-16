/**
 * Deterministic seeded pseudo-random number generator. Same seed → same
 * sequence, on every platform. Used by the level generator and daily challenge
 * so puzzles are reproducible and shareable without any network.
 */

/** FNV-1a-ish string hash → 32-bit unsigned int. */
export function hashSeed(seed: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export type Rng = {
  /** Next float in [0, 1). */
  next(): number;
  /** Integer in [min, max] inclusive. */
  int(min: number, max: number): number;
  /** Random element of a non-empty array. */
  pick<T>(items: readonly T[]): T;
  /** In-place-free shuffle returning a new array (Fisher–Yates). */
  shuffle<T>(items: readonly T[]): T[];
};

/** mulberry32 PRNG. Fast, deterministic, good enough for puzzle generation. */
export function createRng(seed: number | string): Rng {
  let a = (typeof seed === 'string' ? hashSeed(seed) : seed >>> 0) || 1;
  const next = (): number => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (min: number, max: number): number =>
    min + Math.floor(next() * (max - min + 1));
  const pick = <T>(items: readonly T[]): T => {
    if (items.length === 0) throw new Error('pick() on empty array');
    return items[int(0, items.length - 1)] as T;
  };
  const shuffle = <T>(items: readonly T[]): T[] => {
    const out = [...items];
    for (let i = out.length - 1; i > 0; i--) {
      const j = int(0, i);
      const tmp = out[i] as T;
      out[i] = out[j] as T;
      out[j] = tmp;
    }
    return out;
  };
  return { next, int, pick, shuffle };
}
