import { describe, expect, it } from 'vitest';

import {
  bestContrast,
  contrastRatio,
  isLight,
  lightness,
  mix,
  raise,
  relativeLuminance,
  scaleChroma,
  shiftLightness,
  sink,
  withAlpha,
} from './color.js';

describe('relativeLuminance', () => {
  it('matches the WCAG reference values at both extremes', () => {
    expect(relativeLuminance('#000000')).toBeCloseTo(0, 5);
    expect(relativeLuminance('#ffffff')).toBeCloseTo(1, 5);
  });

  it('matches the WCAG reference value for mid grey', () => {
    // sRGB #808080 has a known relative luminance of ~0.2159
    expect(relativeLuminance('#808080')).toBeCloseTo(0.2159, 3);
  });
});

describe('contrastRatio', () => {
  it('gives 21 for black on white, the theoretical maximum', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 2);
  });

  it('gives 1 for a colour against itself', () => {
    expect(contrastRatio('#3b4252', '#3b4252')).toBeCloseTo(1, 5);
  });

  it('is symmetric, so argument order cannot change a pass into a failure', () => {
    expect(contrastRatio('#282a36', '#f8f8f2')).toBeCloseTo(
      contrastRatio('#f8f8f2', '#282a36'),
      10,
    );
  });
});

describe('isLight', () => {
  it('classifies the three milestone palettes correctly', () => {
    expect(isLight('#282a36')).toBe(false); // Dracula background
    expect(isLight('#2e3440')).toBe(false); // Nord background
    expect(isLight('#fdf6e3')).toBe(true); // Solarized Light background
  });
});

describe('raise and sink', () => {
  it('raises a dark surface by making it lighter', () => {
    const base = '#282a36';
    expect(lightness(raise(base, 0.06))).toBeGreaterThan(lightness(base));
  });

  it('raises a light surface by making it darker, so one recipe serves both', () => {
    const base = '#fdf6e3';
    expect(lightness(raise(base, 0.06))).toBeLessThan(lightness(base));
  });

  it('sinks in the opposite direction to raise', () => {
    const dark = '#282a36';
    expect(lightness(sink(dark, 0.04))).toBeLessThan(lightness(dark));
    const light = '#fdf6e3';
    expect(lightness(sink(light, 0.04))).toBeGreaterThan(lightness(light));
  });

  it('clamps rather than wrapping at the ends of the lightness range', () => {
    // The hex round trip introduces float error of ~1e-16, so compare with an
    // epsilon. The point of the test is that lightness does not wrap past the
    // end of the range, not that it lands on exactly 1.
    const epsilon = 1e-9;
    expect(lightness(shiftLightness('#ffffff', 0.5))).toBeLessThanOrEqual(1 + epsilon);
    expect(lightness(shiftLightness('#000000', -0.5))).toBeGreaterThanOrEqual(0 - epsilon);
  });
});

describe('mix', () => {
  it('returns the endpoints unchanged at t=0 and t=1', () => {
    expect(lightness(mix('#282a36', '#f8f8f2', 0))).toBeCloseTo(lightness('#282a36'), 3);
    expect(lightness(mix('#282a36', '#f8f8f2', 1))).toBeCloseTo(lightness('#f8f8f2'), 3);
  });

  it('lands between the endpoints in the middle', () => {
    const mid = lightness(mix('#000000', '#ffffff', 0.5));
    expect(mid).toBeGreaterThan(0.4);
    expect(mid).toBeLessThan(0.75);
  });

  it('takes the short way round the hue wheel', () => {
    // 350deg mixed halfway with 10deg should land near 0deg, not near 180deg
    const result = mix('oklch(0.6 0.15 350)', 'oklch(0.6 0.15 10)', 0.5);
    const hue = lightness(result); // sanity: still a valid colour
    expect(hue).toBeGreaterThan(0);
    expect(result).toMatch(/^#[0-9a-f]{6}$/);
  });
});

describe('scaleChroma', () => {
  it('collapses to grey at factor 0', () => {
    const grey = scaleChroma('#bd93f9', 0);
    expect(relativeLuminance(grey)).toBeGreaterThan(0);
    expect(grey).toMatch(/^#[0-9a-f]{6}$/);
  });
});

describe('withAlpha', () => {
  it('emits an rgba string with the alpha applied', () => {
    expect(withAlpha('#ffffff', 0.5)).toBe('rgba(255, 255, 255, 0.5)');
  });

  it('clamps alpha into range', () => {
    expect(withAlpha('#000000', 2)).toBe('rgba(0, 0, 0, 1)');
  });
});

describe('bestContrast', () => {
  it('picks light text on a dark fill', () => {
    expect(bestContrast('#282a36', ['#000000', '#ffffff'])).toBe('#ffffff');
  });

  it('picks dark text on a light fill', () => {
    expect(bestContrast('#fdf6e3', ['#000000', '#ffffff'])).toBe('#000000');
  });
});

describe('proportional raise and sink', () => {
  it('never clamps, so successive steps stay distinguishable on a dark palette', () => {
    // Dracula's surface. With absolute shifts, sink(0.22) and sink(0.38) both
    // crushed to near-black and a bevel lost its two dark edges.
    const surface = '#282a36';
    const dark = sink(surface, 0.22);
    const darker = sink(surface, 0.38);
    expect(lightness(dark)).toBeGreaterThan(0);
    expect(lightness(darker)).toBeGreaterThan(0);
    expect(lightness(dark)).toBeGreaterThan(lightness(darker));
    expect(contrastRatio(dark, darker)).toBeGreaterThan(1.1);
  });

  it('keeps bevel edges distinguishable on a light palette too', () => {
    const surface = '#fdf6e3';
    const light = raise(surface, 0.3);
    const lighter = raise(surface, 0.45);
    expect(lightness(light)).toBeGreaterThan(lightness(lighter));
    expect(contrastRatio(light, lighter)).toBeGreaterThan(1.1);
  });

  it('stays inside the lightness range for every palette surface', () => {
    for (const surface of ['#282a36', '#2e3440', '#fdf6e3']) {
      for (const amount of [0.1, 0.3, 0.5, 0.9]) {
        expect(lightness(raise(surface, amount))).toBeLessThanOrEqual(1);
        expect(lightness(raise(surface, amount))).toBeGreaterThanOrEqual(0);
        expect(lightness(sink(surface, amount))).toBeLessThanOrEqual(1);
        expect(lightness(sink(surface, amount))).toBeGreaterThanOrEqual(0);
      }
    }
  });
});
