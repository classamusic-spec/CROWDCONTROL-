import { palette } from '@/data/theme';

/**
 * The six environments. Colors + decoration hints drive the procedural
 * EnvironmentBackdrop (Asset Mode B). Unlock gates match PRODUCT_SPEC §7.
 */

export type EnvironmentDecoration = 'stage' | 'gates' | 'tunnel' | 'rides' | 'lockers' | 'storefronts';

export type Environment = {
  id: string;
  name: string;
  unlockLevel: number;
  /** Top-of-screen gradient color. */
  top: string;
  /** Bottom-of-screen gradient color. */
  bottom: string;
  /** Frame/decoration accent. */
  accent: string;
  decoration: EnvironmentDecoration;
};

export const environments: Environment[] = [
  { id: 'concert', name: 'Concert Venue', unlockLevel: 1, top: '#1B0E3D', bottom: palette.primaryNavy, accent: palette.purple, decoration: 'stage' },
  { id: 'airport', name: 'Airport Terminal', unlockLevel: 11, top: '#0E2A5C', bottom: palette.primaryNavy, accent: palette.brightBlue, decoration: 'gates' },
  { id: 'subway', name: 'Subway Station', unlockLevel: 21, top: '#10222E', bottom: palette.primaryNavy, accent: palette.teal, decoration: 'tunnel' },
  { id: 'themepark', name: 'Theme Park', unlockLevel: 31, top: '#3A1230', bottom: palette.primaryNavy, accent: palette.pink, decoration: 'rides' },
  { id: 'school', name: 'School Hallway', unlockLevel: 41, top: '#0E3A2E', bottom: palette.primaryNavy, accent: palette.green, decoration: 'lockers' },
  { id: 'mall', name: 'Shopping Mall', unlockLevel: 51, top: '#3A2A0E', bottom: palette.primaryNavy, accent: palette.orange, decoration: 'storefronts' },
];

const byId = new Map(environments.map((e) => [e.id, e]));

export function getEnvironment(id: string): Environment {
  return byId.get(id) ?? (environments[0] as Environment);
}

/** Environments unlocked at or below the given highest level reached. */
export function unlockedEnvironments(highestLevel: number): Environment[] {
  return environments.filter((e) => highestLevel >= e.unlockLevel);
}
