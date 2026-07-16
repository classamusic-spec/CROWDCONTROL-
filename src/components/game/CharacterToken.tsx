import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { CrowdSprite } from '@/components/game/CrowdSprite';
import { DirectionArrow } from '@/components/game/DirectionArrow';
import { palette, theme } from '@/data/theme';
import type { CrowdCharacter, Direction } from '@/types/game';

/**
 * A single tappable character on the board. Handles its own animations:
 * anticipation squash + directional exit on clear, shake on blocked, and a
 * hint ring pulse. All animations are skipped when `reducedMotion` is set
 * (state still changes instantly — no information is motion-only).
 */
export type CharacterTokenProps = {
  character: CrowdCharacter;
  cellSize: number;
  boardSize: number;
  reducedMotion: boolean;
  isHint: boolean;
  /** Increments when THIS token is tapped-and-blocked, to trigger a shake. */
  blockedNonce: number;
  onPress: () => void;
};

const EXIT_DELTA: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export function CharacterToken({
  character,
  cellSize,
  boardSize,
  reducedMotion,
  isHint,
  blockedNonce,
  onPress,
}: CharacterTokenProps) {
  const cleared = character.status === 'cleared';
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const opacity = useSharedValue(cleared ? 0 : 1);
  const scale = useSharedValue(1);
  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0);

  // Exit animation on clear.
  useEffect(() => {
    if (!cleared) {
      tx.value = 0;
      ty.value = 0;
      opacity.value = 1;
      scale.value = 1;
      return;
    }
    const delta = EXIT_DELTA[character.direction];
    const distance = boardSize + cellSize;
    if (reducedMotion) {
      opacity.value = 0;
      return;
    }
    // anticipation squash, then slide off + fade.
    scale.value = withSequence(
      withTiming(0.86, { duration: 90 }),
      withTiming(1.05, { duration: 90 }),
    );
    tx.value = withTiming(delta.x * distance, { duration: theme.motion.base });
    ty.value = withTiming(delta.y * distance, { duration: theme.motion.base });
    opacity.value = withTiming(0, { duration: theme.motion.base });
  }, [cleared, character.direction, boardSize, cellSize, reducedMotion, opacity, scale, tx, ty]);

  // Shake on blocked.
  useEffect(() => {
    if (blockedNonce === 0 || cleared) return;
    if (reducedMotion) return;
    const amp = cellSize * 0.12;
    tx.value = withSequence(
      withTiming(-amp, { duration: 45 }),
      withTiming(amp, { duration: 45 }),
      withTiming(-amp * 0.6, { duration: 45 }),
      withTiming(0, { duration: 45 }),
    );
  }, [blockedNonce, cleared, reducedMotion, cellSize, tx]);

  // Hint ring pulse.
  useEffect(() => {
    if (isHint && !reducedMotion) {
      ringOpacity.value = 1;
      ringScale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 500 }),
          withTiming(1, { duration: 500 }),
        ),
        -1,
        true,
      );
    } else {
      ringOpacity.value = isHint ? 1 : 0;
      ringScale.value = 1;
    }
  }, [isHint, reducedMotion, ringOpacity, ringScale]);

  const tokenStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));
  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }));

  const left = character.column * cellSize;
  const top = character.row * cellSize;
  const pad = cellSize * 0.08;

  return (
    <Animated.View
      pointerEvents={cleared ? 'none' : 'auto'}
      style={[styles.cell, { width: cellSize, height: cellSize, left, top }, tokenStyle]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.ring,
          { width: cellSize - pad, height: cellSize - pad, borderRadius: (cellSize - pad) / 2 },
          ringStyle,
        ]}
      />
      <Pressable
        onPress={onPress}
        disabled={cleared}
        accessibilityRole="button"
        accessibilityLabel={`Character facing ${character.direction}`}
        accessibilityHint="Tap to clear when the path ahead is empty"
        style={styles.press}
      >
        <View style={styles.spriteWrap}>
          <CrowdSprite variant={character.characterVariant} size={cellSize - pad * 2} facing="back" />
          <View style={styles.arrow}>
            <DirectionArrow direction={character.direction} size={cellSize * 0.34} />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cell: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  press: { flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' },
  spriteWrap: { alignItems: 'center', justifyContent: 'center' },
  arrow: { position: 'absolute', top: -2, alignSelf: 'center' },
  ring: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: palette.yellow,
    backgroundColor: 'rgba(255,201,40,0.12)',
  },
});

export default CharacterToken;
