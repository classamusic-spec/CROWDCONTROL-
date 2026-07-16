import { getBlockingCharacters } from '@/engine/pathChecker';
import { createBoardState } from '@/engine/boardState';
import type {
  BoardState,
  LevelDefinition,
  MoveResult,
} from '@/types/game';

/**
 * State transitions. Every function is pure: it returns a new BoardState and
 * never mutates its input. This is the single authority for what a tap does.
 * See docs/PRODUCT_SPEC.md §3 and the directive §10 tap flow.
 */

/**
 * Apply a tap on the character with the given id.
 *
 * - Cleared or leaving characters, or unknown ids → `ignored` (no change).
 * - A tapped character whose path is blocked → `blocked`: mistakes += 1, the
 *   board is otherwise unchanged, and the blockers are reported.
 * - A tapped character whose path is clear → `cleared`: the character is
 *   removed (status `cleared`), pushed onto the undo history, moves += 1.
 */
export function applyMove(state: BoardState, characterId: string): MoveResult {
  const target = state.characters.find((c) => c.id === characterId);

  // Ignore unknown / already-resolved / mid-animation taps (double-tap guard).
  if (!target || target.status === 'cleared' || target.status === 'leaving') {
    return { kind: 'ignored', state, blockingIds: [], characterId };
  }

  const blockers = getBlockingCharacters(
    target,
    state.characters,
    state.gridSize,
  );

  if (blockers.length > 0) {
    const next: BoardState = {
      ...state,
      characters: state.characters.map((c) => ({ ...c })),
      mistakes: state.mistakes + 1,
    };
    return {
      kind: 'blocked',
      state: next,
      blockingIds: blockers.map((b) => b.id),
      characterId,
    };
  }

  const next: BoardState = {
    ...state,
    characters: state.characters.map((c) =>
      c.id === characterId ? { ...c, status: 'cleared' } : { ...c },
    ),
    history: [...state.history, characterId],
    moves: state.moves + 1,
  };
  return { kind: 'cleared', state: next, blockingIds: [], characterId };
}

/**
 * Reverse the most recent cleared move. Blocked taps are not recorded in
 * history and are therefore not affected. Returns the input state unchanged if
 * there is nothing to undo.
 */
export function undoMove(state: BoardState): BoardState {
  if (state.history.length === 0) return state;
  const history = [...state.history];
  const lastId = history.pop() as string;
  return {
    ...state,
    characters: state.characters.map((c) =>
      c.id === lastId ? { ...c, status: 'active' } : { ...c },
    ),
    history,
    moves: Math.max(0, state.moves - 1),
  };
}

/**
 * Reset a level to its initial state. Requires the original level definition
 * (the board state alone does not retain original positions once cleared, but
 * positions are never mutated here — still, resetting from the definition is
 * the canonical, unambiguous reset).
 */
export function restartLevel(level: LevelDefinition): BoardState {
  return createBoardState(level);
}
