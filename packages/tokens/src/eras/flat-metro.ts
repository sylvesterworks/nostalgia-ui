import { raise, sink } from '../color.js';
import type { Era } from '../types.js';

/**
 * Flat / Metro, early 2010s. Solid fills, bold type, tiles, no shadows and no
 * gradients.
 *
 * This era is defined as much by what it removes as by what it adds, so
 * several of its derived values are deliberately 'none'. It still needs
 * derived colour for interaction: with shadow and gradient both forbidden, a
 * hover or pressed state can only be expressed as a shift in fill.
 */
export const flatMetro: Era = {
  id: 'flat-metro',
  label: 'Flat / Metro',
  period: 'early 2010s',
  shape: {
    radiusNone: '0',
    radiusSm: '0',
    radiusMd: '0',
    radiusLg: '0',
    radiusPill: '0',
    borderWidth: '0',
    borderStyle: 'solid',
    spacingUnit: '8px',
    densityScale: '1.2',
    fontSans: "'Segoe UI', 'Open Sans', 'Helvetica Neue', system-ui, sans-serif",
    fontMono: 'Consolas, Menlo, monospace',
    fontWeightNormal: '300',
    fontWeightBold: '600',
    letterSpacing: '0.02em',
    textTransform: 'none',
    motionDuration: '120ms',
    motionEasing: 'linear',
    focusWidth: '2px',
    focusOffset: '0',
  },
  derive: (s) => ({
    'tile-fill': s.accent,
    'tile-hover': raise(s.accent, 0.08),
    'tile-active': sink(s.accent, 0.08),
    'surface-hover': raise(s.surface, 0.06),
    'surface-active': sink(s.surface, 0.05),
    divider: raise(s.surface, 0.12),
    'shadow-raised': 'none',
    'shadow-overlay': 'none',
    'focus-color': s.text,
  }),
};
