import { darken, lighten, withAlpha } from '../color.js';
import type { Era } from '../types.js';

/**
 * Neumorphism, around 2020. Soft extruded shapes that appear pressed out of,
 * or into, the surface they sit on. Every element shares the surface colour
 * and is distinguished only by a pair of shadows, one light from the top
 * left, one dark from the bottom right.
 *
 * The brief marks this era as the contrast stress test, and it earns that.
 * With no fills and no borders, the only contrast available is text against
 * the one surface colour, which the semantic layer already enforces, and the
 * shadow pair against that same surface, which this file has to get right on
 * both a near-black Dracula and a near-white Solarized. On the light end the
 * light shadow has nowhere to go, so the dark shadow carries the shape alone.
 */
export const neumorphism: Era = {
  id: 'neumorphism',
  label: 'Neumorphism',
  period: 'around 2020',
  shape: {
    radiusNone: '0',
    radiusSm: '12px',
    radiusMd: '18px',
    radiusLg: '28px',
    radiusPill: '999px',
    borderWidth: '0',
    borderStyle: 'none',
    spacingUnit: '8px',
    densityScale: '1.2',
    fontSans: "'Inter', 'Segoe UI', system-ui, sans-serif",
    fontMono: "'JetBrains Mono', Consolas, monospace",
    fontWeightNormal: '400',
    fontWeightBold: '600',
    letterSpacing: '0',
    textTransform: 'none',
    motionDuration: '180ms',
    motionEasing: 'ease-out',
    focusWidth: '2px',
    focusOffset: '4px',
  },
  derive: (s) => {
    const light = withAlpha(lighten(s.surface, 0.6), 0.9);
    const dark = withAlpha(darken(s.surface, 0.55), 0.6);
    return {
      'shadow-light': light,
      'shadow-dark': dark,
      'shadow-raised': '-6px -6px 14px ' + light + ', 6px 6px 14px ' + dark,
      'shadow-raised-sm': '-3px -3px 7px ' + light + ', 3px 3px 7px ' + dark,
      'shadow-inset': 'inset -4px -4px 10px ' + light + ', inset 4px 4px 10px ' + dark,
      'shadow-overlay': '-10px -10px 24px ' + light + ', 10px 10px 24px ' + dark,
      'focus-color': s.accent,
    };
  },
};
