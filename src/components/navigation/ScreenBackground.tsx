import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

import { EnvironmentBackdrop } from '@/components/game/EnvironmentBackdrop';
import { palette } from '@/data/theme';

/**
 * Standard screen frame: an environment backdrop behind a safe-area content
 * container. Every screen uses this so no plain/white screens exist.
 */
export type ScreenBackgroundProps = {
  environmentId?: string;
  children: React.ReactNode;
  edges?: readonly Edge[];
  contentStyle?: ViewStyle;
  subtleDecoration?: boolean;
};

export function ScreenBackground({
  environmentId = 'concert',
  children,
  edges = ['top', 'bottom'],
  contentStyle,
  subtleDecoration,
}: ScreenBackgroundProps) {
  return (
    <View style={styles.root}>
      <EnvironmentBackdrop environmentId={environmentId} subtle={subtleDecoration} />
      <SafeAreaView style={[styles.safe, contentStyle]} edges={edges}>
        {children}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.primaryNavy },
  safe: { flex: 1 },
});

export default ScreenBackground;
