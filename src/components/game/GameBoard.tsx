import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { CharacterToken } from '@/components/game/CharacterToken';
import { palette, theme } from '@/data/theme';
import type { BoardState, GridSize } from '@/types/game';
import type { GameTapFeedback } from '@/hooks/useGame';

/**
 * The playable grid. Lays characters over a quiet board surface and forwards
 * taps. Plays a gentle pulse when the board clears. Positions are pure integer
 * math; no physics.
 */
export type GameBoardProps = {
  board: BoardState;
  boardSize: number;
  reducedMotion: boolean;
  hintId: string | null;
  feedback: GameTapFeedback | null;
  completed: boolean;
  onTap: (characterId: string) => void;
};

function GridLines({ gridSize, cellSize }: { gridSize: GridSize; cellSize: number }) {
  const lines = [];
  for (let i = 1; i < gridSize; i++) {
    lines.push(
      <View key={`v${i}`} style={[styles.vline, { left: i * cellSize }]} />,
      <View key={`h${i}`} style={[styles.hline, { top: i * cellSize }]} />,
    );
  }
  return <>{lines}</>;
}

export function GameBoard({
  board,
  boardSize,
  reducedMotion,
  hintId,
  feedback,
  completed,
  onTap,
}: GameBoardProps) {
  const cellSize = boardSize / board.gridSize;
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (completed && !reducedMotion) {
      pulse.value = withSequence(
        withTiming(1.04, { duration: 180 }),
        withTiming(1, { duration: 220 }),
      );
    }
  }, [completed, reducedMotion, pulse]);

  const boardStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  return (
    <Animated.View
      style={[styles.board, { width: boardSize, height: boardSize }, boardStyle]}
      accessibilityLabel={`${board.gridSize} by ${board.gridSize} game board`}
    >
      <GridLines gridSize={board.gridSize} cellSize={cellSize} />
      {board.characters.map((character) => {
        const blockedNonce =
          feedback && feedback.kind === 'blocked' && feedback.characterId === character.id
            ? feedback.nonce
            : 0;
        return (
          <CharacterToken
            key={character.id}
            character={character}
            cellSize={cellSize}
            boardSize={boardSize}
            reducedMotion={reducedMotion}
            isHint={hintId === character.id}
            blockedNonce={blockedNonce}
            onPress={() => onTap(character.id)}
          />
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  board: {
    borderRadius: theme.radius.lg,
    backgroundColor: 'rgba(7,26,61,0.55)',
    borderWidth: 2,
    borderColor: palette.panelNavy,
    overflow: 'hidden',
  },
  vline: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(175,196,230,0.14)',
  },
  hline: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(175,196,230,0.14)',
  },
});

export default GameBoard;
