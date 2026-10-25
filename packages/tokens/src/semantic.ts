import {
  ensureContrast,
  ensureContrastAll,
  mix,
  raise,
  readableOn,
  scaleChroma,
  sink,
} from './color.js';
import type { Palette, SemanticColors } from './types.js';

/**
 * Turn palette primitives into the semantic vocabulary eras are allowed to
 * read.
 *
 * The syntax mappings follow the project's stated defaults: keyword becomes
 * accent, string becomes success, error becomes danger, comment becomes muted
 * text. `function` becomes warning, because it is the remaining primitive that
 * reads as a caution colour across all three source themes (yellow in Dracula
 * and Solarized, amber in Nord) and using a real palette colour keeps warning
 * in character rather than inventing a hue the theme never had.
 *
 * Surfaces and borders are DERIVED rather than taken, because no VS Code theme
 * publishes a "raised surface". Deriving them with direction chosen from the
 * background's own lightness is what lets a light palette work without any
 * era knowing it is light.
 */
export function toSemantic(palette: Palette): SemanticColors {
  const p = palette.primitives;
  const surface = p.background;
  const surfaceRaised = raise(surface, 0.05);
  const surfaceSunken = sink(surface, 0.03);
  const allSurfaces = [surface, surfaceRaised, surfaceSunken] as const;

  return {
    surface,
    // A panel sitting above the page, and a well sunk into it. `raise` and
    // `sink` pick their direction from the surface, so these stay correct on
    // both light and dark palettes.
    surfaceRaised,
    surfaceSunken,

    // WCAG AA is 4.5:1 for body text and 3:1 for large text and status
    // colours. The source themes do not meet those bars in every role, so the
    // semantic layer corrects the tone while keeping hue and chroma. See
    // ensureContrast for the measured shortfalls.
    // Checked against every surface variant, not just the base: Solarized
    // Light's body text clears 4.5:1 on its base surface but only 3.58:1 on a
    // raised panel.
    text: ensureContrastAll(p.foreground, allSurfaces, 4.5),
    textMuted: ensureContrastAll(p.comment, allSurfaces, 3),
    // Text that sits on an accent fill. Choosing between the palette's own
    // two extremes is not sufficient: Solarized Light's olive accent reaches
    // only 2.97:1 against either. readableOn walks a tinted lightness ramp
    // instead, so every palette can clear WCAG AA here.
    textOnAccent: readableOn(ensureContrast(p.keyword, surface, 3), p.foreground),

    accent: ensureContrast(p.keyword, surface, 3),
    success: ensureContrast(p.string, surface, 3),
    warning: ensureContrast(p.function, surface, 3),
    danger: ensureContrast(p.error, surface, 3),

    // A border needs to read as a boundary without competing with text, so it
    // sits between the surface and the muted text, with chroma pulled back.
    border: scaleChroma(mix(surface, p.comment, 0.45), 0.6),

    selection: p.selection,
  };
}
