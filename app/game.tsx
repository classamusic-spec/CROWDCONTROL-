import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { IconButton } from '@/components/buttons/IconButton';
import { Button } from '@/components/buttons/Button';
import { Icon } from '@/components/icons';
import { GameBoard } from '@/components/game/GameBoard';
import { HudPill } from '@/components/stats/HudPill';
import { Panel } from '@/components/cards/Panel';
import { ScreenBackground } from '@/components/navigation/ScreenBackground';
import { bundledLevels, getLevelByNumber } from '@/data/bundledLevels';
import { getEnvironment } from '@/data/environments';
import { palette, theme } from '@/data/theme';
import { calculateStars, isPerfect } from '@/engine';
import { createDailyLevel } from '@/engine/dailySeed';
import { useGame } from '@/hooks/useGame';
import { useProgress } from '@/hooks/useProgress';
import { useDailyChallenge } from '@/hooks/useDailyChallenge';
import { useReducedMotionPref } from '@/hooks/useReducedMotionPref';
import { computeBoardSize } from '@/utils/responsive';
import { formatTime } from '@/utils/formatting';
import { todayUtc } from '@/utils/date';
import type { LevelDefinition } from '@/types/game';

/**
 * Gameplay screen. Renders the HUD + board + controls and drives a level (or
 * the daily puzzle) to completion, then routes to results with the summary.
 */
export default function Game() {
  const router = useRouter();
  const params = useLocalSearchParams<{ level?: string; mode?: string; date?: string }>();
  const reducedMotion = useReducedMotionPref();
  const { width } = useWindowDimensions();
  const boardSize = computeBoardSize(width);

  const { progress, recordLevelResult, addPlayTime } = useProgress();
  const isDaily = params.mode === 'daily';
  const dateString = params.date ?? todayUtc();
  const { recordDailyResult } = useDailyChallenge(dateString);

  const level: LevelDefinition = useMemo(() => {
    if (isDaily) return createDailyLevel(dateString);
    const n = Number(params.level ?? '1');
    return getLevelByNumber(n) ?? (bundledLevels[0] as LevelDefinition);
  }, [isDaily, dateString, params.level]);

  const [paused, setPaused] = useState(false);

  const handleComplete = useCallback(
    (summary: { timeMs: number; moves: number; mistakes: number; hintsUsed: number }) => {
      const stars = calculateStars(level, summary);
      const perfect = isPerfect(level, summary);
      addPlayTime(summary.timeMs);

      if (isDaily) {
        recordDailyResult({
          date: dateString,
          puzzleNumber: level.number,
          timeMs: summary.timeMs,
          moves: summary.moves,
          mistakes: summary.mistakes,
          hintsUsed: summary.hintsUsed,
          completed: true,
        });
      } else {
        recordLevelResult({
          levelNumber: level.number,
          stars,
          timeMs: summary.timeMs,
          moves: summary.moves,
          mistakes: summary.mistakes,
          perfect,
          charactersCount: level.characters.length,
          totalLevels: bundledLevels.length,
        });
      }

      const prevBest = progress.levels[level.number];
      const isNewRecord =
        !isDaily &&
        (prevBest == null ||
          !prevBest.completed ||
          stars > prevBest.stars ||
          (prevBest.bestTimeMs != null && summary.timeMs < prevBest.bestTimeMs));

      router.replace({
        pathname: '/results',
        params: {
          level: String(level.number),
          mode: isDaily ? 'daily' : 'level',
          date: dateString,
          stars: String(stars),
          timeMs: String(summary.timeMs),
          moves: String(summary.moves),
          mistakes: String(summary.mistakes),
          newRecord: isNewRecord ? '1' : '0',
        },
      });
    },
    [level, isDaily, dateString, progress.levels, addPlayTime, recordDailyResult, recordLevelResult, router],
  );

  const game = useGame(level, { onComplete: handleComplete, paused });
  const env = getEnvironment(level.environmentId);

  return (
    <ScreenBackground environmentId={level.environmentId} subtleDecoration>
      <View style={styles.container}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={() => router.back()}
            style={styles.iconTap}
          >
            <Icon name="back" size={26} color={palette.white} />
          </Pressable>
          <View style={styles.titleBlock}>
            <Text style={styles.levelTitle}>
              {isDaily ? `Daily #${level.number}` : `Level ${level.number}`}
            </Text>
            <Text style={styles.envName}>{env.name}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Pause"
            onPress={() => setPaused(true)}
            style={styles.iconTap}
          >
            <Icon name="pause" size={24} color={palette.white} />
          </Pressable>
        </View>

        {/* HUD */}
        <View style={styles.hud}>
          <HudPill icon="timer" value={formatTime(game.elapsedMs)} label="Time" />
          <HudPill icon="mistakes" value={String(game.mistakes)} label="Mistakes" tint={palette.red} />
          <HudPill icon="remaining" value={String(game.remaining)} label="Left" tint={palette.brightBlue} />
        </View>

        {/* Board */}
        <View style={styles.boardWrap}>
          <GameBoard
            board={game.board}
            boardSize={boardSize}
            reducedMotion={reducedMotion}
            hintId={game.hintId}
            feedback={game.feedback}
            completed={game.completed}
            onTap={game.tap}
          />
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <IconButton icon="undo" label="Undo" caption="Undo" disabled={!game.canUndo} onPress={game.undo} />
          <IconButton icon="hint" label="Hint" caption="Hint" tint={palette.yellow} onPress={() => game.useHint()} />
          <IconButton icon="restart" label="Restart" caption="Restart" onPress={game.restart} />
        </View>
      </View>

      {paused ? (
        <View style={styles.overlay}>
          <Panel style={styles.pausePanel}>
            <Text style={styles.pauseTitle}>Paused</Text>
            <Button label="Resume" icon="continue" fullWidth onPress={() => setPaused(false)} />
            <Button label="Restart" variant="secondary" icon="restart" fullWidth onPress={() => { game.restart(); setPaused(false); }} />
            <Button label="Home" variant="ghost" icon="home" fullWidth onPress={() => router.replace('/home')} />
          </Panel>
        </View>
      ) : null}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: theme.layout.screenPadding, gap: 16 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  iconTap: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  titleBlock: { alignItems: 'center' },
  levelTitle: { color: palette.white, fontSize: 20, fontWeight: '800' },
  envName: { color: palette.mutedBlue, fontSize: 13, fontWeight: '600' },
  hud: { flexDirection: 'row', justifyContent: 'center', gap: 10, flexWrap: 'wrap' },
  boardWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  controls: { flexDirection: 'row', justifyContent: 'center', gap: 34, marginBottom: 12 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7,26,61,0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  pausePanel: { width: '100%', maxWidth: 360, gap: 12, alignItems: 'stretch' },
  pauseTitle: { color: palette.white, fontSize: 26, fontWeight: '900', textAlign: 'center', marginBottom: 6 },
});
