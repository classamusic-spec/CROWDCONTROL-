import { StyleSheet, View } from 'react-native';

import { palette, theme } from '@/data/theme';

/**
 * A row of pagination dots. The active dot is a wide brightBlue pill; the rest
 * are small muted dots. The row exposes a single "Page N of M" label to
 * assistive tech (individual dots are decorative).
 */
export type ProgressDotsProps = {
  count: number;
  index: number;
};

export function ProgressDots({ count, index }: ProgressDotsProps) {
  return (
    <View
      style={styles.row}
      accessibilityRole="progressbar"
      accessibilityLabel={`Page ${index + 1} of ${count}`}
    >
      {Array.from({ length: count }, (_, i) => {
        const active = i === index;
        return (
          <View
            key={i}
            style={[styles.dot, active ? styles.active : styles.inactive]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: theme.radius.pill,
  },
  active: {
    width: 22,
    backgroundColor: palette.brightBlue,
  },
  inactive: {
    width: 8,
    backgroundColor: palette.mutedBlue,
    opacity: 0.5,
  },
});

export default ProgressDots;
