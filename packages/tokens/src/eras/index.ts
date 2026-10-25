import type { Era } from '../types.js';

import { classicWindows } from './classic-windows.js';
import { flatMetro } from './flat-metro.js';
import { frutigerAero } from './frutiger-aero.js';
import { neubrutalism } from './neubrutalism.js';
import { neumorphism } from './neumorphism.js';
import { terminalCrt } from './terminal-crt.js';

// Chronological. The timeline slider walks this order.
export const eras: readonly Era[] = [
  terminalCrt,
  classicWindows,
  frutigerAero,
  flatMetro,
  neumorphism,
  neubrutalism,
];

export const ERA_IDS = [
  'terminal-crt',
  'classic-windows',
  'frutiger-aero',
  'flat-metro',
  'neumorphism',
  'neubrutalism',
] as const;
export type EraId = (typeof ERA_IDS)[number];

export function getEra(id: string): Era {
  const found = eras.find((era) => era.id === id);
  if (found === undefined) {
    throw new Error('Unknown era: ' + id);
  }
  return found;
}

export { classicWindows, frutigerAero, flatMetro, terminalCrt, neubrutalism, neumorphism };
