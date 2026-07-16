import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { Button } from '@/components/buttons/Button';
import { IconButton } from '@/components/buttons/IconButton';
import { Confetti } from '@/components/feedback/Confetti';
import { GameBoard } from '@/components/game/GameBoard';
import { Panel } from '@/components/cards/Panel';
import { ScreenBackground } from '@/components/navigation/ScreenBackground';
import { palette, theme } from '@/data/theme';
import { TUTORIAL_REWARD, tutorialLevel } from '@/data/tutorial';
import { useGame } from '@/hooks/useGame';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useReducedMotionPref } from '@/hooks/useReducedMotionPref';
import { computeBoardSize } from '@/utils/responsive';

/**
 * Staged, fully-playable 4x4 tutorial. It teaches through real gameplay:
 * identify a direction, tap a clear-path character, feel a blocked tap, clear
 * the blocker, try Undo, and finish. Mistakes are never punished. On
 * completion it grants the Concert Rookie Outfit and persists tutorial
 * completion (replayable from Settings).
 */
export default function Tutorial() {
  const router = useRouter();
  const reducedMotion = useReducedMotionPref();
  const { completeTutorial } = useOnboarding();
  const { width } = useWindowDimensions();
  const boardSize = Math.min(computeBoardSize(width), 340);

  const [rewarded, setRewarded] = useState(false);

  const level = useMemo(() => tutorialLevel, []);
  const game = useGame(level, {
    paused: false,
    onComplete: () => {
      completeTutorial();
      setRewarded(true);
    },
  });

  // Coach copy derived from live state — non-punishing, reacts to real events.
  const coach = useMemo(() => {
    if (game.completed) return "That's it — the crowd is clear!";
    if (game.mistakes > 0 && game.moves === 0) {
      return 'Blocked! A character can only leave when the path ahead is empty. Clear the one in the way first.';
    }
    if (game.moves === 0) {
      return 'Each character faces a direction. Tap one whose path to the edge is clear.';
    }
    if (game.moves >= 1 && game.remaining > 1) {
      return 'Great — clearing one opens paths for others. Tip: use Undo to take a move back.';
    }
    return 'One more to clear the whole crowd!';
  }, [game.completed, game.mistakes, game.moves, game.remaining]);

  return (
    <ScreenBackground environmentId="concert" contentStyle={styles.root}>
      {rewarded ? <Confetti reducedMotion={reducedMotion} /> : null}
      <View style={styles.content}>
        <Text style={styles.title}>Tutorial</Text>

        <Panel tone="navy" style={styles.coach}>
          <Text style={styles.coachText}>{coach}</Text>
        </Panel>

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

        <View style={styles.controls}>
          <IconButton icon="undo" label="Undo" caption="Undo" disabled={!game.canUndo} onPress={game.undo} />
          <IconButton icon="hint" label="Hint" caption="Hint" tint={palette.yellow} onPress={() => game.useHint()} />
          <IconButton icon="restart" label="Restart" caption="Restart" onPress={game.restart} />
        </View>
      </View>

      {rewarded ? (
        <View style={styles.overlay}>
          <Panel style={styles.rewardPanel}>
            <Text style={styles.rewardEmoji}>🎉</Text>
            <Text style={styles.rewardTitle}>Reward Unlocked</Text>
            <Text style={styles.rewardName}>{TUTORIAL_REWARD.name}</Text>
            <Button
              label="Start Playing"
              icon="continue"
              variant="success"
              fullWidth
              onPress={() => router.replace('/home')}
            />
          </Panel>
        </View>
      ) : null}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: {},
  content: { flex: 1, paddingHorizontal: theme.layout.screenPadding, gap: 16, justifyContent: 'center' },
  title: { color: palette.white, fontSize: 26, fontWeight: '900', textAlign: 'center' },
  coach: { minHeight: 78, justifyContent: 'center' },
  coachText: { color: palette.cream, fontSize: 16, fontWeight: '600', textAlign: 'center', lineHeight: 22 },
  boardWrap: { alignItems: 'center', justifyContent: 'center' },
  controls: { flexDirection: 'row', justifyContent: 'center', gap: 34 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7,26,61,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  rewardPanel: { width: '100%', maxWidth: 340, alignItems: 'center', gap: 12 },
  rewardEmoji: { fontSize: 44 },
  rewardTitle: { color: palette.yellow, fontSize: 22, fontWeight: '900' },
  rewardName: { color: palette.white, fontSize: 17, fontWeight: '700', textAlign: 'center', marginBottom: 6 },
});
