import { calculateStars, isPerfect, parMovesFor, parTimeMs } from '@/engine';
import type { CrowdCharacter, LevelDefinition } from '@/types/game';

function chars(n: number): CrowdCharacter[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `c${i}`,
    row: 0,
    column: i,
    direction: 'up' as const,
    characterVariant: 'bluehoodie',
    outfitVariant: 'default',
    status: 'active' as const,
  }));
}

const level: Pick<LevelDefinition, 'gridSize' | 'characters'> = {
  gridSize: 4,
  characters: chars(6),
};

describe('scoring', () => {
  it('awards 3 stars for a clean, in-par run', () => {
    const par = parTimeMs(4, 6);
    expect(
      calculateStars(level, { timeMs: par - 1, moves: 6, mistakes: 0, hintsUsed: 0 }),
    ).toBe(3);
  });

  it('drops to 2 stars if hints were used even with no mistakes', () => {
    expect(
      calculateStars(level, { timeMs: 1, moves: 6, mistakes: 0, hintsUsed: 1 }),
    ).toBe(2);
  });

  it('awards 2 stars for up to 2 mistakes', () => {
    expect(
      calculateStars(level, { timeMs: 1, moves: 6, mistakes: 2, hintsUsed: 0 }),
    ).toBe(2);
  });

  it('awards 1 star for 3+ mistakes', () => {
    expect(
      calculateStars(level, { timeMs: 1, moves: 6, mistakes: 3, hintsUsed: 0 }),
    ).toBe(1);
  });

  it('over-par time with zero mistakes still yields 2 stars', () => {
    const par = parTimeMs(4, 6);
    expect(
      calculateStars(level, { timeMs: par + 5000, moves: 6, mistakes: 0, hintsUsed: 0 }),
    ).toBe(2);
  });

  it('isPerfect requires 3 stars and zero mistakes', () => {
    const par = parTimeMs(4, 6);
    expect(
      isPerfect(level, { timeMs: par - 1, moves: 6, mistakes: 0, hintsUsed: 0 }),
    ).toBe(true);
    expect(
      isPerfect(level, { timeMs: 1, moves: 6, mistakes: 1, hintsUsed: 0 }),
    ).toBe(false);
  });

  it('parMoves equals character count', () => {
    expect(parMovesFor(level)).toBe(6);
  });
});
