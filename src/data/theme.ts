import type {
  Direction,
  MotionScale,
  Palette,
  RadiusScale,
  ShadowScale,
  SpacingScale,
  Theme,
  TypographyScale,
} from '@/types/theme';

// ---- Color palette (from directive §6 / ART_BIBLE) ----
export const palette: Palette = {
  primaryNavy: '#071A3D',
  secondaryNavy: '#0E2A5C',
  panelNavy: '#102F63',
  brightBlue: '#1688F8',
  deepBlue: '#0766D8',
  green: '#53C832',
  darkGreen: '#269B20',
  orange: '#FF9818',
  darkOrange: '#E56C00',
  yellow: '#FFC928',
  red: '#F04444',
  purple: '#8D55E8',
  pink: '#E95A9D',
  teal: '#20B7B2',
  cream: '#FFF8E9',
  warmPanel: '#F4EBD9',
  white: '#FFFFFF',
  mutedBlue: '#AFC4E6',
};

const spacing: SpacingScale = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const radius: RadiusScale = {
  sm: 8,
  md: 14,
  lg: 22,
  xl: 32,
  pill: 999,
};

const shadow: ShadowScale = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.24,
    shadowRadius: 10,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
};

const typography: TypographyScale = {
  display: { fontSize: 40, lineHeight: 46, fontWeight: '900', letterSpacing: 0.5 },
  title: { fontSize: 30, lineHeight: 36, fontWeight: '800' },
  heading: { fontSize: 24, lineHeight: 30, fontWeight: '800' },
  subheading: { fontSize: 19, lineHeight: 25, fontWeight: '700' },
  body: { fontSize: 16, lineHeight: 23, fontWeight: '500' },
  label: { fontSize: 15, lineHeight: 20, fontWeight: '700', letterSpacing: 0.3 },
  caption: { fontSize: 13, lineHeight: 17, fontWeight: '600' },
  mono: { fontSize: 18, lineHeight: 22, fontWeight: '800', letterSpacing: 1 },
};

const motion: MotionScale = {
  instant: 0,
  fast: 140,
  base: 240,
  slow: 420,
  splash: 2400,
};

const directionColors: Record<Direction, string> = {
  up: palette.brightBlue,
  down: palette.purple,
  left: palette.orange,
  right: palette.green,
};

export const theme: Theme = {
  colors: palette,
  spacing,
  radius,
  shadow,
  typography,
  motion,
  layout: {
    minTouchTarget: 44,
    screenPadding: 20,
    maxContentWidth: 520,
    breakpoints: { small: 340, medium: 400, large: 600 },
  },
  directionColors,
};

export type { Theme };
