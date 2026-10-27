import { darken, lighten, raise, withAlpha } from '../color.js';
import { defineEra } from '../types.js';

/**
 * Classic Windows, 1990s. Grey chrome, hard 2px bevels, zero radius, no
 * transitions.
 *
 * The defining feature is the bevel: a light edge on the top and left, a dark
 * edge on the bottom and right, which together imply a light source in the
 * top-left corner. Those two edges are the clearest case for deriving colour
 * rather than hand picking it. Fixed greys would look correct on a grey
 * palette and wrong on every other one.
 *
 * The bevel uses `lighten` and `darken` rather than `raise` and `sink`,
 * because a light source is not relative to the palette. The highlight edge
 * is lighter than the surface on a cream palette just as much as on a
 * charcoal one. Using the polarity-relative helpers inverted the bevel on
 * Solarized Light and clamped both dark edges to white.
 */
export const classicWindows = defineEra({
  id: 'classic-windows',
  label: 'Classic Windows',
  period: '1990s',
  shape: {
    radiusNone: '0',
    radiusSm: '0',
    radiusMd: '0',
    radiusLg: '0',
    radiusPill: '0',
    borderWidth: '2px',
    borderStyle: 'solid',
    spacingUnit: '4px',
    densityScale: '0.9',
    fontSans: "Tahoma, 'MS Sans Serif', 'Segoe UI', system-ui, sans-serif",
    fontMono: "'Courier New', Consolas, monospace",
    fontWeightNormal: '400',
    fontWeightBold: '700',
    letterSpacing: '0',
    textTransform: 'none',
    motionDuration: '0ms',
    motionEasing: 'step-end',
    focusWidth: '1px',
    focusOffset: '-4px',
  },
  derive: (s) => ({
    'bevel-light': lighten(s.surface, 0.45),
    'bevel-lighter': lighten(s.surface, 0.72),
    'bevel-dark': darken(s.surface, 0.35),
    'bevel-darker': darken(s.surface, 0.62),
    'control-face': raise(s.surface, 0.04),
    'titlebar-fill': s.accent,
    'titlebar-text': s.textOnAccent,
    'focus-color': s.text,
    'shadow-raised': 'none',
    'shadow-overlay': '2px 2px 0 0 ' + withAlpha(darken(s.surface, 0.7), 0.5),
  }),
});
