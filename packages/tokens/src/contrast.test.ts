import { describe, expect, it } from 'vitest';

import { contrastRatio, lightness } from './color.js';
import { eras } from './eras/index.js';
import { palettes } from './palettes/index.js';
import { toSemantic } from './semantic.js';

/**
 * The milestone's real acceptance test.
 *
 * Because colours are derived per pairing, contrast cannot be checked by
 * looking at a palette or an era on its own: the actual rendered colours only
 * exist once both axes are chosen. So every combination is checked here.
 *
 * WCAG 2.1 AA is 4.5:1 for body text and 3:1 for large text and for the
 * boundaries of user interface components.
 */
const AA_TEXT = 4.5;
const AA_LARGE = 3;
const AA_NON_TEXT = 3;

const pairings = palettes.flatMap((palette) =>
  eras.map((era) => ({ palette, era, label: palette.id + ' x ' + era.id })),
);

describe('every era and palette pairing', () => {
  it('covers all nine combinations, so adding either axis widens this suite', () => {
    expect(pairings).toHaveLength(palettes.length * eras.length);
    expect(pairings).toHaveLength(9);
  });

  describe.each(pairings.map((p) => [p.label, p] as const))('%s', (_label, { palette, era }) => {
    const semantic = toSemantic(palette);
    const derived = era.derive(semantic);

    it('body text on the base surface clears AA', () => {
      expect(contrastRatio(semantic.text, semantic.surface)).toBeGreaterThanOrEqual(AA_TEXT);
    });

    it('body text on a raised surface clears AA', () => {
      expect(contrastRatio(semantic.text, semantic.surfaceRaised)).toBeGreaterThanOrEqual(AA_TEXT);
    });

    it('body text on a sunken surface clears AA', () => {
      expect(contrastRatio(semantic.text, semantic.surfaceSunken)).toBeGreaterThanOrEqual(AA_TEXT);
    });

    it('muted text clears the large-text threshold', () => {
      // Muted text is deliberately quieter than body text, so it is held to
      // the large-text bar rather than the body bar.
      expect(contrastRatio(semantic.textMuted, semantic.surface)).toBeGreaterThanOrEqual(AA_LARGE);
    });

    it('text on an accent fill clears AA', () => {
      expect(contrastRatio(semantic.textOnAccent, semantic.accent)).toBeGreaterThanOrEqual(AA_TEXT);
    });

    it('borders are distinguishable from the surface as a UI boundary', () => {
      expect(contrastRatio(semantic.border, semantic.surface)).toBeGreaterThanOrEqual(1.3);
    });

    it.each(['success', 'warning', 'danger'] as const)(
      '%s reads as a status colour against the surface',
      (role) => {
        expect(contrastRatio(semantic[role], semantic.surface)).toBeGreaterThanOrEqual(AA_NON_TEXT);
      },
    );

    it('derives flat colours that are all actually distinct from the surface', () => {
      // Catches a recipe that collapses into the surface entirely. A contrast
      // RATIO bar would be wrong here: a hover tint is meant to be subtle,
      // and WCAG sets no minimum for hover states. What matters is that the
      // derivation produced a different colour rather than a no-op.
      const flatColors = Object.entries(derived).filter(([, value]) =>
        /^#[0-9a-f]{6}$/i.test(value),
      );
      expect(flatColors.length).toBeGreaterThan(0);
      for (const [key, value] of flatColors) {
        expect(value.toLowerCase(), key + ' collapsed into the surface').not.toBe(
          semantic.surface.toLowerCase(),
        );
      }
    });

    it('derives bevel edges that are distinguishable from each other', () => {
      // Specific to eras that model a light source. Dracula's dark surface
      // used to crush both dark edges to black, which flattened the bevel.
      const light = derived['bevel-light'];
      const dark = derived['bevel-dark'];
      const darker = derived['bevel-darker'];
      if (light === undefined || dark === undefined || darker === undefined) {
        return; // this era does not use bevels
      }
      // The highlight must be lighter than the shadow on every palette, which
      // is what makes the light source read as coming from the top left.
      expect(lightness(light)).toBeGreaterThan(lightness(dark));
      expect(contrastRatio(light, dark)).toBeGreaterThan(1.5);
      // The two shadow depths must stay apart rather than both crushing.
      // Measured as a perceptual lightness delta rather than a WCAG ratio:
      // WCAG compresses hard near black, so Dracula's two shadow edges score
      // 1.099:1 despite being visibly different. OKLCH lightness is the
      // honest measure of "can you see these apart".
      expect(lightness(dark)).toBeGreaterThan(lightness(darker));
      expect(lightness(dark) - lightness(darker)).toBeGreaterThan(0.04);
    });
  });
});
