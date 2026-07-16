import Svg, { G, Path, Rect } from 'react-native-svg';

import { palette, theme } from '@/data/theme';

/**
 * Wordmark-free emblem: a rounded board tile with four directional chevrons.
 * Original mark used for the app icon, splash, and compact contexts.
 */
export type EmblemProps = { size?: number };

export function Emblem({ size = 96 }: EmblemProps) {
  const chev = (rotation: number, color: string, key: string) => (
    <G key={key} rotation={rotation} origin="50, 50">
      <Path
        d="M50 8 L60 22 A1.4 1.4 0 0 1 58.7 24.2 L50 22.4 L41.3 24.2 A1.4 1.4 0 0 1 40 22 Z"
        fill={color}
        stroke={palette.primaryNavy}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </G>
  );
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" accessibilityRole="image" accessibilityLabel="Crowd Control Daily emblem">
      {/* center board */}
      <Rect x={30} y={30} width={40} height={40} rx={11} fill={palette.panelNavy} stroke={palette.mutedBlue} strokeWidth={2} />
      {/* board grid hint */}
      <Rect x={38} y={38} width={10} height={10} rx={2} fill={palette.brightBlue} opacity={0.9} />
      <Rect x={52} y={38} width={10} height={10} rx={2} fill={palette.white} opacity={0.5} />
      <Rect x={38} y={52} width={10} height={10} rx={2} fill={palette.white} opacity={0.5} />
      <Rect x={52} y={52} width={10} height={10} rx={2} fill={palette.orange} opacity={0.9} />
      {chev(0, theme.directionColors.up, 'up')}
      {chev(90, theme.directionColors.right, 'right')}
      {chev(180, theme.directionColors.down, 'down')}
      {chev(270, theme.directionColors.left, 'left')}
    </Svg>
  );
}

export default Emblem;
