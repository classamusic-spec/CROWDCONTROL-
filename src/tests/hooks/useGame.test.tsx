import { act, renderHook } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import { AppStateProvider } from '@/hooks/AppState';
import { useGame } from '@/hooks/useGame';
import { tutorialLevel } from '@/data/tutorial';

function wrapper({ children }: { children: ReactNode }) {
  return <AppStateProvider>{children}</AppStateProvider>;
}

describe('useGame controller', () => {
  it('drives the tutorial level to completion and reports a summary', () => {
    const onComplete = jest.fn();
    const { result } = renderHook(
      () => useGame(tutorialLevel, { onComplete }),
      { wrapper },
    );

    expect(result.current.remaining).toBe(3);

    // Tapping the blocked character 'a' registers a mistake, clears nothing.
    act(() => result.current.tap('a'));
    expect(result.current.mistakes).toBe(1);
    expect(result.current.remaining).toBe(3);

    // Valid order: b, c, a.
    act(() => result.current.tap('b'));
    expect(result.current.remaining).toBe(2);
    act(() => result.current.tap('c'));
    expect(result.current.remaining).toBe(1);
    act(() => result.current.tap('a'));

    expect(result.current.completed).toBe(true);
    expect(result.current.remaining).toBe(0);
    expect(onComplete).toHaveBeenCalledTimes(1);
    const summary = onComplete.mock.calls[0]?.[0];
    expect(summary.moves).toBe(3);
    expect(summary.mistakes).toBe(1);
  });

  it('ignores a double-tap on an already-cleared character', () => {
    const { result } = renderHook(() => useGame(tutorialLevel), { wrapper });
    act(() => result.current.tap('b'));
    act(() => result.current.tap('b'));
    expect(result.current.remaining).toBe(2);
    expect(result.current.moves).toBe(1);
  });

  it('undo restores the last cleared character', () => {
    const { result } = renderHook(() => useGame(tutorialLevel), { wrapper });
    act(() => result.current.tap('b'));
    expect(result.current.remaining).toBe(2);
    act(() => result.current.undo());
    expect(result.current.remaining).toBe(3);
    expect(result.current.canUndo).toBe(false);
  });

  it('hint suggests a valid first move', () => {
    const { result } = renderHook(() => useGame(tutorialLevel), { wrapper });
    let hinted: string | null = null;
    act(() => {
      hinted = result.current.useHint();
    });
    expect(['b', 'c']).toContain(hinted);
    expect(result.current.hintsUsed).toBe(1);
  });
});
