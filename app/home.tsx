import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/buttons/Button';
import { BottomNav } from '@/components/navigation/BottomNav';
import { CrowdSprite } from '@/components/game/CrowdSprite';
import { Icon } from '@/components/icons';
import { Logo } from '@/components/branding/Logo';
import { Panel } from '@/components/cards/Panel';
import { ScreenBackground } from '@/components/navigation/ScreenBackground';
import { bundledLevels } from '@/data/bundledLevels';
import { palette, theme } from '@/data/theme';
import { useDailyChallenge } from '@/hooks/useDailyChallenge';
import { useProgress } from '@/hooks/useProgress';

const GROUP = ['bluehoodie', 'pinkpigtail', 'greencap', 'orangeheadphones', 'yellowoveralls'];

export default function Home() {
  const router = useRouter();
  const { progress } = useProgress();
  const daily = useDailyChallenge();

  const continueLevel = useMemo(() => {
    for (let n = 1; n <= bundledLevels.length; n++) {
      if (n > progress.highestUnlocked) break;
      if (!progress.levels[n]?.completed) return n;
    }
    return Math.min(progress.highestUnlocked, bundledLevels.length);
  }, [progress]);

  return (
    <ScreenBackground environmentId={progress.selectedEnvironment} contentStyle={styles.root}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Logo size="md" />
        </View>

        {/* Stat strip */}
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Icon name="star" size={20} color={palette.yellow} />
            <Text style={styles.statValue}>{progress.totalStars}</Text>
            <Text style={styles.statLabel}>Stars</Text>
          </View>
          <View style={styles.stat}>
            <Icon name="streak" size={20} color={palette.orange} />
            <Text style={styles.statValue}>{daily.currentStreak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.stat}>
            <Icon name="levels" size={20} color={palette.brightBlue} />
            <Text style={styles.statValue}>{progress.highestUnlocked}</Text>
            <Text style={styles.statLabel}>Unlocked</Text>
          </View>
        </View>

        {/* Character group */}
        <View style={styles.crowd}>
          {GROUP.map((v, i) => (
            <View key={v} style={{ marginLeft: i === 0 ? 0 : -14, zIndex: GROUP.length - i }}>
              <CrowdSprite variant={v} size={64} />
            </View>
          ))}
        </View>

        {/* Primary actions */}
        <Panel tone="navy" style={styles.actions}>
          <Button
            label={`Continue — Level ${continueLevel}`}
            icon="continue"
            variant="success"
            fullWidth
            onPress={() => router.push({ pathname: '/game', params: { level: String(continueLevel) } })}
          />
          <Button
            label={daily.completed ? 'Daily Puzzle — Done ✓' : 'Daily Puzzle'}
            icon="calendar"
            variant="primary"
            fullWidth
            onPress={() => router.push('/daily')}
          />
          <View style={styles.actionRow}>
            <Button
              label="Levels"
              icon="levels"
              variant="secondary"
              style={styles.flexBtn}
              onPress={() => router.push('/levels')}
            />
            <Button
              label="Customize"
              icon="customize"
              variant="secondary"
              style={styles.flexBtn}
              onPress={() => router.push('/customize')}
            />
          </View>
        </Panel>
      </View>

      <BottomNav />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: { justifyContent: 'space-between' },
  content: { flex: 1, paddingHorizontal: theme.layout.screenPadding, gap: 20, justifyContent: 'center' },
  header: { alignItems: 'center', marginTop: 8 },
  stats: { flexDirection: 'row', justifyContent: 'center', gap: 14 },
  stat: {
    alignItems: 'center',
    backgroundColor: palette.panelNavy,
    borderRadius: theme.radius.lg,
    paddingVertical: 12,
    paddingHorizontal: 18,
    minWidth: 88,
    ...theme.shadow.sm,
  },
  statValue: { color: palette.white, fontSize: 22, fontWeight: '900', marginTop: 2 },
  statLabel: { color: palette.mutedBlue, fontSize: 12, fontWeight: '600' },
  crowd: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end' },
  actions: { gap: 12 },
  actionRow: { flexDirection: 'row', gap: 12 },
  flexBtn: { flex: 1 },
});
