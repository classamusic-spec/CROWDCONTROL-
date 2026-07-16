import { useLocalSearchParams, useRouter } from 'expo-router';
import { Share, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/buttons/Button';
import { Confetti } from '@/components/feedback/Confetti';
import { Panel } from '@/components/cards/Panel';
import { ScreenBackground } from '@/components/navigation/ScreenBackground';
import { StarRow } from '@/components/feedback/StarRow';
import { HudPill } from '@/components/stats/HudPill';
import { getLevelByNumber } from '@/data/bundledLevels';
import { palette, theme } from '@/data/theme';
import { useDailyChallenge } from '@/hooks/useDailyChallenge';
import { useProgress } from '@/hooks/useProgress';
import { useReducedMotionPref } from '@/hooks/useReducedMotionPref';
import { buildDailyShareText } from '@/utils/shareText';
import { formatTime } from '@/utils/formatting';

/** Results screen shown after a level or daily puzzle is cleared. */
export default function Results() {
  const router = useRouter();
  const reducedMotion = useReducedMotionPref();
  const { progress } = useProgress();
  const params = useLocalSearchParams<{
    level?: string; mode?: string; date?: string; stars?: string;
    timeMs?: string; moves?: string; mistakes?: string; newRecord?: string;
  }>();

  const isDaily = params.mode === 'daily';
  const levelNumber = Number(params.level ?? '1');
  const stars = Math.max(1, Math.min(3, Number(params.stars ?? '1')));
  const timeMs = Number(params.timeMs ?? '0');
  const moves = Number(params.moves ?? '0');
  const mistakes = Number(params.mistakes ?? '0');
  const newRecord = params.newRecord === '1';

  const daily = useDailyChallenge(params.date);
  const best = progress.levels[levelNumber];
  const hasNext = !isDaily && getLevelByNumber(levelNumber + 1) != null;
  const nextUnlocked = !isDaily && progress.highestUnlocked >= levelNumber + 1;

  const onShare = async () => {
    try {
      const text = isDaily
        ? buildDailyShareText({
            puzzleNumber: daily.level.number,
            timeMs,
            moves,
            mistakes,
            streak: daily.currentStreak,
          })
        : `Crowd Control Daily — Level ${levelNumber} cleared in ${formatTime(timeMs)} with ${moves} moves and ${mistakes} mistakes! #CrowdControlDaily`;
      await Share.share({ message: text });
    } catch {
      // user cancelled or share unavailable — no-op
    }
  };

  return (
    <ScreenBackground
      environmentId={progress.selectedEnvironment}
      contentStyle={styles.center}
    >
      <Confetti reducedMotion={reducedMotion} />
      <Panel style={styles.panel}>
        <Text style={styles.title}>
          {isDaily ? 'Daily Complete!' : 'Level Complete!'}
        </Text>
        {newRecord ? (
          <View style={styles.recordBadge}>
            <Text style={styles.recordText}>NEW RECORD</Text>
          </View>
        ) : null}

        <View style={styles.starsWrap}>
          <StarRow earned={stars} size={48} animate={!reducedMotion} />
        </View>

        <View style={styles.statsRow}>
          <HudPill icon="timer" value={formatTime(timeMs)} label="Time" />
          <HudPill icon="continue" value={String(moves)} label="Moves" />
          <HudPill icon="mistakes" value={String(mistakes)} label="Mistakes" tint={palette.red} />
        </View>

        {!isDaily && best ? (
          <Text style={styles.best}>
            Best: {best.bestTimeMs != null ? formatTime(best.bestTimeMs) : '—'} ·{' '}
            {best.bestMoves ?? '—'} moves · {best.stars}★
          </Text>
        ) : null}
        {isDaily ? (
          <Text style={styles.best}>🔥 {daily.currentStreak}-day streak</Text>
        ) : null}

        <View style={styles.actions}>
          {hasNext ? (
            <Button
              label={nextUnlocked ? 'Next Level' : 'Next (Locked)'}
              icon="continue"
              variant="success"
              fullWidth
              disabled={!nextUnlocked}
              onPress={() => router.replace({ pathname: '/game', params: { level: String(levelNumber + 1) } })}
            />
          ) : null}
          <Button
            label="Replay"
            icon="replay"
            variant="secondary"
            fullWidth
            onPress={() =>
              router.replace({
                pathname: '/game',
                params: isDaily
                  ? { mode: 'daily', date: params.date }
                  : { level: String(levelNumber) },
              })
            }
          />
          <View style={styles.rowButtons}>
            <Button label="Home" icon="home" variant="ghost" style={styles.flexBtn} onPress={() => router.replace('/home')} />
            <Button label="Share" icon="share" variant="ghost" style={styles.flexBtn} onPress={onShare} />
          </View>
        </View>
      </Panel>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', padding: theme.layout.screenPadding },
  panel: { width: '100%', maxWidth: 400, alignItems: 'center', gap: 16 },
  title: { color: palette.white, fontSize: 28, fontWeight: '900', textAlign: 'center' },
  recordBadge: { backgroundColor: palette.yellow, paddingHorizontal: 14, paddingVertical: 5, borderRadius: 999 },
  recordText: { color: palette.primaryNavy, fontWeight: '900', letterSpacing: 1.5, fontSize: 13 },
  starsWrap: { marginVertical: 6 },
  statsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  best: { color: palette.mutedBlue, fontSize: 14, fontWeight: '600' },
  actions: { width: '100%', gap: 10, marginTop: 4 },
  rowButtons: { flexDirection: 'row', gap: 10 },
  flexBtn: { flex: 1 },
});
