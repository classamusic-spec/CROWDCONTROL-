import React from 'react';
import Svg, { Path, Circle, Rect, Line, Polygon, G } from 'react-native-svg';

import { palette } from '@/data/theme';

/**
 * Icon library for CROWDCONTROL.
 *
 * Every icon is an original 24x24 glyph drawn in a rounded, premium
 * casual-game style. Filled icons paint with `color`; stroked icons paint
 * with `strokeColor ?? color`.
 */
export type IconName =
  | 'star'
  | 'heart'
  | 'arrow'
  | 'timer'
  | 'remaining'
  | 'mistakes'
  | 'restart'
  | 'undo'
  | 'hint'
  | 'settings'
  | 'home'
  | 'levels'
  | 'stats'
  | 'customize'
  | 'share'
  | 'calendar'
  | 'streak'
  | 'lock'
  | 'trophy'
  | 'reward'
  | 'sound'
  | 'music'
  | 'haptics'
  | 'reducedmotion'
  | 'theme'
  | 'replay'
  | 'continue'
  | 'pause'
  | 'close'
  | 'back';

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeColor?: string;
}

const STROKE_WIDTH = 2;

export function Icon({
  name,
  size = 24,
  color = palette.white,
  strokeColor,
}: IconProps): React.ReactElement | null {
  const stroke = strokeColor ?? color;

  // Shared stroke props for line-based glyphs.
  const strokeProps = {
    stroke,
    strokeWidth: STROKE_WIDTH,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none' as const,
  };

  let content: React.ReactNode;

  switch (name) {
    case 'star':
      content = (
        <Polygon
          points="12,2.5 15,9 22,9.7 16.7,14.3 18.3,21 12,17.4 5.7,21 7.3,14.3 2,9.7 9,9"
          fill={color}
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          strokeLinejoin="round"
        />
      );
      break;

    case 'heart':
      content = (
        <Path
          d="M12 20.5C12 20.5 3.5 15 3.5 8.9C3.5 6.1 5.7 4 8.4 4C10 4 11.4 4.8 12 6.1C12.6 4.8 14 4 15.6 4C18.3 4 20.5 6.1 20.5 8.9C20.5 15 12 20.5 12 20.5Z"
          fill={color}
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          strokeLinejoin="round"
        />
      );
      break;

    case 'arrow':
      content = (
        <Path d="M5 14L12 7L19 14" {...strokeProps} />
      );
      break;

    case 'timer':
      content = (
        <G {...strokeProps}>
          <Circle cx={12} cy={13} r={8} />
          <Line x1={12} y1={13} x2={12} y2={8.5} />
          <Line x1={12} y1={13} x2={15} y2={14.5} />
          <Line x1={9.5} y1={3} x2={14.5} y2={3} />
        </G>
      );
      break;

    case 'remaining':
      content = (
        <G>
          <Rect x={4} y={4} width={7} height={7} rx={2} fill={color} />
          <Rect x={13} y={4} width={7} height={7} rx={2} fill={color} />
          <Rect x={4} y={13} width={7} height={7} rx={2} fill={color} />
          <Rect x={13} y={13} width={7} height={7} rx={2} fill={color} />
        </G>
      );
      break;

    case 'mistakes':
      content = (
        <G {...strokeProps}>
          <Circle cx={12} cy={12} r={9} />
          <Line x1={8.5} y1={8.5} x2={15.5} y2={15.5} />
          <Line x1={15.5} y1={8.5} x2={8.5} y2={15.5} />
        </G>
      );
      break;

    case 'restart':
      content = (
        <G {...strokeProps}>
          <Path d="M19 12C19 15.9 15.9 19 12 19C8.1 19 5 15.9 5 12C5 8.1 8.1 5 12 5C14.4 5 16.5 6.2 17.8 8" />
          <Path d="M18.5 4.5L18 8.2L14.3 7.6" />
        </G>
      );
      break;

    case 'undo':
      content = (
        <G {...strokeProps}>
          <Path d="M8 8L4 12L8 16" />
          <Path d="M4 12H14C17 12 19 14 19 17V18" />
        </G>
      );
      break;

    case 'hint':
      content = (
        <G {...strokeProps}>
          <Path d="M9 15.5C7.2 14.4 6 12.4 6 10C6 6.7 8.7 4 12 4C15.3 4 18 6.7 18 10C18 12.4 16.8 14.4 15 15.5V17.5H9V15.5Z" />
          <Line x1={9.5} y1={20.5} x2={14.5} y2={20.5} />
        </G>
      );
      break;

    case 'settings':
      content = (
        <G {...strokeProps}>
          <Circle cx={12} cy={12} r={3.2} />
          <Path d="M12 3V5.5M12 18.5V21M21 12H18.5M5.5 12H3M18.4 5.6L16.6 7.4M7.4 16.6L5.6 18.4M18.4 18.4L16.6 16.6M7.4 7.4L5.6 5.6" />
        </G>
      );
      break;

    case 'home':
      content = (
        <G {...strokeProps}>
          <Path d="M4 11L12 4L20 11V20C20 20.6 19.6 21 19 21H5C4.4 21 4 20.6 4 20V11Z" />
          <Path d="M9.5 21V14.5H14.5V21" />
        </G>
      );
      break;

    case 'levels':
      content = (
        <G {...strokeProps}>
          <Path d="M12 3L21 8L12 13L3 8L12 3Z" />
          <Path d="M3 12L12 17L21 12" />
          <Path d="M3 16L12 21L21 16" />
        </G>
      );
      break;

    case 'stats':
      content = (
        <G {...strokeProps}>
          <Line x1={6} y1={20} x2={6} y2={13} />
          <Line x1={12} y1={20} x2={12} y2={7} />
          <Line x1={18} y1={20} x2={18} y2={10} />
          <Line x1={3.5} y1={20.5} x2={20.5} y2={20.5} />
        </G>
      );
      break;

    case 'customize':
      content = (
        <G {...strokeProps}>
          <Line x1={4} y1={7} x2={20} y2={7} />
          <Line x1={4} y1={12} x2={20} y2={12} />
          <Line x1={4} y1={17} x2={20} y2={17} />
          <Circle cx={9} cy={7} r={2.4} fill={stroke} />
          <Circle cx={15} cy={12} r={2.4} fill={stroke} />
          <Circle cx={8} cy={17} r={2.4} fill={stroke} />
        </G>
      );
      break;

    case 'share':
      content = (
        <G {...strokeProps}>
          <Circle cx={17} cy={5.5} r={2.5} />
          <Circle cx={6} cy={12} r={2.5} />
          <Circle cx={17} cy={18.5} r={2.5} />
          <Line x1={8.2} y1={10.8} x2={14.8} y2={6.7} />
          <Line x1={8.2} y1={13.2} x2={14.8} y2={17.3} />
        </G>
      );
      break;

    case 'calendar':
      content = (
        <G {...strokeProps}>
          <Rect x={4} y={5} width={16} height={16} rx={3} />
          <Line x1={4} y1={9.5} x2={20} y2={9.5} />
          <Line x1={8.5} y1={3} x2={8.5} y2={6.5} />
          <Line x1={15.5} y1={3} x2={15.5} y2={6.5} />
        </G>
      );
      break;

    case 'streak':
      content = (
        <Path
          d="M12 2.5C12 2.5 6.5 7 6.5 13C6.5 16.6 9 20 12 20C15 20 17.5 16.6 17.5 13C17.5 11 16.5 9.5 15.5 8.5C15.5 10.5 14.5 11.5 13.5 11.5C14.2 9 12 5.5 12 2.5Z"
          fill={color}
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          strokeLinejoin="round"
        />
      );
      break;

    case 'lock':
      content = (
        <G {...strokeProps}>
          <Rect x={5} y={10} width={14} height={11} rx={2.5} />
          <Path d="M8 10V7.5C8 5.3 9.8 3.5 12 3.5C14.2 3.5 16 5.3 16 7.5V10" />
          <Circle cx={12} cy={15} r={1.4} fill={stroke} />
        </G>
      );
      break;

    case 'trophy':
      content = (
        <G {...strokeProps}>
          <Path d="M7 4H17V9C17 11.8 14.8 14 12 14C9.2 14 7 11.8 7 9V4Z" />
          <Path d="M7 5.5H4.5V7C4.5 8.4 5.6 9.5 7 9.5" />
          <Path d="M17 5.5H19.5V7C19.5 8.4 18.4 9.5 17 9.5" />
          <Line x1={12} y1={14} x2={12} y2={17.5} />
          <Path d="M8.5 20.5H15.5L14.5 17.5H9.5L8.5 20.5Z" />
        </G>
      );
      break;

    case 'reward':
      content = (
        <G {...strokeProps}>
          <Rect x={4} y={9} width={16} height={12} rx={2} />
          <Line x1={4} y1={13} x2={20} y2={13} />
          <Line x1={12} y1={9} x2={12} y2={21} />
          <Path d="M12 9C12 9 11 4.5 8.5 4.5C7.1 4.5 6.5 5.6 6.5 6.5C6.5 8.2 8.8 9 12 9Z" />
          <Path d="M12 9C12 9 13 4.5 15.5 4.5C16.9 4.5 17.5 5.6 17.5 6.5C17.5 8.2 15.2 9 12 9Z" />
        </G>
      );
      break;

    case 'sound':
      content = (
        <G {...strokeProps}>
          <Path d="M4 9.5H7L11.5 5.5V18.5L7 14.5H4V9.5Z" fill={stroke} />
          <Path d="M15 9C16 10 16 14 15 15" />
          <Path d="M17.5 6.5C19.5 8.5 19.5 15.5 17.5 17.5" />
        </G>
      );
      break;

    case 'music':
      content = (
        <G {...strokeProps}>
          <Path d="M9 18V6L18 4V15" />
          <Circle cx={6.5} cy={18} r={2.5} fill={stroke} />
          <Circle cx={15.5} cy={15} r={2.5} fill={stroke} />
        </G>
      );
      break;

    case 'haptics':
      content = (
        <G {...strokeProps}>
          <Rect x={8} y={4} width={8} height={16} rx={2} />
          <Line x1={4} y1={9} x2={4} y2={15} />
          <Line x1={20} y1={9} x2={20} y2={15} />
        </G>
      );
      break;

    case 'reducedmotion':
      content = (
        <G {...strokeProps}>
          <Path d="M4 10C6 8 8 8 10 10C11.2 11.2 12.4 11.6 13.6 11.2" />
          <Path d="M6 15C7.5 13.7 9 13.9 10.5 15" />
          <Line x1={4} y1={4} x2={20} y2={20} />
        </G>
      );
      break;

    case 'theme':
      content = (
        <G {...strokeProps}>
          <Circle cx={12} cy={12} r={8.5} />
          <Path d="M12 3.5C16.7 3.5 20.5 7.3 20.5 12C20.5 16.7 16.7 20.5 12 20.5V3.5Z" fill={stroke} />
        </G>
      );
      break;

    case 'replay':
      content = (
        <G {...strokeProps}>
          <Path d="M5 12C5 8.1 8.1 5 12 5C15.9 5 19 8.1 19 12C19 15.9 15.9 19 12 19C9.6 19 7.5 17.8 6.2 16" />
          <Path d="M5.5 19.5L6 15.8L9.7 16.4" />
          <Path d="M10.5 9.5L15 12L10.5 14.5V9.5Z" fill={stroke} />
        </G>
      );
      break;

    case 'continue':
      content = (
        <Path
          d="M7 4.5L19 12L7 19.5V4.5Z"
          fill={color}
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          strokeLinejoin="round"
        />
      );
      break;

    case 'pause':
      content = (
        <G>
          <Rect x={6.5} y={4.5} width={4} height={15} rx={2} fill={color} />
          <Rect x={13.5} y={4.5} width={4} height={15} rx={2} fill={color} />
        </G>
      );
      break;

    case 'close':
      content = (
        <Path d="M6 6L18 18M18 6L6 18" {...strokeProps} />
      );
      break;

    case 'back':
      content = (
        <Path d="M15 5L8 12L15 19" {...strokeProps} />
      );
      break;

    default:
      return null;
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {content}
    </Svg>
  );
}

export default Icon;
