import { darken, withAlpha } from '../color.js';
import { defineEra } from '../types.js';

/**
 * Terminal / CRT, 1970s to 80s. Monospace everything, phosphor glow,
 * scanlines, zero radius, no motion worth the name.
 *
 * The defining derivation is the glow: a phosphor tube does not have an
 * accent colour so much as an emission colour, so the accent becomes a light
 * source and everything interactive bleeds it a little. On a light palette
 * the metaphor strains, which is honest: there was no light-mode CRT. The
 * recipes still resolve, they just read as a printout rather than a screen.
 */
export const terminalCrt = defineEra({
  id: 'terminal-crt',
  label: 'Terminal / CRT',
  period: '1970s to 80s',
  shape: {
    radiusNone: '0',
    radiusSm: '0',
    radiusMd: '0',
    radiusLg: '0',
    radiusPill: '0',
    borderWidth: '1px',
    borderStyle: 'solid',
    spacingUnit: '6px',
    densityScale: '1',
    fontSans: "'IBM Plex Mono', 'Cascadia Mono', Consolas, 'Courier New', monospace",
    fontMono: "'IBM Plex Mono', 'Cascadia Mono', Consolas, 'Courier New', monospace",
    fontWeightNormal: '400',
    fontWeightBold: '700',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    motionDuration: '0ms',
    motionEasing: 'step-end',
    focusWidth: '1px',
    focusOffset: '2px',
  },
  derive: (s) => ({
    glow: withAlpha(s.accent, 0.55),
    'glow-soft': withAlpha(s.accent, 0.22),
    'glow-text': withAlpha(s.text, 0.45),
    // Scanlines are a dark overlay stripe, so they come from the surface
    // pushed toward black at low alpha and read on light palettes as a faint
    // print texture rather than vanishing.
    scanline: withAlpha(darken(s.surface, 0.7), 0.16),
    'phosphor-fill': withAlpha(s.accent, 0.1),
    'shadow-raised': '0 0 10px ' + withAlpha(s.accent, 0.35),
    'shadow-overlay': '0 0 24px ' + withAlpha(s.accent, 0.5),
    'focus-color': s.accent,
  }),
});
