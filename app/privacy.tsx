import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/buttons/Button';
import { Panel } from '@/components/cards/Panel';
import { ScreenBackground } from '@/components/navigation/ScreenBackground';
import { palette, theme } from '@/data/theme';
import { useProgress } from '@/hooks/useProgress';

type Point = { title: string; body: string };

const POINTS: Point[] = [
  {
    title: 'No account required',
    body: 'You can play everything without signing up, signing in, or giving us your name or email.',
  },
  {
    title: 'No location collection',
    body: 'The game never requests or records your location.',
  },
  {
    title: 'No contacts access',
    body: 'We do not read, upload, or use your contacts or address book.',
  },
  {
    title: 'No tracking SDKs',
    body: 'There are no third-party analytics or tracking SDKs that profile you or follow you across apps.',
  },
  {
    title: 'No advertising identifier',
    body: 'We do not collect your device advertising identifier (IDFA / GAID) and we do not use it for ads.',
  },
  {
    title: 'Progress stays on your device',
    body: 'Your levels, stars, streaks, and settings are stored locally on this device only — not on our servers.',
  },
  {
    title: 'Removing the app may remove progress',
    body: 'Because everything is stored locally, deleting the app can permanently erase your saved progress.',
  },
  {
    title: 'Works fully offline',
    body: 'The game runs entirely on your device and does not need an internet connection to play.',
  },
];

export default function Privacy() {
  const router = useRouter();
  const { progress } = useProgress();

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
        <Text style={styles.title} accessibilityRole="header">
          Privacy Policy
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          Crowd Control Daily is built to be private by default. In plain terms:
          we do not collect your personal data.
        </Text>

        <Panel tone="navy" style={styles.panel}>
          {POINTS.map((point, i) => (
            <View key={point.title}>
              {i > 0 ? <View style={styles.divider} /> : null}
              <View style={styles.point}>
                <Text style={styles.pointTitle}>{point.title}</Text>
                <Text style={styles.pointBody}>{point.body}</Text>
              </View>
            </View>
          ))}
        </Panel>

        <Text style={styles.updated}>Updated 2026</Text>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  title: { ...theme.typography.title, color: palette.white },
  content: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.md,
  },
  intro: { ...theme.typography.body, color: palette.cream },
  panel: { gap: theme.spacing.xs },
  point: { paddingVertical: theme.spacing.sm, gap: theme.spacing.xs },
  pointTitle: { ...theme.typography.subheading, color: palette.white },
  pointBody: { ...theme.typography.body, color: palette.cream },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: palette.panelNavy },
  updated: {
    ...theme.typography.caption,
    color: palette.mutedBlue,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
});
