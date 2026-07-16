// Core game types. The engine (src/engine/*) operates only on these — no React
// or React Native imports anywhere in the engine.

export type Direction = 'up' | 'down' | 'left' | 'right';

export type CharacterStatus =
  | 'active'
  | 'selected'
  | 'blocked'
  | 'leaving'
  | 'cleared';

export type GridSize = 4 | 5 | 6;

export type Difficulty = 'easy' | 'medium' | 'hard';

export type CrowdCharacter = {
  id: string;
  row: number;
  column: number;
  direction: Direction;
  characterVariant: string;
  outfitVariant: string;
  status: CharacterStatus;
};

export type LevelDefinition = {
  id: string;
  number: number;
  title?: string;
  gridSize: GridSize;
  difficulty: Difficulty;
  environmentId: string;
  characters: CrowdCharacter[];
  knownSolution: string[];
  parMoves: number;
};

/** A single board cell coordinate. */
export type Cell = { row: number; column: number };

/**
 * Immutable runtime board state. `characters` is the current set (with live
 * statuses). `history` is a stack of cleared character ids enabling undo.
 */
export type BoardState = {
  gridSize: GridSize;
  characters: CrowdCharacter[];
  /** ids of characters cleared, in the order they were cleared (undo stack). */
  history: string[];
  moves: number;
  mistakes: number;
};

export type MoveResultKind = 'cleared' | 'blocked' | 'ignored';

export type MoveResult = {
  kind: MoveResultKind;
  state: BoardState;
  /** For 'blocked': the ids blocking the tapped character's path. */
  blockingIds: string[];
  /** The tapped character id (echoed for convenience). */
  characterId: string;
};
