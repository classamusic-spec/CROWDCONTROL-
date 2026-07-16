import type {
  BoardState,
  CrowdCharacter,
  LevelDefinition,
} from '@/types/game';

/**
 * Board state construction and queries. All functions are pure and return new
 * objects; the input state is never mutated.
 */

/** Build the initial runtime board from a level definition. */
export function createBoardState(level: LevelDefinition): BoardState {
  return {
    gridSize: level.gridSize,
    characters: level.characters.map((c) => ({ ...c, status: 'active' })),
    history: [],
    moves: 0,
    mistakes: 0,
  };
}

/** Deep-ish clone that copies the characters array and each character. */
export function cloneBoardState(state: BoardState): BoardState {
  return {
    gridSize: state.gridSize,
    characters: state.characters.map((c) => ({ ...c })),
    history: [...state.history],
    moves: state.moves,
    mistakes: state.mistakes,
  };
}

/** Number of characters not yet cleared. */
export function calculateRemainingCharacters(state: BoardState): number {
  return state.characters.reduce(
    (n, c) => (c.status === 'cleared' ? n : n + 1),
    0,
  );
}

/** True when every character has been cleared. */
export function isLevelComplete(state: BoardState): boolean {
  return state.characters.every((c) => c.status === 'cleared');
}

/** Look up a character by id (or undefined). */
export function findCharacter(
  state: BoardState,
  id: string,
): CrowdCharacter | undefined {
  return state.characters.find((c) => c.id === id);
}
