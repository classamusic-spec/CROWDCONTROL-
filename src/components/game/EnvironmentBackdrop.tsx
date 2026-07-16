import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { getEnvironment, type EnvironmentDecoration } from '@/data/environments';
import { palette } from '@/data/theme';

/**
 * Procedural environment background (Asset Mode B). A soft vertical gradient
 * plus edge decoration silhouettes that FRAME the board — the central area is
 * deliberately left quiet for readability (ART_BIBLE / PRODUCT_SPEC §14).
 */

export type EnvironmentBackdropProps = {
  environmentId: string;
  style?: ViewStyle;
  /** Dim the decoration (used behind dense HUDs). */
  subtle?: boolean;
};

function Decoration({ kind, accent }: { kind: EnvironmentDecoration; accent: string }) {
  // Drawn in a 100x100 viewBox, silhouettes hugging top and bottom edges.
  const op = 0.5;
  switch (kind) {
    case 'stage':
      return (
        <>
          <Path d="M0 0 H100 V10 Q50 22 0 10 Z" fill={accent} opacity={op} />
          <Circle cx={16} cy={6} r={3} fill={palette.yellow} opacity={0.8} />
          <Circle cx={84} cy={6} r={3} fill={palette.yellow} opacity={0.8} />
          <Path d="M0 100 H100 V90 Q50 84 0 90 Z" fill={accent} opacity={op * 0.7} />
        </>
      );
    case 'gates':
      return (
        <>
          <Rect x={6} y={0} width={14} height={16} rx={3} fill={accent} opacity={op} />
          <Rect x={80} y={0} width={14} height={16} rx={3} fill={accent} opacity={op} />
          <Path d="M0 96 H100 V100 H0 Z" fill={accent} opacity={op * 0.6} />
        </>
      );
    case 'tunnel':
      return (
        <>
          <Path d="M0 0 H100 V8 H0 Z" fill={accent} opacity={op} />
          <Circle cx={50} cy={4} r={10} fill={palette.primaryNavy} opacity={0.6} />
          <Rect x={0} y={94} width={100} height={6} fill={accent} opacity={op * 0.7} />
        </>
      );
    case 'rides':
      return (
        <>
          <Circle cx={14} cy={10} r={10} fill="none" stroke={accent} strokeWidth={2} opacity={op} />
          <Circle cx={86} cy={12} r={7} fill="none" stroke={accent} strokeWidth={2} opacity={op} />
          <Path d="M0 100 H100 V92 Q50 86 0 92 Z" fill={accent} opacity={op * 0.6} />
        </>
      );
    case 'lockers':
      return (
        <>
          {[8, 20, 72, 84].map((x) => (
            <Rect key={x} x={x} y={0} width={9} height={20} rx={2} fill={accent} opacity={op} />
          ))}
          <Rect x={0} y={95} width={100} height={5} fill={accent} opacity={op * 0.6} />
        </>
      );
    case 'storefronts':
      return (
        <>
          <Path d="M0 0 H100 V12 H0 Z" fill={accent} opacity={op} />
          {[10, 30, 70, 90].map((x) => (
            <Rect key={x} x={x - 4} y={2} width={8} height={8} rx={1.5} fill={palette.cream} opacity={0.5} />
          ))}
          <Path d="M0 100 H100 V90 H0 Z" fill={accent} opacity={op * 0.5} />
        </>
      );
    default:
      return null;
  }
}

export function EnvironmentBackdrop({ environmentId, style, subtle }: EnvironmentBackdropProps) {
  const env = getEnvironment(environmentId);
  return (
    <View style={[StyleSheet.absoluteFill, style]} pointerEvents="none">
      <LinearGradient
        colors={[env.top, env.bottom]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <Svg
        style={StyleSheet.absoluteFill}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        opacity={subtle ? 0.4 : 1}
      >
        <Decoration kind={env.decoration} accent={env.accent} />
      </Svg>
    </View>
  );
}

export default EnvironmentBackdrop;
