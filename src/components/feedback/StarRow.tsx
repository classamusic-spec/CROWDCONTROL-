import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

import { Icon } from '@/components/icons';
import { palette } from '@/data/theme';

/**
 * Row of 1-3 stars. `earned` are filled gold; the rest are dim. When `animate`
 * is set, earned stars pop in sequentially (reduced-motion callers pass false).
 */
export type StarRowProps = {
  earned: number;
  size?: number;
  animate?: boolean;
};

function Star({ filled, index, size, animate }: { filled: boolean; index: number; size: number; animate: boolean }) {
  const scale = useSharedValue(animate ? 0 : 1);
  useEffect(() => {
    if (animate) {
      scale.value = withDelay(index * 220, withSpring(1, { damping: 8, stiffness: 140 }));
    } else {
      scale.value = 1;
    }
  }, [animate, index, scale]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={style}>
      <Icon name="star" size={size} color={filled ? palette.yellow : palette.panelNavy} />
    </Animated.View>
  );
}

export function StarRow({ earned, size = 36, animate = false }: StarRowProps) {
  return (
    <View
      style={styles.row}
      accessibilityRole="image"
      accessibilityLabel={`${earned} of 3 stars`}
    >
      {[0, 1, 2].map((i) => (
        <Star key={i} index={i} filled={i < earned} size={size} animate={animate} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, alignItems: 'center' },
});

export default StarRow;
