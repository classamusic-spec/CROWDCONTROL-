import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Icon, type IconName } from '@/components/icons';
import { palette, theme } from '@/data/theme';

/**
 * Premium button with press-scale animation, gradient fills, and variants.
 * Respects a minimum 44pt touch target and exposes an accessibility role.
 */

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
};

const GRADIENTS: Record<ButtonVariant, [string, string]> = {
  primary: [palette.brightBlue, palette.deepBlue],
  secondary: [palette.panelNavy, palette.secondaryNavy],
  success: [palette.green, palette.darkGreen],
  danger: [palette.red, '#C62828'],
  ghost: ['transparent', 'transparent'],
};

const HEIGHTS: Record<ButtonSize, number> = { sm: 44, md: 52, lg: 60 };
const FONTS: Record<ButtonSize, number> = { sm: 15, md: 17, lg: 19 };

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const colors = GRADIENTS[variant];
  const isGhost = variant === 'ghost';
  const textColor = isGhost ? palette.mutedBlue : palette.white;

  const containerStyle = useMemo<ViewStyle>(
    () => ({
      height: HEIGHTS[size],
      borderRadius: theme.radius.lg,
      opacity: disabled ? 0.5 : 1,
      alignSelf: fullWidth ? 'stretch' : 'flex-start',
      ...(isGhost
        ? { borderWidth: 2, borderColor: palette.panelNavy }
        : theme.shadow.md),
    }),
    [size, disabled, fullWidth, isGhost],
  );

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withTiming(0.96, { duration: theme.motion.fast });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: theme.motion.fast });
      }}
      style={[containerStyle, animatedStyle, style]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.fill}
      >
        <View style={styles.content}>
          {icon ? <Icon name={icon} size={FONTS[size] + 4} color={textColor} /> : null}
          <Text style={[styles.label, { fontSize: FONTS[size], color: textColor }]}>
            {label}
          </Text>
        </View>
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    borderRadius: theme.radius.lg,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  label: { fontWeight: '800', letterSpacing: 0.3 },
});

export default Button;
