import { raise, scaleChroma, sink, withAlpha } from '../color.js';
import type { Era } from '../types.js';

/**
 * Frutiger Aero / Aqua, 2000s. Gloss, translucency, generous rounding, soft
 * shadows.
 *
 * The signature is a highlight band across the top half of a control, as
 * though it were a curved piece of wet glass. That band runs from a strong
 * light overlay to nothing, and has to be derived from the fill underneath or
 * it reads as plastic film laid over the wrong colour.
 */
export const frutigerAero: Era = {
  id: 'frutiger-aero',
  label: 'Frutiger Aero',
  period: '2000s',
  shape: {
    radiusNone: '0',
    radiusSm: '6px',
    radiusMd: '10px',
    radiusLg: '16px',
    radiusPill: '999px',
    borderWidth: '1px',
    borderStyle: 'solid',
    spacingUnit: '6px',
    densityScale: '1.1',
    fontSans: "Frutiger, 'Segoe UI', 'Helvetica Neue', system-ui, sans-serif",
    fontMono: 'Consolas, Monaco, monospace',
    fontWeightNormal: '400',
    fontWeightBold: '600',
    letterSpacing: '0.01em',
    textTransform: 'none',
    motionDuration: '220ms',
    motionEasing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    focusWidth: '3px',
    focusOffset: '2px',
  },
  derive: (s) => {
    const highlight = raise(s.surface, 0.5);
    const depth = sink(s.surface, 0.3);
    return {
      'gloss-top': withAlpha(highlight, 0.55),
      'gloss-mid': withAlpha(highlight, 0.12),
      'gloss-bottom': withAlpha(highlight, 0),
      'sheen-bottom': withAlpha(highlight, 0.22),
      'glass-fill': withAlpha(raise(s.surface, 0.18), 0.72),
      'glass-border': withAlpha(highlight, 0.45),
      'shadow-raised':
        '0 1px 3px ' + withAlpha(depth, 0.32) + ', 0 6px 14px ' + withAlpha(depth, 0.18),
      'shadow-overlay': '0 10px 40px ' + withAlpha(depth, 0.45),
      'accent-gloss-top': withAlpha(raise(s.accent, 0.35), 0.75),
      'accent-gloss-bottom': withAlpha(sink(s.accent, 0.1), 0.2),
      'accent-vivid': scaleChroma(s.accent, 1.15),
      'focus-color': s.accent,
    };
  },
};
