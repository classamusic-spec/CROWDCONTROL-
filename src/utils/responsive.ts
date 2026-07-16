import { theme } from '@/data/theme';

/**
 * Compute the pixel size of the square game board for a given available width,
 * clamped to a comfortable max and padded from the screen edges.
 */
export function computeBoardSize(availableWidth: number): number {
  const padded = availableWidth - theme.layout.screenPadding * 2;
  return Math.min(padded, theme.layout.maxContentWidth - 24, 460);
}

/** Small-screen breakpoint helpers. */
export function isSmallScreen(width: number): boolean {
  return width <= theme.layout.breakpoints.small;
}
