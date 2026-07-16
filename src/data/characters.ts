import { palette } from '@/data/theme';

/**
 * The 12 base character identities. Each maps to a color scheme used by the
 * procedural CrowdSprite (Asset Mode B) and, later, to a raster sprite when
 * upgraded. See docs/ASSET_MANIFEST.md and docs/ASSET_GENERATION_QUEUE.md.
 */

export type CharacterVariant = {
  id: string;
  name: string;
  /** Main body/clothing color. */
  body: string;
  /** Secondary accent (cap, glasses, hair, etc.). */
  accent: string;
  /** Skin tone. */
  skin: string;
  /** Hair color. */
  hair: string;
};

export const characterVariants: CharacterVariant[] = [
  { id: 'bluehoodie', name: 'Blue Hoodie', body: palette.brightBlue, accent: palette.deepBlue, skin: '#F2C9A0', hair: '#5A3A24' },
  { id: 'pinkpigtail', name: 'Pink Pigtails', body: palette.pink, accent: palette.red, skin: '#F7D2B0', hair: '#7A3F2C' },
  { id: 'greencap', name: 'Green Cap', body: palette.green, accent: palette.darkGreen, skin: '#E8B98C', hair: '#2C2018' },
  { id: 'purpleglasses', name: 'Purple Glasses', body: palette.purple, accent: palette.yellow, skin: '#F2C9A0', hair: '#221A14' },
  { id: 'orangeheadphones', name: 'Orange Headphones', body: palette.orange, accent: palette.darkOrange, skin: '#D9A06B', hair: '#1C1712' },
  { id: 'yellowoveralls', name: 'Yellow Overalls', body: palette.yellow, accent: palette.brightBlue, skin: '#F7D2B0', hair: '#3A2A1C' },
  { id: 'curlyhair', name: 'Curly Hair', body: palette.teal, accent: palette.cream, skin: '#C98A5A', hair: '#241812' },
  { id: 'oldertraveler', name: 'Traveler', body: palette.mutedBlue, accent: palette.secondaryNavy, skin: '#E8B98C', hair: '#C9C4BD' },
  { id: 'sportsfan', name: 'Sports Fan', body: palette.red, accent: palette.white, skin: '#F2C9A0', hair: '#3A2A1C' },
  { id: 'student', name: 'Student', body: palette.deepBlue, accent: palette.orange, skin: '#D9A06B', hair: '#1C1712' },
  { id: 'mallshopper', name: 'Shopper', body: palette.pink, accent: palette.teal, skin: '#F7D2B0', hair: '#5A3A24' },
  { id: 'festivalattendee', name: 'Festival Fan', body: palette.purple, accent: palette.green, skin: '#E8B98C', hair: '#7A3F2C' },
];

const byId = new Map(characterVariants.map((c) => [c.id, c]));

export function getCharacterVariant(id: string): CharacterVariant {
  return byId.get(id) ?? (characterVariants[0] as CharacterVariant);
}
