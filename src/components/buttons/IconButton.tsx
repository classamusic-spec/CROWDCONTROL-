import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Icon, type IconName } from '@/components/icons';
import { palette, theme } from '@/data/theme';

/** Circular icon control with press feedback; used for Undo/Hint/Restart/Pause. */
export type IconButtonProps = {
  icon: IconName;
  onPress?: () => void;
  label: string;
  caption?: string;
  disabled?: boolean;
  tint?: string;
  size?: number;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function IconButton({
  icon,
  onPress,
  label,
  caption,
  disabled = false,
  tint = palette.white,
  size = 56,
}: IconButtonProps) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <View style={styles.wrap}>
      <AnimatedPressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => {
          scale.value = withTiming(0.92, { duration: theme.motion.fast });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: theme.motion.fast });
        }}
        style={[
          styles.button,
          theme.shadow.sm,
          { width: size, height: size, borderRadius: size / 2, opacity: disabled ? 0.4 : 1 },
          style,
        ]}
      >
        <Icon name={icon} size={size * 0.44} color={tint} />
      </AnimatedPressable>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 4 },
  button: {
    backgroundColor: palette.panelNavy,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.secondaryNavy,
  },
  caption: { color: palette.mutedBlue, fontSize: 12, fontWeight: '700' },
});

export default IconButton;
