import { darken, isLight, lighten } from '../color.js';
import type { Era } from '../types.js';

/**
 * Neubrutalism, 2020s. Thick borders, hard offset shadows, flat fills, blunt
 * type. The era is a test that an era can be simple: almost nothing here is
 * derived, because the style's whole point is that nothing is softened.
 *
 * The one derivation that matters is the ink. The reference look uses pure
 * black borders and shadows, which disappear on a dark palette. So the ink is
 * the palette's text colour pushed to its own extreme: near-black on a light
 * palette, near-white on a dark one. The shadow is then a hard offset of that
 * ink with no blur at all.
 */
export const neubrutalism: Era = {
  id: 'neubrutalism',
  label: 'Neubrutalism',
  period: '2020s',
  shape: {
    radiusNone: '0',
    radiusSm: '2px',
    radiusMd: '4px',
    radiusLg: '8px',
    radiusPill: '999px',
    borderWidth: '3px',
    borderStyle: 'solid',
    spacingUnit: '8px',
    densityScale: '1.15',
    fontSans: "'Archivo', 'Arial Black', Impact, system-ui, sans-serif",
    fontMono: "'JetBrains Mono', Consolas, monospace",
    fontWeightNormal: '500',
    fontWeightBold: '800',
    letterSpacing: '0',
    textTransform: 'none',
    motionDuration: '80ms',
    motionEasing: 'steps(2, end)',
    focusWidth: '3px',
    focusOffset: '3px',
  },
  derive: (s) => {
    // Polarity follows the SURFACE, not the text. Keying off the text's own
    // lightness produced a pale blue-grey ink on Solarized Light, whose
    // contrast-corrected text sits near the midpoint. On a light surface the
    // ink goes dark; on a dark surface it goes light.
    const ink = isLight(s.surface) ? darken(s.text, 0.8) : lighten(s.text, 0.6);
    return {
      ink,
      'shadow-hard': '4px 4px 0 0 ' + ink,
      'shadow-hard-sm': '2px 2px 0 0 ' + ink,
      'shadow-hard-lg': '8px 8px 0 0 ' + ink,
      'shadow-raised': '4px 4px 0 0 ' + ink,
      'shadow-overlay': '10px 10px 0 0 ' + ink,
      'focus-color': ink,
    };
  },
};
