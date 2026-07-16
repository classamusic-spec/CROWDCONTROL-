import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  applyMove,
  calculateRemainingCharacters,
  createBoardState,
  getHint,
  isLevelComplete,
  restartLevel,
  undoMove,
} from '@/engine';
import { useAudio } from '@/hooks/useAudio';
import { useHaptics } from '@/hooks/useHaptics';
import type { BoardState, LevelDefinition, MoveResultKind } from '@/types/game';

export type GameTapFeedback = {
  kind: MoveResultKind;
  characterId: string;
  blockingIds: string[];
  /** monotonically increasing so consumers can react to repeats. */
  nonce: number;
};

export type UseGameOptions = {
  /** Called once when the board becomes complete. */
  onComplete?: (summary: {
    timeMs: number;
    moves: number;
    mistakes: number;
    hintsUsed: number;
  }) => void;
  /** Disable the running timer (e.g. in tutorial steps). */
  paused?: boolean;
};

export function useGame(level: LevelDefinition, options: UseGameOptions = {}) {
  const { onComplete, paused = false } = options;
  const [board, setBoard] = useState<BoardState>(() => createBoardState(level));
  const [elapsedMs, setElapsedMs] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintId, setHintId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<GameTapFeedback | null>(null);
  const [completed, setCompleted] = useState(false);

  const audio = useAudio();
  const haptics = useHaptics();

  const startRef = useRef<number>(Date.now());
  const accumulatedRef = useRef<number>(0);
  const nonceRef = useRef(0);
  const completedRef = useRef(false);

  // Reset everything when the level identity changes.
  useEffect(() => {
    setBoard(createBoardState(level));
    setElapsedMs(0);
    setHintsUsed(0);
    setHintId(null);
    setFeedback(null);
    setCompleted(false);
    completedRef.current = false;
    accumulatedRef.current = 0;
    startRef.current = Date.now();
  }, [level]);

  // Timer tick.
  useEffect(() => {
    if (paused || completed) return;
    startRef.current = Date.now();
    const id = setInterval(() => {
      setElapsedMs(accumulatedRef.current + (Date.now() - startRef.current));
    }, 250);
    return () => {
      accumulatedRef.current += Date.now() - startRef.current;
      clearInterval(id);
    };
  }, [paused, completed]);

  const remaining = useMemo(
    () => calculateRemainingCharacters(board),
    [board],
  );

  const tap = useCallback(
    (characterId: string) => {
      if (completedRef.current) return;
      setHintId(null);
      setBoard((prev) => {
        const result = applyMove(prev, characterId);
        nonceRef.current += 1;
        setFeedback({
          kind: result.kind,
          characterId,
          blockingIds: result.blockingIds,
          nonce: nonceRef.current,
        });
        if (result.kind === 'blocked') {
          haptics.trigger('warning');
          audio.play('blocked');
        } else if (result.kind === 'cleared') {
          haptics.trigger('light');
          audio.play('exit');
          if (isLevelComplete(result.state)) {
            completedRef.current = true;
            const finalTime =
              accumulatedRef.current + (Date.now() - startRef.current);
            setCompleted(true);
            setElapsedMs(finalTime);
            haptics.trigger('success');
            audio.play('levelcomplete');
            onComplete?.({
              timeMs: finalTime,
              moves: result.state.moves,
              mistakes: result.state.mistakes,
              hintsUsed,
            });
          }
        }
        return result.state;
      });
    },
    [audio, haptics, hintsUsed, onComplete],
  );

  const undo = useCallback(() => {
    if (completedRef.current) return;
    setBoard((prev) => {
      if (prev.history.length === 0) return prev;
      audio.play('undo');
      haptics.trigger('light');
      return undoMove(prev);
    });
    setHintId(null);
  }, [audio, haptics]);

  const restart = useCallback(() => {
    audio.play('restart');
    haptics.trigger('medium');
    setBoard(restartLevel(level));
    setElapsedMs(0);
    setHintsUsed(0);
    setHintId(null);
    setFeedback(null);
    setCompleted(false);
    completedRef.current = false;
    accumulatedRef.current = 0;
    startRef.current = Date.now();
  }, [audio, haptics, level]);

  const useHint = useCallback(() => {
    if (completedRef.current) return null;
    const id = getHint(board);
    if (id) {
      setHintId(id);
      setHintsUsed((n) => n + 1);
      audio.play('hint');
      haptics.trigger('light');
    }
    return id;
  }, [audio, board, haptics]);

  return {
    board,
    remaining,
    moves: board.moves,
    mistakes: board.mistakes,
    elapsedMs,
    hintsUsed,
    hintId,
    feedback,
    completed,
    canUndo: board.history.length > 0 && !completed,
    tap,
    undo,
    restart,
    useHint,
  };
}
