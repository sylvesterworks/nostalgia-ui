import { describe, expect, it } from 'vitest';

import { contrastRatio, hue, isLight, lightness } from './color.js';
import { palettes } from './palettes/index.js';
import { toSemantic } from './semantic.js';

describe('toSemantic', () => {
  it.each(palettes.map((p) => [p.id, p] as const))(
    '%s: raised sits above the surface and sunken below it',
    (_id, palette) => {
      const s = toSemantic(palette);
      const base = lightness(s.surface);
      const raised = lightness(s.surfaceRaised);
      const sunken = lightness(s.surfaceSunken);

      if (isLight(s.surface)) {
        // On a light palette "raised" means darker, so it reads as nearer.
        expect(raised).toBeLessThan(base);
        expect(sunken).toBeGreaterThan(base);
      } else {
        expect(raised).toBeGreaterThan(base);
        expect(sunken).toBeLessThan(base);
      }
    },
  );

  it.each(palettes.map((p) => [p.id, p] as const))(
    '%s: text on an accent fill is legible',
    (_id, palette) => {
      const s = toSemantic(palette);
      // 4.5:1 is WCAG AA for body text. Solarized Light's olive accent is
      // why textOnAccent walks a tinted ramp rather than choosing between the
      // palette's own endpoints, which topped out at 2.97:1.
      expect(contrastRatio(s.accent, s.textOnAccent)).toBeGreaterThanOrEqual(4.5);
    },
  );

  it.each(palettes.map((p) => [p.id, p] as const))(
    '%s: a border is distinguishable from its surface',
    (_id, palette) => {
      const s = toSemantic(palette);
      expect(contrastRatio(s.surface, s.border)).toBeGreaterThan(1.3);
    },
  );

  it('maps each semantic role to its specified syntax colour, preserving hue', () => {
    // Roles are no longer identical to their primitives, because the contrast
    // pass may shift tone. Hue is what carries the palette's identity, so hue
    // is the invariant worth asserting: keyword still becomes accent, string
    // still becomes success, and neither has been swapped or recoloured.
    const dracula = palettes.find((p) => p.id === 'dracula');
    expect(dracula).toBeDefined();
    if (dracula === undefined) return;
    const s = toSemantic(dracula);
    const pairs: ReadonlyArray<readonly [string, string]> = [
      [s.accent, dracula.primitives.keyword],
      [s.success, dracula.primitives.string],
      [s.warning, dracula.primitives.function],
      [s.danger, dracula.primitives.error],
      [s.textMuted, dracula.primitives.comment],
    ];
    for (const [role, primitive] of pairs) {
      expect(hue(role)).toBeCloseTo(hue(primitive), 0);
    }
  });
});
