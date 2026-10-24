/**
 * Era ids available in milestone 1. The era axis controls shape and feel only.
 */
export const ERAS = ['classic-windows', 'frutiger-aero', 'flat-metro'] as const;

/**
 * Palette ids available in milestone 1. The palette axis controls color only.
 */
export const PALETTES = ['dracula', 'nord', 'solarized-light'] as const;

export type EraId = (typeof ERAS)[number];
export type PaletteId = (typeof PALETTES)[number];
