import type { LevelDefinition } from '@/types/game';

/**
 * A hand-authored, fully solvable 4x4 tutorial level. It intentionally contains
 * one blocked pair (a behind b) so the tutorial can teach "blocked → clear the
 * blocker first", plus a free character (c) to show independent paths.
 *
 * Positions (row,col; 0 = top/left):
 *   a (3,0) up   — blocked by b until b leaves
 *   b (1,0) left — on the left edge, always free (its blocker path is empty)
 *   c (0,3) down — column 3 is clear, always free
 * A valid clear order: b, c, a.
 */
export const tutorialLevel: LevelDefinition = {
  id: 'tutorial',
  number: 0,
  title: 'Tutorial',
  gridSize: 4,
  difficulty: 'easy',
  environmentId: 'concert',
  characters: [
    { id: 'a', row: 3, column: 0, direction: 'up', characterVariant: 'bluehoodie', outfitVariant: 'default', status: 'active' },
    { id: 'b', row: 1, column: 0, direction: 'left', characterVariant: 'pinkpigtail', outfitVariant: 'default', status: 'active' },
    { id: 'c', row: 0, column: 3, direction: 'down', characterVariant: 'greencap', outfitVariant: 'default', status: 'active' },
  ],
  knownSolution: ['b', 'c', 'a'],
  parMoves: 3,
};

export const TUTORIAL_REWARD = {
  cosmeticId: 'outfit_concert_rookie',
  name: 'Concert Rookie Outfit',
};
