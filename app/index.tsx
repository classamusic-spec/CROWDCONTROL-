import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/useTheme';

/**
 * Entry route. In later phases this becomes the boot gate that shows the
 * animated splash and routes to onboarding or home. For the foundation phase
 * it renders the branded shell so the navigation stack has a real, styled
 * first screen (no plain white flash, no dead route).
 */
export default function Index() {
  const theme = useTheme();
  return (
    <LinearGradient
      colors={[theme.colors.primaryNavy, theme.colors.secondaryNavy]}
      style={styles.fill}
    >
      <SafeAreaView style={styles.center}>
        <View
          accessibilityRole="header"
          style={styles.brandBlock}
          accessible
          accessibilityLabel="Crowd Control Daily"
        >
          <Text style={[styles.brand, { color: theme.colors.white }]}>Crowd</Text>
          <Text style={[styles.brand, { color: theme.colors.brightBlue }]}>Control</Text>
          <View style={[styles.badge, { backgroundColor: theme.colors.orange }]}>
            <Text style={[styles.badgeText, { color: theme.colors.primaryNavy }]}>
              DAILY
            </Text>
          </View>
        </View>
        <Text style={[styles.tagline, { color: theme.colors.mutedBlue }]}>
          Clear the crowd. Find the right way out.
        </Text>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  brandBlock: { alignItems: 'center' },
  brand: { fontSize: 44, fontWeight: '900', letterSpacing: 0.5 },
  badge: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: { fontSize: 16, fontWeight: '900', letterSpacing: 3 },
  tagline: { fontSize: 15, fontWeight: '600', marginTop: 8 },
});
