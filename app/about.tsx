import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/buttons/Button';
import { Logo } from '@/components/branding/Logo';
import { Panel } from '@/components/cards/Panel';
import { ScreenBackground } from '@/components/navigation/ScreenBackground';
import { palette, theme } from '@/data/theme';
import { useProgress } from '@/hooks/useProgress';

const HOW_TO_PLAY: string[] = [
  'Tap a person on the edge of the crowd to walk them toward an exit.',
  'Each move clears a path — send people out the right way to open space.',
  'Plan your order: a blocked mover has to wait for the crowd ahead.',
  'Clear everyone in as few moves and mistakes as possible to earn 3 stars.',
];

export default function About() {
  const router = useRouter();
  const { progress } = useProgress();

  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <ScreenBackground environmentId={progress.selectedEnvironment}>
      <View style={styles.header}>
        <Button
          label="Back"
          icon="back"
          variant="ghost"
          size="sm"
          onPress={() => router.back()}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoWrap}>
          <Logo size="md" />
        </View>
        <Text style={styles.tagline}>Clear the crowd. Find the right way out.</Text>

        <Panel tone="navy" style={styles.section}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            About the game
          </Text>
          <Text style={styles.body}>
            Crowd Control Daily is a cozy logic puzzle. Guide a packed crowd out of
            a venue one careful move at a time. Every level is a small, solvable
            knot — read the room, pick your order, and clear the floor.
          </Text>
        </Panel>

        <Panel tone="navy" style={styles.section}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            How to play
          </Text>
          <View style={styles.bullets}>
            {HOW_TO_PLAY.map((line, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>{`•`}</Text>
                <Text style={[styles.body, styles.bulletText]}>{line}</Text>
              </View>
            ))}
          </View>
        </Panel>

        <Panel tone="navy" style={styles.section}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            Credits
          </Text>
          <Text style={styles.body}>Made with care.</Text>
        </Panel>

        <View style={styles.linkWrap}>
          <Button
            label="Privacy Policy"
            icon="lock"
            variant="secondary"
            fullWidth
            onPress={() => router.push('/privacy')}
          />
        </View>

        <View
          style={styles.versionRow}
          accessible
          accessibilityLabel={`Version ${version}`}
        >
          <Text style={styles.versionText}>Version {version}</Text>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.spacing.sm,
    alignItems: 'flex-start',
  },
  content: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.md,
  },
  logoWrap: { alignItems: 'center', marginTop: theme.spacing.md },
  tagline: {
    ...theme.typography.subheading,
    color: palette.mutedBlue,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  section: { gap: theme.spacing.sm },
  sectionTitle: { ...theme.typography.subheading, color: palette.white },
  body: { ...theme.typography.body, color: palette.cream },
  bullets: { gap: theme.spacing.sm },
  bulletRow: { flexDirection: 'row', gap: theme.spacing.sm },
  bulletDot: { ...theme.typography.body, color: palette.brightBlue },
  bulletText: { flex: 1 },
  linkWrap: { marginTop: theme.spacing.sm },
  versionRow: { alignItems: 'center', marginTop: theme.spacing.md },
  versionText: { ...theme.typography.caption, color: palette.mutedBlue },
});
