import {
  applyMove,
  createBoardState,
  calculateRemainingCharacters,
  isLevelComplete,
  restartLevel,
  undoMove,
} from '@/engine';
import type { CrowdCharacter, Direction, LevelDefinition } from '@/types/game';

function ch(
  id: string,
  row: number,
  column: number,
  direction: Direction,
): CrowdCharacter {
  return {
    id,
    row,
    column,
    direction,
    characterVariant: 'bluehoodie',
    outfitVariant: 'default',
    status: 'active',
  };
}

// A tiny 4x4 level: two characters, 'a' blocked by 'b' until 'b' leaves.
function makeLevel(): LevelDefinition {
  return {
    id: 'test-1',
    number: 1,
    gridSize: 4,
    difficulty: 'easy',
    environmentId: 'concert',
    characters: [ch('a', 3, 0, 'up'), ch('b', 1, 0, 'left')],
    knownSolution: ['b', 'a'],
    parMoves: 2,
  };
}

describe('applyMove', () => {
  it('clears a character whose path is clear', () => {
    const s0 = createBoardState(makeLevel());
    const r = applyMove(s0, 'b');
    expect(r.kind).toBe('cleared');
    expect(r.state.characters.find((c) => c.id === 'b')?.status).toBe('cleared');
    expect(r.state.moves).toBe(1);
    expect(r.state.history).toEqual(['b']);
  });

  it('blocks a character whose path is blocked and counts a mistake', () => {
    const s0 = createBoardState(makeLevel());
    const r = applyMove(s0, 'a');
    expect(r.kind).toBe('blocked');
    expect(r.blockingIds).toEqual(['b']);
    expect(r.state.mistakes).toBe(1);
    expect(r.state.moves).toBe(0);
    expect(r.state.characters.find((c) => c.id === 'a')?.status).toBe('active');
  });

  it('does not mutate the input state (immutability)', () => {
    const s0 = createBoardState(makeLevel());
    const snapshot = JSON.stringify(s0);
    applyMove(s0, 'b');
    expect(JSON.stringify(s0)).toBe(snapshot);
  });

  it('prevents double-removal: re-tapping a cleared character is ignored', () => {
    const s0 = createBoardState(makeLevel());
    const r1 = applyMove(s0, 'b');
    const r2 = applyMove(r1.state, 'b');
    expect(r2.kind).toBe('ignored');
    expect(r2.state.moves).toBe(1); // unchanged
    expect(calculateRemainingCharacters(r2.state)).toBe(1);
  });

  it('ignores a tap on a leaving character (animation guard)', () => {
    const s0 = createBoardState(makeLevel());
    const leaving = {
      ...s0,
      characters: s0.characters.map((c) =>
        c.id === 'b' ? { ...c, status: 'leaving' as const } : c,
      ),
    };
    expect(applyMove(leaving, 'b').kind).toBe('ignored');
  });

  it('ignores unknown ids', () => {
    const s0 = createBoardState(makeLevel());
    expect(applyMove(s0, 'nope').kind).toBe('ignored');
  });

  it('unblocks a character after its blocker leaves', () => {
    let s = createBoardState(makeLevel());
    s = applyMove(s, 'b').state;
    const r = applyMove(s, 'a');
    expect(r.kind).toBe('cleared');
    expect(isLevelComplete(r.state)).toBe(true);
  });
});

describe('undoMove', () => {
  it('restores the last cleared character', () => {
    const s0 = createBoardState(makeLevel());
    const cleared = applyMove(s0, 'b').state;
    const undone = undoMove(cleared);
    expect(undone.characters.find((c) => c.id === 'b')?.status).toBe('active');
    expect(undone.moves).toBe(0);
    expect(undone.history).toEqual([]);
  });

  it('is a no-op when there is nothing to undo', () => {
    const s0 = createBoardState(makeLevel());
    expect(undoMove(s0)).toBe(s0);
  });

  it('does not restore mistakes (blocked taps are not in history)', () => {
    let s = createBoardState(makeLevel());
    s = applyMove(s, 'a').state; // mistake
    s = applyMove(s, 'b').state; // clear b
    const undone = undoMove(s);
    expect(undone.mistakes).toBe(1);
  });
});

describe('restartLevel & completion', () => {
  it('restartLevel returns a fresh full board', () => {
    const level = makeLevel();
    const played = applyMove(createBoardState(level), 'b').state;
    expect(calculateRemainingCharacters(played)).toBe(1);
    const fresh = restartLevel(level);
    expect(calculateRemainingCharacters(fresh)).toBe(2);
    expect(fresh.moves).toBe(0);
    expect(fresh.mistakes).toBe(0);
    expect(isLevelComplete(fresh)).toBe(false);
  });

  it('detects completion only when all are cleared', () => {
    let s = createBoardState(makeLevel());
    expect(isLevelComplete(s)).toBe(false);
    s = applyMove(s, 'b').state;
    expect(isLevelComplete(s)).toBe(false);
    s = applyMove(s, 'a').state;
    expect(isLevelComplete(s)).toBe(true);
    expect(calculateRemainingCharacters(s)).toBe(0);
  });
});
