import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import { BottomNav } from '@/components/navigation/BottomNav';
import { ScreenBackground } from '@/components/navigation/ScreenBackground';
import { Panel } from '@/components/cards/Panel';
import { Icon, type IconName } from '@/components/icons';
import { palette, theme } from '@/data/theme';
import { useProgress } from '@/hooks/useProgress';
import { useSettings } from '@/hooks/useSettings';
import type { ThemePreference } from '@/types/storage';

/** A single labelled toggle row backed by a native Switch. */
type ToggleRowProps = {
  icon: IconName;
  label: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
};

function ToggleRow({ icon, label, value, onValueChange }: ToggleRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLead}>
        <Icon name={icon} size={22} color={palette.mutedBlue} />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        accessibilityRole="switch"
        accessibilityLabel={label}
        accessibilityState={{ checked: value }}
        trackColor={{ false: palette.secondaryNavy, true: palette.green }}
        thumbColor={palette.white}
        ios_backgroundColor={palette.secondaryNavy}
      />
    </View>
  );
}

/** A pressable action row with an icon, label, and trailing chevron/value. */
type ActionRowProps = {
  icon: IconName;
  label: string;
  onPress: () => void;
  value?: string;
  danger?: boolean;
  hint?: string;
};

function ActionRow({ icon, label, onPress, value, danger, hint }: ActionRowProps) {
  const tint = danger ? palette.red : palette.mutedBlue;
  const labelColor = danger ? palette.red : palette.white;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={hint ? `${label}. ${hint}` : label}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <View style={styles.rowLead}>
        <Icon name={icon} size={22} color={tint} />
        <Text style={[styles.rowLabel, { color: labelColor }]}>{label}</Text>
      </View>
      <View style={styles.rowTrail}>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
        {!danger ? <Icon name="arrow" size={18} color={palette.mutedBlue} /> : null}
      </View>
    </Pressable>
  );
}

const THEME_ORDER: ThemePreference[] = ['system', 'dark', 'light'];
const THEME_LABEL: Record<ThemePreference, string> = {
  system: 'System',
  dark: 'Dark',
  light: 'Light',
};

export default function Settings() {
  const router = useRouter();
  const { settings, updateSettings } = useSettings();
  const { progress, resetProgress } = useProgress();

  const version = Constants.expoConfig?.version ?? '1.0.0';

  const cycleTheme = useCallback(() => {
    const idx = THEME_ORDER.indexOf(settings.theme);
    const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length] ?? 'system';
    updateSettings({ theme: next });
  }, [settings.theme, updateSettings]);

  const confirmReset = useCallback(() => {
    Alert.alert(
      'Reset Progress',
      'This permanently clears your levels, stars, streaks, and stats. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => resetProgress() },
      ],
    );
  }, [resetProgress]);

  return (
    <ScreenBackground environmentId={progress.selectedEnvironment}>
      <View style={styles.container}>
        <Text style={styles.title} accessibilityRole="header">
          Settings
        </Text>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionHeader}>Audio &amp; Feedback</Text>
          <Panel tone="navy" padded={false} style={styles.group}>
            <ToggleRow
              icon="sound"
              label="Sound"
              value={settings.sound}
              onValueChange={(v) => updateSettings({ sound: v })}
            />
            <View style={styles.divider} />
            <ToggleRow
              icon="music"
              label="Music"
              value={settings.music}
              onValueChange={(v) => updateSettings({ music: v })}
            />
            <View style={styles.divider} />
            <ToggleRow
              icon="haptics"
              label="Haptics"
              value={settings.haptics}
              onValueChange={(v) => updateSettings({ haptics: v })}
            />
            <View style={styles.divider} />
            <ToggleRow
              icon="reducedmotion"
              label="Reduced Motion"
              value={settings.reducedMotion}
              onValueChange={(v) => updateSettings({ reducedMotion: v })}
            />
          </Panel>

          <Text style={styles.sectionHeader}>Appearance</Text>
          <Panel tone="navy" padded={false} style={styles.group}>
            <ActionRow
              icon="theme"
              label="Theme"
              value={THEME_LABEL[settings.theme]}
              onPress={cycleTheme}
              hint="Cycles between system, dark, and light"
            />
          </Panel>

          <Text style={styles.sectionHeader}>Learn</Text>
          <Panel tone="navy" padded={false} style={styles.group}>
            <ActionRow
              icon="replay"
              label="Replay Onboarding"
              onPress={() => router.push('/onboarding')}
            />
            <View style={styles.divider} />
            <ActionRow
              icon="hint"
              label="Replay Tutorial"
              onPress={() => router.push('/tutorial')}
            />
          </Panel>

          <Text style={styles.sectionHeader}>About &amp; Privacy</Text>
          <Panel tone="navy" padded={false} style={styles.group}>
            <ActionRow
              icon="lock"
              label="Privacy Policy"
              onPress={() => router.push('/privacy')}
            />
            <View style={styles.divider} />
            <ActionRow
              icon="trophy"
              label="About"
              onPress={() => router.push('/about')}
            />
          </Panel>

          <Text style={styles.sectionHeader}>Data</Text>
          <Panel tone="navy" padded={false} style={styles.group}>
            <ActionRow
              icon="restart"
              label="Reset Progress"
              danger
              onPress={confirmReset}
              hint="Clears all saved progress"
            />
          </Panel>

          <View style={styles.versionRow} accessible accessibilityLabel={`Version ${version}`}>
            <Text style={styles.versionText}>Version {version}</Text>
          </View>
        </ScrollView>
      </View>

      <BottomNav />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: theme.layout.screenPadding },
  title: {
    ...theme.typography.title,
    color: palette.white,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: theme.spacing.xl },
  sectionHeader: {
    ...theme.typography.label,
    color: palette.mutedBlue,
    textTransform: 'uppercase',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
  group: { overflow: 'hidden' },
  row: {
    minHeight: theme.layout.minTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  rowPressed: { backgroundColor: palette.panelNavy },
  rowLead: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, flexShrink: 1 },
  rowLabel: { ...theme.typography.body, color: palette.white, flexShrink: 1 },
  rowTrail: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  rowValue: { ...theme.typography.label, color: palette.brightBlue },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: palette.panelNavy, marginLeft: theme.spacing.md },
  versionRow: { alignItems: 'center', marginTop: theme.spacing.xl },
  versionText: { ...theme.typography.caption, color: palette.mutedBlue },
});
