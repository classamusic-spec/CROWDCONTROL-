import { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { palette } from '@/data/theme';

/**
 * Lightweight confetti burst for the results screen. A fixed set of pieces fall
 * and rotate once. Renders nothing when `reducedMotion` (no essential info is
 * conveyed by the effect). Pure visual.
 */
export type ConfettiProps = {
  count?: number;
  reducedMotion?: boolean;
};

const COLORS = [
  palette.brightBlue,
  palette.green,
  palette.orange,
  palette.yellow,
  palette.purple,
  palette.pink,
  palette.teal,
];

function Piece({ index, width, height }: { index: number; width: number; height: number }) {
  const progress = useSharedValue(0);
  // Deterministic pseudo-random from index (no Math.random for stable renders).
  const seed = (index * 9301 + 49297) % 233280;
  const rnd = seed / 233280;
  const startX = rnd * width;
  const drift = (rnd - 0.5) * 120;
  const size = 7 + Math.floor(rnd * 8);
  const color = COLORS[index % COLORS.length] as string;
  const delay = Math.floor(rnd * 400);
  const rotateTo = 360 + Math.floor(rnd * 540);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, { duration: 1600, easing: Easing.in(Easing.quad) }),
    );
  }, [progress, delay]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: startX + drift * progress.value },
      { translateY: -20 + (height + 60) * progress.value },
      { rotate: `${rotateTo * progress.value}deg` },
    ],
    opacity: progress.value < 0.9 ? 1 : (1 - progress.value) * 10,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        { position: 'absolute', width: size, height: size * 0.6, backgroundColor: color, borderRadius: 2 },
        style,
      ]}
    />
  );
}

export function Confetti({ count = 40, reducedMotion = false }: ConfettiProps) {
  const { width, height } = useWindowDimensions();
  if (reducedMotion) return null;
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {Array.from({ length: count }, (_, i) => (
        <Piece key={i} index={i} width={width} height={height} />
      ))}
    </View>
  );
}

export default Confetti;
