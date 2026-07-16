import { StyleSheet, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/icons';
import { palette, theme } from '@/data/theme';

/** Compact icon + value chip used in the gameplay HUD and stat rows. */
export type HudPillProps = {
  icon: IconName;
  value: string;
  label?: string;
  tint?: string;
};

export function HudPill({ icon, value, label, tint = palette.mutedBlue }: HudPillProps) {
  return (
    <View
      style={styles.pill}
      accessible
      accessibilityLabel={label ? `${label}: ${value}` : value}
    >
      <Icon name={icon} size={18} color={tint} />
      <Text style={styles.value}>{value}</Text>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: palette.panelNavy,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    ...theme.shadow.sm,
  },
  value: { color: palette.white, fontWeight: '800', fontSize: 15 },
  label: { color: palette.mutedBlue, fontWeight: '600', fontSize: 12 },
});

export default HudPill;
