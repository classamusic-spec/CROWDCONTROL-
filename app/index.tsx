import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Logo } from '@/components/branding/Logo';
import { EnvironmentBackdrop } from '@/components/game/EnvironmentBackdrop';
import { useTheme } from '@/hooks/useTheme';

/**
 * Entry route. In later phases this becomes the boot gate that shows the
 * animated splash and routes to onboarding or home. For now it renders the
 * branded shell so the navigation stack has a real, styled first screen
 * (no plain white flash, no dead route).
 */
export default function Index() {
  const theme = useTheme();
  return (
    <View style={styles.fill}>
      <EnvironmentBackdrop environmentId="concert" />
      <SafeAreaView style={styles.center}>
        <Logo size="lg" />
        <Text style={[styles.tagline, { color: theme.colors.mutedBlue }]}>
          Clear the crowd. Find the right way out.
        </Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18 },
  tagline: { fontSize: 15, fontWeight: '600', marginTop: 8 },
});
