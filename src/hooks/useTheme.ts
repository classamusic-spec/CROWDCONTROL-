import { theme, type Theme } from '@/data/theme';

/**
 * Returns the active theme. The palette is a single dark-navy premium theme in
 * v1; a light/alt board theme is unlocked via cosmetics and applied at the
 * board level, not by swapping the whole app theme. Kept as a hook so a future
 * ThemeProvider can override without touching call sites.
 */
export function useTheme(): Theme {
  return theme;
}
