import { describe, expect, it } from 'vitest';

import { auditContrast } from './audit.js';
import { contrastRatio, isLight, lightness, withAlpha } from './color.js';
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
 * The contrast rules themselves live in auditContrast, so that the MCP
 * server's check_contrast tool and this suite cannot drift apart. This file
 * asserts that the audit passes, and adds the structural checks that are about
 * an era's derived colours rather than about WCAG ratios.
 */
const pairings = palettes.flatMap((palette) =>
  eras.map((era) => ({ palette, era, label: palette.id + ' x ' + era.id })),
);

describe('every era and palette pairing', () => {
  it('covers the full cross product, so adding either axis widens this suite', () => {
    expect(pairings).toHaveLength(palettes.length * eras.length);
  });

  describe.each(pairings.map((p) => [p.label, p] as const))('%s', (_label, { palette, era }) => {
    const semantic = toSemantic(palette);
    const derived = era.derive(semantic);
    const audit = auditContrast(era, palette);

    it('passes the contrast audit', () => {
      const report = audit.failures
        .map((f) => f.label + ': ' + String(f.ratio) + ' < ' + String(f.required))
        .join('; ');
      expect(audit.passes, report).toBe(true);
    });

    it('audits every pairing the same way', () => {
      // A regression guard on the audit itself: if a check is ever dropped,
      // every pairing shrinks together and this catches it.
      expect(audit.findings.length).toBeGreaterThanOrEqual(9);
      expect(audit.era).toBe(era.id);
      expect(audit.palette).toBe(palette.id);
    });

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

    it('derives ink that sits at the far end of the surface polarity', () => {
      // Neubrutalism only. The ink was once a pale blue-grey on Solarized
      // Light because the recipe keyed off the text instead of the surface.
      const ink = derived['ink'];
      if (ink === undefined) {
        return;
      }
      if (isLight(semantic.surface)) {
        expect(lightness(ink)).toBeLessThan(0.3);
      } else {
        expect(lightness(ink)).toBeGreaterThan(0.7);
      }
      expect(contrastRatio(ink, semantic.surface)).toBeGreaterThanOrEqual(7);
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

describe('muted text', () => {
  it.each(pairings.map((p) => [p.label, p] as const))(
    '%s is held to the body text bar on every surface',
    (_label, { palette, era }) => {
      // Muted text is used at body size, so 3:1 is not enough (#69).
      const audit = auditContrast(era, palette);
      const surfaces = [
        'text-muted-on-surface',
        'text-muted-on-surface-raised',
        'text-muted-on-surface-sunken',
      ];
      const muted = audit.findings.filter((f) => surfaces.includes(f.id));
      expect(muted.map((f) => f.id).sort()).toEqual(surfaces);
      for (const finding of muted) expect(finding.required).toBe(4.5);
    },
  );
});

describe('era text fills', () => {
  const base = eras[0];
  if (base === undefined) throw new Error('no eras');
  const palette = palettes[0];
  if (palette === undefined) throw new Error('no palettes');

  it('are audited for body and muted text, painted over the surface', () => {
    const audit = auditContrast(base, palette);
    for (const key of base.textFills ?? []) {
      expect(audit.findings.map((f) => f.id)).toEqual(
        expect.arrayContaining(['text-on-' + key, 'text-muted-on-' + key]),
      );
    }
  });

  it('fail the audit when a fill strays far from the surfaces', () => {
    // A pane close to the text color itself: nothing on it is readable.
    const glare = {
      ...base,
      derive: (s: Parameters<typeof base.derive>[0]) => ({
        ...base.derive(s),
        glare: withAlpha(s.text, 0.9),
      }),
      textFills: ['glare'],
    };
    const audit = auditContrast(glare, palette);
    expect(audit.failures.map((f) => f.id)).toEqual(
      expect.arrayContaining(['text-on-glare', 'text-muted-on-glare']),
    );
  });

  it('audit body text only on a body-text fill', () => {
    // Classic Windows' tooltip fill: body text sits on it, muted text never
    // does, so only body text is checked (#26).
    const classic = eras.find((era) => era.id === 'classic-windows');
    if (classic === undefined) throw new Error('no classic-windows era');
    for (const p of palettes) {
      const ids = auditContrast(classic, p).findings.map((f) => f.id);
      expect(ids).toContain('text-on-tooltip-fill');
      expect(ids).not.toContain('text-muted-on-tooltip-fill');
    }
  });

  it('reject a fill name the era does not derive', () => {
    expect(() => auditContrast({ ...base, textFills: ['no-such-fill'] }, palette)).toThrow(
      /no-such-fill/,
    );
  });
});

describe('auditContrast as an API', () => {
  it('reports a failing pairing rather than throwing', () => {
    // A deliberately illegible palette: text barely different from surface.
    const bad = {
      id: 'bad',
      label: 'Bad',
      source: { theme: 'test', url: '', license: '' },
      primitives: {
        background: '#808080',
        foreground: '#8a8a8a',
        selection: '#858585',
        keyword: '#828282',
        string: '#838383',
        function: '#848484',
        comment: '#868686',
        error: '#878787',
      },
    };
    const era = eras[0];
    if (era === undefined) throw new Error('no eras');
    const audit = auditContrast(era, bad);
    // The semantic layer corrects what it can, so this is not guaranteed to
    // fail. What is guaranteed is that the audit answers with findings and
    // that each finding carries the numbers a person needs to act on it.
    expect(audit.findings.length).toBeGreaterThan(0);
    for (const finding of audit.findings) {
      expect(finding.ratio).toBeGreaterThan(0);
      expect(finding.required).toBeGreaterThan(0);
      expect(finding.foreground).toMatch(/^#/);
      expect(finding.background).toMatch(/^#/);
      expect(typeof finding.passes).toBe('boolean');
    }
    expect(audit.passes).toBe(audit.failures.length === 0);
  });
});
