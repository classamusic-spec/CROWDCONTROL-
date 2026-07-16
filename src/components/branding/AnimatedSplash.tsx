import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Logo } from '@/components/branding/Logo';
import { CrowdSprite } from '@/components/game/CrowdSprite';
import { DirectionArrow } from '@/components/game/DirectionArrow';
import { palette } from '@/data/theme';
import type { Direction } from '@/types/game';

/**
 * Custom animated in-app splash. Assembles the logo, drifts direction arrows,
 * bounces a few characters in, and sweeps a shine — then calls onDone. A
 * reduced-motion path shows the final composition and finishes quickly. No
 * white flash: the whole screen is the navy gradient from frame one.
 */
export type AnimatedSplashProps = {
  reducedMotion?: boolean;
  onDone?: () => void;
  /** Minimum time to show even when boot finishes instantly (ms). */
  minVisibleMs?: number;
};

const ARROWS: Direction[] = ['up', 'right', 'down', 'left'];
const SPRITES = ['bluehoodie', 'pinkpigtail', 'greencap', 'orangeheadphones'];

export function AnimatedSplash({ reducedMotion = false, onDone, minVisibleMs = 2200 }: AnimatedSplashProps) {
  const logoScale = useSharedValue(reducedMotion ? 1 : 0.6);
  const logoOpacity = useSharedValue(reducedMotion ? 1 : 0);
  const arrowDrift = useSharedValue(reducedMotion ? 1 : 0);
  const spriteRise = useSharedValue(reducedMotion ? 1 : 0);
  const shineX = useSharedValue(-1);

  useEffect(() => {
    const finish = () => onDone?.();
    if (reducedMotion) {
      const t = setTimeout(finish, Math.min(minVisibleMs, 800));
      return () => clearTimeout(t);
    }
    logoOpacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) });
    logoScale.value = withSequence(
      withTiming(1.06, { duration: 500, easing: Easing.out(Easing.back(1.6)) }),
      withTiming(1, { duration: 200 }),
    );
    arrowDrift.value = withDelay(300, withTiming(1, { duration: 600 }));
    spriteRise.value = withDelay(650, withTiming(1, { duration: 600, easing: Easing.out(Easing.back(2)) }));
    shineX.value = withDelay(1200, withTiming(1.4, { duration: 700 }));
    const t = setTimeout(() => runOnJS(finish)(), minVisibleMs);
    return () => clearTimeout(t);
  }, [reducedMotion, onDone, minVisibleMs, logoOpacity, logoScale, arrowDrift, spriteRise, shineX]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));
  const arrowsStyle = useAnimatedStyle(() => ({
    opacity: arrowDrift.value,
    transform: [{ translateY: (1 - arrowDrift.value) * 14 }],
  }));
  const spritesStyle = useAnimatedStyle(() => ({
    opacity: spriteRise.value,
    transform: [{ translateY: (1 - spriteRise.value) * 40 }],
  }));
  const shineStyle = useAnimatedStyle(() => ({
    opacity: shineX.value > -1 && shineX.value < 1.4 ? 0.5 : 0,
    transform: [{ translateX: shineX.value * 220 }, { rotate: '18deg' }],
  }));

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[palette.secondaryNavy, palette.primaryNavy]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.center}>
        <Animated.View style={[styles.arrows, arrowsStyle]}>
          {ARROWS.map((d) => (
            <DirectionArrow key={d} direction={d} size={26} />
          ))}
        </Animated.View>

        <Animated.View style={logoStyle}>
          <Logo size="lg" />
          <Animated.View style={[styles.shine, shineStyle]} />
        </Animated.View>

        <Animated.View style={[styles.sprites, spritesStyle]}>
          {SPRITES.map((v) => (
            <CrowdSprite key={v} variant={v} size={52} />
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFillObject, backgroundColor: palette.primaryNavy },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 26 },
  arrows: { flexDirection: 'row', gap: 14 },
  sprites: { flexDirection: 'row', gap: 4 },
  shine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 40,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
});

export default AnimatedSplash;
