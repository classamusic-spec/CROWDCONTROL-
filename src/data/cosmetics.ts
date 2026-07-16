/**
 * Cosmetic catalog — earned with stars (no real-money purchases). Grouped by
 * slot. `starCost` of 0 means granted by an event (e.g. tutorial reward).
 */

export type CosmeticSlot = 'character' | 'outfit' | 'environment' | 'boardTheme' | 'confetti';

export type Cosmetic = {
  id: string;
  slot: CosmeticSlot;
  name: string;
  description: string;
  /** Stars required to unlock, or null if unlocked another way. */
  starCost: number | null;
  /** Preview accent color. */
  color: string;
};

export const cosmetics: Cosmetic[] = [
  // Outfits
  { id: 'outfit_concert_rookie', slot: 'outfit', name: 'Concert Rookie', description: 'Your first tutorial reward.', starCost: null, color: '#8D55E8' },
  { id: 'outfit_vip', slot: 'outfit', name: 'VIP Pass', description: 'For seasoned crowd clearers.', starCost: 30, color: '#FFC928' },
  { id: 'outfit_traveler', slot: 'outfit', name: 'Frequent Flyer', description: 'Airport-ready style.', starCost: 60, color: '#1688F8' },
  // Board themes
  { id: 'board_classic', slot: 'boardTheme', name: 'Classic Navy', description: 'The default board look.', starCost: null, color: '#102F63' },
  { id: 'board_sunrise', slot: 'boardTheme', name: 'Sunrise', description: 'Warm cream board.', starCost: 20, color: '#F4EBD9' },
  { id: 'board_neon', slot: 'boardTheme', name: 'Neon Nights', description: 'Bright teal grid.', starCost: 45, color: '#20B7B2' },
  // Confetti
  { id: 'confetti_classic', slot: 'confetti', name: 'Classic Confetti', description: 'Colorful celebration.', starCost: null, color: '#E95A9D' },
  { id: 'confetti_stars', slot: 'confetti', name: 'Star Shower', description: 'Golden stars burst.', starCost: 25, color: '#FFC928' },
  // Characters (extra starters unlockable)
  { id: 'character_festival', slot: 'character', name: 'Festival Fan', description: 'A flower-crowned favorite.', starCost: 40, color: '#53C832' },
];

export const DEFAULT_EQUIPPED: Record<CosmeticSlot, string> = {
  character: 'bluehoodie',
  outfit: 'outfit_concert_rookie',
  environment: 'concert',
  boardTheme: 'board_classic',
  confetti: 'confetti_classic',
};

/** Cosmetics that are owned from the start (no unlock needed). */
export const FREE_COSMETICS = cosmetics
  .filter((c) => c.starCost === null)
  .map((c) => c.id);

export function getCosmetic(id: string): Cosmetic | undefined {
  return cosmetics.find((c) => c.id === id);
}
