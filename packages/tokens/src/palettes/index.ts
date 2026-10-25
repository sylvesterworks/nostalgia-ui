import type { Palette } from '../types.js';

import { catppuccinMocha } from './catppuccin-mocha.js';
import { dracula } from './dracula.js';
import { nord } from './nord.js';
import { oneDarkPro } from './one-dark-pro.js';
import { solarizedLight } from './solarized-light.js';

export const palettes: readonly Palette[] = [
  dracula,
  nord,
  solarizedLight,
  catppuccinMocha,
  oneDarkPro,
];

export const PALETTE_IDS = [
  'dracula',
  'nord',
  'solarized-light',
  'catppuccin-mocha',
  'one-dark-pro',
] as const;
export type PaletteId = (typeof PALETTE_IDS)[number];

export function getPalette(id: string): Palette {
  const found = palettes.find((palette) => palette.id === id);
  if (found === undefined) {
    throw new Error(`Unknown palette: ${id}`);
  }
  return found;
}

export { dracula, nord, solarizedLight, catppuccinMocha, oneDarkPro };
