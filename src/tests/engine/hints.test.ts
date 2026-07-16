import { createBoardState } from '@/engine/boardState';
import { applyMove } from '@/engine/moveEngine';
import { getHint } from '@/engine/hints';
import type { CrowdCharacter, Direction, LevelDefinition } from '@/types/game';

function ch(id: string, row: number, column: number, direction: Direction): CrowdCharacter {
  return { id, row, column, direction, characterVariant: 'student', outfitVariant: 'default', status: 'active' };
}

const level: LevelDefinition = {
  id: 't',
  number: 1,
  gridSize: 4,
  difficulty: 'easy',
  environmentId: 'concert',
  characters: [ch('a', 3, 0, 'up'), ch('b', 1, 0, 'left')],
  knownSolution: ['b', 'a'],
  parMoves: 2,
};

describe('getHint', () => {
  it('suggests the only unblocked character first', () => {
    const state = createBoardState(level);
    expect(getHint(state)).toBe('b');
  });

  it('advances after the first move is played', () => {
    let state = createBoardState(level);
    state = applyMove(state, 'b').state;
    expect(getHint(state)).toBe('a');
  });

  it('returns null when the board is complete', () => {
    let state = createBoardState(level);
    state = applyMove(state, 'b').state;
    state = applyMove(state, 'a').state;
    expect(getHint(state)).toBeNull();
  });
});
