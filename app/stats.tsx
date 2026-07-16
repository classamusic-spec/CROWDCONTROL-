import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Panel } from '@/components/cards/Panel';
import { Icon, type IconName } from '@/components/icons';
import { BottomNav } from '@/components/navigation/BottomNav';
import { ScreenBackground } from '@/components/navigation/ScreenBackground';
import { environments } from '@/data/environments';
import { palette, theme } from '@/data/theme';
import { useDailyChallenge } from '@/hooks/useDailyChallenge';
import { useProgress } from '@/hooks/useProgress';
import { addDays, todayUtc } from '@/utils/date';
import { formatTime } from '@/utils/formatting';

const TOTAL_LEVELS = 60;
const CALENDAR_DAYS = 28;

type StatTileProps = {
  icon: IconName;
  value: string;
  caption: string;
  tint?: string;
};

function StatTile({ icon, value, caption, tint = palette.brightBlue }: StatTileProps) {
  return (
    <Panel
      tone="navy"
      style={styles.tile}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`${caption}: ${value}`}
    >
      <View style={[styles.tileIcon, { backgroundColor: palette.panelNavy }]}>
        <Icon name={icon} size={22} color={tint} />
      </View>
      <Text style={styles.tileValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.tileCaption} numberOfLines={2}>
        {caption}
      </Text>
    </Panel>
  );
}

export default function Stats() {
  const { progress, statistics } = useProgress();
  const { currentStreak, longestStreak, history } = useDailyChallenge();

  const averageMistakes =
    statistics.totalMistakes / Math.max(1, statistics.gamesPlayed);

  const today = todayUtc();
  const calendar = Array.from({ length: CALENDAR_DAYS }, (_, i) =>
    addDays(today, -(CALENDAR_DAYS - 1 - i)),
  );

  return (
    <ScreenBackground environmentId={progress.selectedEnvironment}>
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title} accessibilityRole="header">
            Stats
          </Text>

          <View style={styles.grid}>
            <StatTile
              icon="levels"
              value={`${statistics.levelsCompleted} / ${TOTAL_LEVELS}`}
              caption="Levels Completed"
              tint={palette.brightBlue}
            />
            <StatTile
              icon="star"
              value={`${progress.totalStars}`}
              caption="Total Stars"
              tint={palette.yellow}
            />
            <StatTile
              icon="streak"
              value={`${currentStreak}`}
              caption="Current Streak"
              tint={palette.orange}
            />
            <StatTile
              icon="trophy"
              value={`${longestStreak}`}
              caption="Longest Streak"
              tint={palette.yellow}
            />
            <StatTile
              icon="remaining"
              value={`${progress.charactersCleared}`}
              caption="Characters Cleared"
              tint={palette.teal}
            />
            <StatTile
              icon="timer"
              value={formatTime(progress.playTimeMs)}
              caption="Play Time"
              tint={palette.green}
            />
            <StatTile
              icon="star"
              value={`${statistics.perfectLevels}`}
              caption="Perfect Levels"
              tint={palette.pink}
            />
            <StatTile
              icon="mistakes"
              value={averageMistakes.toFixed(1)}
              caption="Average Mistakes"
              tint={palette.red}
            />
          </View>

          <Panel tone="panel" style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="calendar" size={22} color={palette.white} />
              <Text style={styles.sectionTitle} accessibilityRole="header">
                Daily Calendar
              </Text>
            </View>
            <Text style={styles.sectionSub}>Last 4 weeks of daily challenges.</Text>
            <View
              style={styles.calendar}
              accessible
              accessibilityLabel="Daily challenge completion, last 28 days"
            >
              {calendar.map((date) => {
                const done = history[date]?.completed ?? false;
                return (
                  <View
                    key={date}
                    accessible
                    accessibilityLabel={`${date}: ${done ? 'completed' : 'not completed'}`}
                    style={[
                      styles.calendarCell,
                      { backgroundColor: done ? palette.green : palette.panelNavy },
                    ]}
                  />
                );
              })}
            </View>
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendSwatch, { backgroundColor: palette.green }]} />
                <Text style={styles.legendLabel}>Completed</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendSwatch, { backgroundColor: palette.panelNavy }]} />
                <Text style={styles.legendLabel}>Missed / upcoming</Text>
              </View>
            </View>
          </Panel>

          <Panel tone="panel" style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="levels" size={22} color={palette.white} />
              <Text style={styles.sectionTitle} accessibilityRole="header">
                Environment Progress
              </Text>
            </View>
            {environments.map((env) => {
              const unlocked = progress.highestUnlocked >= env.unlockLevel;
              return (
                <View
                  key={env.id}
                  accessible
                  accessibilityLabel={`${env.name}, ${
                    unlocked ? 'unlocked' : `locked, unlocks at level ${env.unlockLevel}`
                  }`}
                  style={styles.envRow}
                >
                  <View style={[styles.envDot, { backgroundColor: env.accent }]} />
                  <Text style={styles.envName} numberOfLines={1}>
                    {env.name}
                  </Text>
                  {unlocked ? (
                    <View style={styles.envStatus}>
                      <Icon name="trophy" size={18} color={palette.yellow} />
                      <Text style={[styles.envStatusLabel, { color: palette.green }]}>
                        Unlocked
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.envStatus}>
                      <Icon name="lock" size={18} color={palette.mutedBlue} />
                      <Text style={styles.envStatusLabel}>Lvl {env.unlockLevel}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </Panel>
        </ScrollView>
        <BottomNav />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  title: {
    ...theme.typography.title,
    color: palette.white,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: theme.spacing.md,
  },
  tile: {
    width: '48%',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  tileIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileValue: {
    ...theme.typography.heading,
    color: palette.white,
  },
  tileCaption: {
    ...theme.typography.caption,
    color: palette.mutedBlue,
  },
  section: {
    gap: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    ...theme.typography.subheading,
    color: palette.white,
  },
  sectionSub: {
    ...theme.typography.caption,
    color: palette.mutedBlue,
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarCell: {
    width: '12.5%',
    aspectRatio: 1,
    borderRadius: theme.radius.sm,
    marginRight: '1%',
    marginBottom: 6,
  },
  legend: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  legendSwatch: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },
  legendLabel: {
    ...theme.typography.caption,
    color: palette.mutedBlue,
  },
  envRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    minHeight: 44,
  },
  envDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  envName: {
    ...theme.typography.body,
    color: palette.white,
    flex: 1,
  },
  envStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  envStatusLabel: {
    ...theme.typography.caption,
    color: palette.mutedBlue,
  },
});
