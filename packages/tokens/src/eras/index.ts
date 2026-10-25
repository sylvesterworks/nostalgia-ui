import type { Era } from '../types.js';

import { classicWindows } from './classic-windows.js';
import { flatMetro } from './flat-metro.js';
import { frutigerAero } from './frutiger-aero.js';

export const eras: readonly Era[] = [classicWindows, frutigerAero, flatMetro];

export const ERA_IDS = ['classic-windows', 'frutiger-aero', 'flat-metro'] as const;
export type EraId = (typeof ERA_IDS)[number];

export function getEra(id: string): Era {
  const found = eras.find((era) => era.id === id);
  if (found === undefined) {
    throw new Error('Unknown era: ' + id);
  }
  return found;
}

export { classicWindows, frutigerAero, flatMetro };
