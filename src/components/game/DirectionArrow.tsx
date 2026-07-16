import Svg, { Path } from 'react-native-svg';

import { theme } from '@/data/theme';
import type { Direction } from '@/types/game';

/**
 * The directional indicator rendered as a native SVG badge on top of the shared
 * character sprite (see ART_BIBLE — direction is UI, not baked art). Direction
 * is conveyed by BOTH color and orientation so it never relies on color alone
 * (accessibility).
 */

const ROTATION: Record<Direction, number> = {
  up: 0,
  right: 90,
  down: 180,
  left: 270,
};

export type DirectionArrowProps = {
  direction: Direction;
  size?: number;
  color?: string;
};

export function DirectionArrow({ direction, size = 20, color }: DirectionArrowProps) {
  const fill = color ?? theme.directionColors[direction];
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ transform: [{ rotate: `${ROTATION[direction]}deg` }] }}
      accessibilityRole="image"
      accessibilityLabel={`Facing ${direction}`}
    >
      {/* Rounded upward chevron/triangle. */}
      <Path
        d="M12 3.5 L20.5 14 A1.6 1.6 0 0 1 19 16.4 L14.5 15.4 L14.5 20 A1.6 1.6 0 0 1 12.9 21.6 L11.1 21.6 A1.6 1.6 0 0 1 9.5 20 L9.5 15.4 L5 16.4 A1.6 1.6 0 0 1 3.5 14 Z"
        fill={fill}
        stroke={theme.colors.primaryNavy}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default DirectionArrow;
