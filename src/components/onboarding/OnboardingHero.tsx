import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';

import { CrowdSprite } from '@/components/game/CrowdSprite';
import { DirectionArrow } from '@/components/game/DirectionArrow';
import { palette } from '@/data/theme';
import type { Direction } from '@/types/game';

/**
 * Original, self-contained native-SVG illustrations for the five onboarding
 * pages. Each id renders a visually distinct, friendly/chibi-adjacent scene on a
 * transparent background using only `palette` colors (ART_BIBLE — art is drawn,
 * not baked). Character-based scenes layer the shared CrowdSprite over a
 * decorative backdrop Svg; the pure-illustration scenes (daily/rewards) are a
 * single Svg. The whole hero is decorative and hidden from assistive tech — the
 * page headline/copy carry the meaning.
 */
export type OnboardingHeroId =
  | 'welcome'
  | 'directions'
  | 'strategy'
  | 'daily'
  | 'rewards';

export type OnboardingHeroProps = {
  id: OnboardingHeroId;
  size?: number;
};

export function OnboardingHero({ id, size = 220 }: OnboardingHeroProps) {
  // Position a CrowdSprite by fractional center within the size×size box.
  const sprite = (
    key: string,
    variant: string,
    cxF: number,
    cyF: number,
    sz: number,
    opacity = 1,
  ) => (
    <View
      key={key}
      style={{
        position: 'absolute',
        left: cxF * size - sz / 2,
        top: cyF * size - sz / 2,
        opacity,
      }}
    >
      <CrowdSprite variant={variant} size={sz} />
    </View>
  );

  // Position a DirectionArrow badge by fractional center.
  const arrow = (
    key: string,
    direction: Direction,
    cxF: number,
    cyF: number,
    sz: number,
    color: string,
  ) => (
    <View
      key={key}
      style={{
        position: 'absolute',
        left: cxF * size - sz / 2,
        top: cyF * size - sz / 2,
      }}
    >
      <DirectionArrow direction={direction} size={sz} color={color} />
    </View>
  );

  const backdrop = (children: React.ReactNode) => (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={StyleSheet.absoluteFill}
    >
      {children}
    </Svg>
  );

  const content = renderScene(id, size, sprite, arrow, backdrop);

  return (
    <View
      style={[styles.root, { width: size, height: size }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {content}
    </View>
  );
}

type SpriteFn = (
  key: string,
  variant: string,
  cxF: number,
  cyF: number,
  sz: number,
  opacity?: number,
) => React.ReactNode;

type ArrowFn = (
  key: string,
  direction: Direction,
  cxF: number,
  cyF: number,
  sz: number,
  color: string,
) => React.ReactNode;

type BackdropFn = (children: React.ReactNode) => React.ReactNode;

/** A small four-point sparkle centered at (cx, cy). */
function sparkle(key: string, cx: number, cy: number, r: number, fill: string) {
  const t = r * 0.28;
  const d = `M${cx} ${cy - r} L${cx + t} ${cy - t} L${cx + r} ${cy} L${cx + t} ${cy + t} L${cx} ${cy + r} L${cx - t} ${cy + t} L${cx - r} ${cy} L${cx - t} ${cy - t} Z`;
  return <Path key={key} d={d} fill={fill} />;
}

function renderScene(
  id: OnboardingHeroId,
  size: number,
  sprite: SpriteFn,
  arrow: ArrowFn,
  backdrop: BackdropFn,
): React.ReactNode {
  switch (id) {
    case 'welcome':
      return (
        <>
          {backdrop(
            <G>
              <Circle cx={50} cy={46} r={40} fill={palette.brightBlue} opacity={0.1} />
              <Circle cx={50} cy={46} r={29} fill={palette.brightBlue} opacity={0.14} />
              <Circle cx={50} cy={46} r={19} fill={palette.deepBlue} opacity={0.16} />
              {sparkle('s1', 20, 20, 2.4, palette.yellow)}
              {sparkle('s2', 82, 26, 2.8, palette.yellow)}
              {sparkle('s3', 74, 14, 1.8, palette.white)}
              {sparkle('s4', 16, 60, 2.2, palette.white)}
            </G>,
          )}
          {sprite('left', 'pinkpigtail', 0.28, 0.62, size * 0.34)}
          {sprite('right', 'greencap', 0.72, 0.62, size * 0.34)}
          {sprite('center', 'bluehoodie', 0.5, 0.5, size * 0.46)}
        </>
      );

    case 'directions':
      return (
        <>
          {backdrop(
            <G>
              <Circle cx={50} cy={50} r={34} fill={palette.brightBlue} opacity={0.08} />
              <Circle
                cx={50}
                cy={50}
                r={41}
                fill="none"
                stroke={palette.mutedBlue}
                strokeWidth={1}
                strokeDasharray="2 4"
                opacity={0.45}
              />
            </G>,
          )}
          {sprite('c', 'purpleglasses', 0.5, 0.5, size * 0.4)}
          {arrow('up', 'up', 0.5, 0.11, size * 0.17, palette.brightBlue)}
          {arrow('right', 'right', 0.87, 0.5, size * 0.17, palette.green)}
          {arrow('down', 'down', 0.5, 0.89, size * 0.17, palette.purple)}
          {arrow('left', 'left', 0.13, 0.5, size * 0.17, palette.orange)}
        </>
      );

    case 'strategy':
      return (
        <>
          {backdrop(
            <G>
              <Circle cx={50} cy={50} r={38} fill={palette.green} opacity={0.07} />
              {/* the lane: a dotted path that clears to the right */}
              <Line
                x1={14}
                y1={64}
                x2={86}
                y2={64}
                stroke={palette.mutedBlue}
                strokeWidth={3}
                strokeDasharray="1 7"
                strokeLinecap="round"
                opacity={0.75}
              />
              {/* an opening at the right end of the lane */}
              <Path
                d="M78 58 L86 64 L78 70"
                fill="none"
                stroke={palette.green}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </G>,
          )}
          {/* left character is being cleared → faded */}
          {sprite('cleared', 'orangeheadphones', 0.3, 0.52, size * 0.36, 0.4)}
          {sprite('mover', 'greencap', 0.62, 0.52, size * 0.38)}
          {arrow('lane', 'right', 0.86, 0.34, size * 0.15, palette.green)}
        </>
      );

    case 'daily':
      return (
        <>
          {backdrop(
            <G>
              <Circle cx={50} cy={50} r={40} fill={palette.orange} opacity={0.07} />
              {/* binding rings */}
              <Line x1={38} y1={18} x2={38} y2={30} stroke={palette.mutedBlue} strokeWidth={3} strokeLinecap="round" />
              <Line x1={62} y1={18} x2={62} y2={30} stroke={palette.mutedBlue} strokeWidth={3} strokeLinecap="round" />
              {/* calendar body */}
              <Rect
                x={22}
                y={26}
                width={56}
                height={52}
                rx={8}
                fill={palette.panelNavy}
                stroke={palette.mutedBlue}
                strokeWidth={2}
              />
              {/* header band */}
              <Rect x={26} y={30} width={48} height={11} rx={4} fill={palette.brightBlue} />
              {/* day tiles */}
              <Rect x={28} y={46} width={9} height={9} rx={2} fill={palette.mutedBlue} opacity={0.5} />
              <Rect x={41} y={46} width={9} height={9} rx={2} fill={palette.mutedBlue} opacity={0.5} />
              <Rect x={54} y={46} width={9} height={9} rx={2} fill={palette.yellow} />
              <Rect x={67} y={46} width={9} height={9} rx={2} fill={palette.mutedBlue} opacity={0.5} />
              <Rect x={28} y={59} width={9} height={9} rx={2} fill={palette.mutedBlue} opacity={0.5} />
              <Rect x={41} y={59} width={9} height={9} rx={2} fill={palette.mutedBlue} opacity={0.5} />
              {/* streak flame badge */}
              <Circle cx={70} cy={72} r={14} fill={palette.orange} stroke={palette.primaryNavy} strokeWidth={2} />
              <Path
                d="M70 63 C75 68 75 71 72 74 C74 73 75 71 74.5 69 C78 72 78 78 70 81 C62 78 62 72 65.5 69 C65.5 72 67 73 68 73 C66 70 67 66 70 63 Z"
                fill={palette.yellow}
              />
              <Path
                d="M70 70 C72 72 72 74 70.5 76 C68.8 74.6 68.8 72.6 70 70 Z"
                fill={palette.red}
              />
            </G>,
          )}
        </>
      );

    case 'rewards':
      return (
        <>
          {backdrop(
            <G>
              <Circle cx={50} cy={44} r={37} fill={palette.yellow} opacity={0.08} />
              {/* trophy handles */}
              <Path d="M38 32 C29 32 29 46 40 46" fill="none" stroke={palette.orange} strokeWidth={3} strokeLinecap="round" />
              <Path d="M62 32 C71 32 71 46 60 46" fill="none" stroke={palette.orange} strokeWidth={3} strokeLinecap="round" />
              {/* trophy cup */}
              <Path
                d="M37 28 L63 28 L61 46 C61 54 55 59 50 59 C45 59 39 54 39 46 Z"
                fill={palette.yellow}
                stroke={palette.primaryNavy}
                strokeWidth={2}
                strokeLinejoin="round"
              />
              {/* star on cup */}
              {sparkle('trophy-star', 50, 41, 6, palette.orange)}
              {/* stem + base */}
              <Rect x={47} y={59} width={6} height={7} fill={palette.darkOrange} />
              <Rect x={40} y={66} width={20} height={6} rx={2} fill={palette.orange} stroke={palette.primaryNavy} strokeWidth={2} />
              {/* unlocked environment tile */}
              <Rect x={34} y={80} width={32} height={15} rx={3} fill={palette.secondaryNavy} stroke={palette.mutedBlue} strokeWidth={1.5} />
              <Rect x={36} y={82} width={28} height={6} rx={2} fill={palette.purple} opacity={0.9} />
              {/* sparkles */}
              {sparkle('r1', 24, 26, 3, palette.white)}
              {sparkle('r2', 78, 22, 3.4, palette.yellow)}
              {sparkle('r3', 80, 52, 2.6, palette.white)}
              {sparkle('r4', 20, 54, 2.6, palette.yellow)}
            </G>,
          )}
        </>
      );
  }
}

const styles = StyleSheet.create({
  root: { position: 'relative' },
});

export default OnboardingHero;
