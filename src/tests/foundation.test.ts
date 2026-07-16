import { palette, theme } from '@/data/theme';

describe('theme foundation', () => {
  it('exposes all 18 palette color tokens as valid hex', () => {
    const values = Object.values(palette);
    expect(values).toHaveLength(18);
    for (const hex of values) {
      expect(hex).toMatch(/^#[0-9A-F]{6}$/i);
    }
  });

  it('maps every direction to a distinct palette color', () => {
    const dirs = theme.directionColors;
    const colors = [dirs.up, dirs.down, dirs.left, dirs.right];
    expect(new Set(colors).size).toBe(4);
  });

  it('enforces a minimum accessible touch target', () => {
    expect(theme.layout.minTouchTarget).toBeGreaterThanOrEqual(44);
  });

  it('has an ascending spacing scale', () => {
    const s = theme.spacing;
    expect(s.xs).toBeLessThan(s.sm);
    expect(s.sm).toBeLessThan(s.md);
    expect(s.md).toBeLessThan(s.lg);
    expect(s.lg).toBeLessThan(s.xl);
    expect(s.xl).toBeLessThan(s.xxl);
  });
});
