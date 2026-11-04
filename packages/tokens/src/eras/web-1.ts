import { darken, ensureContrastAll, mix, withAlpha } from '../color.js';
import { defineEra } from '../types.js';

/**
 * Web 1.0, late 1990s. The browser's own form controls, tables with bevelled
 * frames, underlined links, a serif body and a tiled page background.
 *
 * The bevels are CSS's own `outset` and `inset` border styles, which the
 * browser shades from a single border color, just as browsers drew form
 * controls then. That keeps the era apart from Classic Windows, whose bevel
 * is built edge by edge from derived colors.
 *
 * The links of the period were blue, but hue belongs to the palette, so the
 * link is the palette's accent with its tone corrected until it reads as
 * text on every surface. The accent alone is only held to 3:1, and was
 * 3.01:1 on Solarized Light's surface (#13).
 *
 * The tile is a second surface tone for the page's tiled background. It sits
 * between the base and raised surfaces, so body and muted text stay at 4.5:1
 * on it; the pattern is quieter than the loud tiles of the period for that
 * reason.
 */
export const web1 = defineEra({
  id: 'web-1',
  label: 'Web 1.0',
  period: 'late 1990s',
  shape: {
    radiusNone: '0',
    radiusSm: '0',
    radiusMd: '0',
    radiusLg: '0',
    radiusPill: '0',
    borderWidth: '2px',
    borderStyle: 'outset',
    spacingUnit: '4px',
    densityScale: '1',
    fontSans: "'Times New Roman', Times, serif",
    fontMono: "'Courier New', Courier, monospace",
    fontWeightNormal: '400',
    fontWeightBold: '700',
    letterSpacing: '0',
    textTransform: 'none',
    motionDuration: '0ms',
    motionEasing: 'step-end',
    focusWidth: '1px',
    focusOffset: '1px',
  },
  derive: (s) => ({
    link: ensureContrastAll(s.accent, [s.surface, s.surfaceRaised, s.surfaceSunken], 4.5),
    tile: mix(s.surface, s.surfaceRaised, 0.6),
    'shadow-raised': 'none',
    'shadow-overlay': '3px 3px 0 0 ' + withAlpha(darken(s.surface, 0.7), 0.5),
    'focus-color': s.text,
  }),
  textFills: ['tile'],
});
