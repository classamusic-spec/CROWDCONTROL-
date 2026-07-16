import { StyleSheet, Text, View } from 'react-native';

import { Emblem } from '@/components/branding/Emblem';
import { theme } from '@/data/theme';

/**
 * The primary logo lockup. Wordmark text is rendered NATIVELY (never baked into
 * an image, per ART_BIBLE): "Crowd" / "Control" stacked with a "DAILY" badge.
 */
export type LogoProps = {
  size?: 'sm' | 'md' | 'lg';
  showEmblem?: boolean;
};

const SCALE = {
  sm: { word: 22, badge: 10, emblem: 40 },
  md: { word: 34, badge: 13, emblem: 64 },
  lg: { word: 46, badge: 16, emblem: 92 },
} as const;

export function Logo({ size = 'md', showEmblem = true }: LogoProps) {
  const s = SCALE[size];
  return (
    <View
      style={styles.row}
      accessible
      accessibilityRole="header"
      accessibilityLabel="Crowd Control Daily"
    >
      {showEmblem ? <Emblem size={s.emblem} /> : null}
      <View style={styles.words}>
        <Text style={[styles.word, { fontSize: s.word, color: theme.colors.white }]}>
          Crowd
        </Text>
        <View style={styles.controlRow}>
          <Text
            style={[styles.word, { fontSize: s.word, color: theme.colors.brightBlue }]}
          >
            Control
          </Text>
          <View style={[styles.badge, { backgroundColor: theme.colors.orange }]}>
            <Text
              style={[styles.badgeText, { fontSize: s.badge, color: theme.colors.primaryNavy }]}
            >
              DAILY
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  words: { justifyContent: 'center' },
  word: { fontWeight: '900', letterSpacing: 0.5, lineHeight: undefined },
  controlRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  badgeText: { fontWeight: '900', letterSpacing: 2 },
});

export default Logo;
