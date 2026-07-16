import { useRouter } from 'expo-router';
import { Share, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/buttons/Button';
import { BottomNav } from '@/components/navigation/BottomNav';
import { Icon } from '@/components/icons';
import { Panel } from '@/components/cards/Panel';
import { ScreenBackground } from '@/components/navigation/ScreenBackground';
import { HudPill } from '@/components/stats/HudPill';
import { getEnvironment } from '@/data/environments';
import { palette, theme } from '@/data/theme';
import { useDailyChallenge } from '@/hooks/useDailyChallenge';
import { buildDailyShareText } from '@/utils/shareText';
import { formatTime } from '@/utils/formatting';

export default function Daily() {
  const router = useRouter();
  const daily = useDailyChallenge();
  const env = getEnvironment(daily.level.environmentId);

  const onShare = async () => {
    if (!daily.official) return;
    try {
      await Share.share({
        message: buildDailyShareText({
          puzzleNumber: daily.level.number,
          timeMs: daily.official.timeMs,
          moves: daily.official.moves,
          mistakes: daily.official.mistakes,
          streak: daily.currentStreak,
        }),
      });
    } catch {
      // cancelled
    }
  };

  return (
    <ScreenBackground environmentId={daily.level.environmentId} contentStyle={styles.root}>
      <View style={styles.content}>
        <View style={styles.headerBlock}>
          <Icon name="calendar" size={40} color={palette.brightBlue} />
          <Text style={styles.title}>Daily Challenge</Text>
          <Text style={styles.subtitle}>
            #{daily.level.number} · {daily.date} · {env.name}
          </Text>
        </View>

        <View style={styles.streaks}>
          <HudPill icon="streak" value={String(daily.currentStreak)} label="Current" tint={palette.orange} />
          <HudPill icon="trophy" value={String(daily.longestStreak)} label="Longest" tint={palette.yellow} />
        </View>

        <Panel style={styles.panel}>
          {daily.completed && daily.official ? (
            <>
              <Text style={styles.doneTitle}>Today's puzzle solved ✓</Text>
              <View style={styles.resultRow}>
                <HudPill icon="timer" value={formatTime(daily.official.timeMs)} label="Time" />
                <HudPill icon="continue" value={String(daily.official.moves)} label="Moves" />
                <HudPill icon="mistakes" value={String(daily.official.mistakes)} label="Miss" tint={palette.red} />
              </View>
              <Button label="Share Result" icon="share" variant="primary" fullWidth onPress={onShare} />
              <Button
                label="Replay (unofficial)"
                icon="replay"
                variant="ghost"
                fullWidth
                onPress={() => router.push({ pathname: '/game', params: { mode: 'daily', date: daily.date } })}
              />
            </>
          ) : (
            <>
              <Text style={styles.doneTitle}>A fresh crowd is waiting.</Text>
              <Text style={styles.hint}>Your first result becomes official and builds your streak.</Text>
              <Button
                label="Play Today's Puzzle"
                icon="continue"
                variant="success"
                fullWidth
                onPress={() => router.push({ pathname: '/game', params: { mode: 'daily', date: daily.date } })}
              />
            </>
          )}
        </Panel>
      </View>
      <BottomNav />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: { justifyContent: 'space-between' },
  content: { flex: 1, paddingHorizontal: theme.layout.screenPadding, gap: 20, justifyContent: 'center' },
  headerBlock: { alignItems: 'center', gap: 6 },
  title: { color: palette.white, fontSize: 28, fontWeight: '900' },
  subtitle: { color: palette.mutedBlue, fontSize: 14, fontWeight: '600' },
  streaks: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
  panel: { gap: 14, alignItems: 'stretch' },
  doneTitle: { color: palette.white, fontSize: 18, fontWeight: '800', textAlign: 'center' },
  hint: { color: palette.mutedBlue, fontSize: 14, textAlign: 'center', marginBottom: 4 },
  resultRow: { flexDirection: 'row', gap: 8, justifyContent: 'center', flexWrap: 'wrap' },
});
