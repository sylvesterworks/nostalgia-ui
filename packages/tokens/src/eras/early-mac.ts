import { defineEra } from '../types.js';

/**
 * Early Mac, 1984 to 1991. A 1-bit screen: everything is drawn in two tones,
 * with dithered patterns where a gray would be, square windows with striped
 * title bars, rounded push buttons and an X in a ticked box.
 *
 * The two tones are the palette's own text and surface, not black and white.
 * Pushing them to the extremes made every palette near-black on near-white
 * (15.37 to 20:1), so the palettes looked alike; the semantic pair keeps each
 * palette recognizable and is already held to 4.5:1 by the audit. Muted text
 * keeps its own semantic color, a third tone, so a placeholder still looks
 * different from a value (#12).
 *
 * There is no accent. A state that carries text, such as a solid button, a
 * selected tab or a highlighted item, is drawn by inverting the two tones. A
 * fill with no text on it, such as a slider's range, is a 50% dither of the
 * two. Each pattern is a background image only; a stylesheet sets its size.
 */
export const earlyMac = defineEra({
  id: 'early-mac',
  label: 'Early Mac',
  period: '1984 to 91',
  shape: {
    radiusNone: '0',
    radiusSm: '0',
    radiusMd: '6px',
    radiusLg: '0',
    radiusPill: '999px',
    borderWidth: '1px',
    borderStyle: 'solid',
    spacingUnit: '4px',
    densityScale: '1',
    fontSans: "Chicago, ChicagoFLF, Geneva, 'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontMono: "Monaco, 'Courier New', monospace",
    fontWeightNormal: '400',
    fontWeightBold: '700',
    letterSpacing: '0',
    textTransform: 'none',
    motionDuration: '0ms',
    motionEasing: 'step-end',
    focusWidth: '1px',
    focusOffset: '2px',
  },
  derive: (s) => ({
    // The drawing tone, as a token of its own so stylesheets can read it as
    // the era's pen. It is the semantic text color unchanged.
    pen: s.text,
    // A 50% checkerboard of the two tones, drawn at 1px per check with a
    // 2px background-size: the era's gray.
    dither: 'repeating-conic-gradient(' + s.text + ' 0% 25%, ' + s.surface + ' 0% 50%)',
    // Horizontal pinstripes, one line of each tone: the title bar of a
    // window, drawn at a 2px background-size.
    stripes:
      'repeating-linear-gradient(to bottom, ' + s.text + ' 0 1px, ' + s.surface + ' 1px 2px)',
    'shadow-raised': '1px 1px 0 0 ' + s.text,
    'shadow-overlay': '2px 2px 0 0 ' + s.text,
    'focus-color': s.text,
  }),
});
