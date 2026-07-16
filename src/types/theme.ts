// Theme type definitions. See src/data/theme.ts for values and
// docs/ART_BIBLE.md for the design rationale.

export type ColorToken =
  | 'primaryNavy'
  | 'secondaryNavy'
  | 'panelNavy'
  | 'brightBlue'
  | 'deepBlue'
  | 'green'
  | 'darkGreen'
  | 'orange'
  | 'darkOrange'
  | 'yellow'
  | 'red'
  | 'purple'
  | 'pink'
  | 'teal'
  | 'cream'
  | 'warmPanel'
  | 'white'
  | 'mutedBlue';

export type Palette = Record<ColorToken, string>;

export type SpacingScale = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
};

export type RadiusScale = {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  pill: number;
};

export type ShadowToken = {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
};

export type ShadowScale = {
  none: ShadowToken;
  sm: ShadowToken;
  md: ShadowToken;
  lg: ShadowToken;
};

export type TypographyToken = {
  fontSize: number;
  lineHeight: number;
  fontWeight:
    | 'normal'
    | 'bold'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
  letterSpacing?: number;
};

export type TypographyScale = {
  display: TypographyToken;
  title: TypographyToken;
  heading: TypographyToken;
  subheading: TypographyToken;
  body: TypographyToken;
  label: TypographyToken;
  caption: TypographyToken;
  mono: TypographyToken;
};

export type MotionScale = {
  instant: number;
  fast: number;
  base: number;
  slow: number;
  splash: number;
};

export type Direction = 'up' | 'down' | 'left' | 'right';

export type Theme = {
  colors: Palette;
  spacing: SpacingScale;
  radius: RadiusScale;
  shadow: ShadowScale;
  typography: TypographyScale;
  motion: MotionScale;
  layout: {
    minTouchTarget: number;
    screenPadding: number;
    maxContentWidth: number;
    breakpoints: { small: number; medium: number; large: number };
  };
  directionColors: Record<Direction, string>;
};
