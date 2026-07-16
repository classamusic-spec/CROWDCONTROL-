import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';

import { palette, theme } from '@/data/theme';

/** A rounded, softly-shadowed surface used for cards, sheets, and HUD groups. */
export type PanelProps = ViewProps & {
  tone?: 'panel' | 'warm' | 'navy';
  padded?: boolean;
  style?: ViewStyle;
};

const TONES: Record<NonNullable<PanelProps['tone']>, string> = {
  panel: palette.panelNavy,
  warm: palette.warmPanel,
  navy: palette.secondaryNavy,
};

export function Panel({ tone = 'panel', padded = true, style, children, ...rest }: PanelProps) {
  return (
    <View
      {...rest}
      style={[
        styles.base,
        theme.shadow.md,
        { backgroundColor: TONES[tone], padding: padded ? theme.spacing.lg : 0 },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: theme.radius.xl },
});

export default Panel;
