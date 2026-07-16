import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

import { getCharacterVariant } from '@/data/characters';
import { palette } from '@/data/theme';

/**
 * Procedural chibi character built from layered shapes (Asset Mode B). A large
 * readable head + compact body per ART_BIBLE. The same base is used for all
 * directions; the DirectionArrow badge is drawn separately by the board.
 *
 * `facing="back"` renders the gameplay back-of-head pose (hair only, no face).
 */

export type CrowdSpriteProps = {
  variant: string;
  size?: number;
  facing?: 'front' | 'back';
};

export function CrowdSprite({ variant, size = 96, facing = 'front' }: CrowdSpriteProps) {
  const v = getCharacterVariant(variant);
  // viewBox 100x100. Soft ground shadow, body, head, hair, face.
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* ground shadow */}
      <Ellipse cx={50} cy={92} rx={26} ry={6} fill="#000000" opacity={0.18} />

      {/* body */}
      <Path
        d="M30 96 C30 72 34 60 50 60 C66 60 70 72 70 96 Z"
        fill={v.body}
        stroke={palette.primaryNavy}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {/* body accent stripe */}
      <Path
        d="M43 61 C46 60 54 60 57 61 L55 76 L45 76 Z"
        fill={v.accent}
        opacity={0.9}
      />

      {/* head */}
      <Circle
        cx={50}
        cy={38}
        r={26}
        fill={v.skin}
        stroke={palette.primaryNavy}
        strokeWidth={2}
      />

      {/* hair */}
      <Path
        d="M24 36 C24 16 40 12 50 12 C60 12 76 16 76 36 C70 28 60 26 50 26 C40 26 30 28 24 36 Z"
        fill={v.hair}
      />

      {facing === 'front' ? (
        <G>
          {/* eyes */}
          <Circle cx={42} cy={40} r={3.4} fill={palette.primaryNavy} />
          <Circle cx={58} cy={40} r={3.4} fill={palette.primaryNavy} />
          <Circle cx={43.2} cy={38.8} r={1.1} fill={palette.white} />
          <Circle cx={59.2} cy={38.8} r={1.1} fill={palette.white} />
          {/* cheeks */}
          <Circle cx={36} cy={46} r={3} fill={palette.pink} opacity={0.35} />
          <Circle cx={64} cy={46} r={3} fill={palette.pink} opacity={0.35} />
          {/* smile */}
          <Path
            d="M44 48 Q50 53 56 48"
            fill="none"
            stroke={palette.primaryNavy}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </G>
      ) : (
        // back of head: just a subtle hair swirl
        <Path
          d="M40 44 Q50 40 60 44"
          fill="none"
          stroke={palette.primaryNavy}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.4}
        />
      )}

      {/* accent hat/glasses hint by variant.accent on the head band */}
      <Rect x={26} y={30} width={48} height={4} rx={2} fill={v.accent} opacity={0.0} />
    </Svg>
  );
}

export default CrowdSprite;
