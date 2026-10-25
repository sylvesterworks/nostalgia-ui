import { contrastRatio, toSemantic } from '@nostalgiaui/tokens';
import { describe, expect, it } from 'vitest';

import * as fixtures from './fixtures.js';
import { importVsCodeTheme } from './import.js';
import type { PrimitiveReport } from './types.js';

function byName(reports: readonly PrimitiveReport[], primitive: string): PrimitiveReport {
  const found = reports.find((entry) => entry.primitive === primitive);
  if (found === undefined) {
    throw new Error('No report for ' + primitive);
  }
  return found;
}

describe('a well formed theme', () => {
  const { primitives, report } = importVsCodeTheme(fixtures.wellFormed);

  it('reads every primitive exactly, with nothing guessed', () => {
    expect(report.guessedCount).toBe(0);
    expect(report.warnings).toHaveLength(0);
  });

  it('takes surfaces and text straight from the colors block', () => {
    expect(primitives.background).toBe('#202430');
    expect(primitives.foreground).toBe('#e6e9f0');
    expect(primitives.selection).toBe('#39415a');
  });

  it('resolves syntax roles from their scopes', () => {
    expect(primitives.keyword).toBe('#c792ea');
    expect(primitives.string).toBe('#86d98a');
    expect(primitives.function).toBe('#82aaff');
    expect(primitives.comment).toBe('#6b7392');
    expect(primitives.error).toBe('#ff5370');
  });

  it('names the scope each colour came from', () => {
    expect(byName(report.primitives, 'keyword').source).toContain('keyword.control');
  });
});

describe('scope shapes', () => {
  it('reads an array of scopes', () => {
    const { primitives } = importVsCodeTheme(fixtures.multiScope);
    expect(primitives.comment).toBe('#707585');
  });

  it('reads a comma separated scope string', () => {
    const { primitives } = importVsCodeTheme(fixtures.multiScope);
    expect(primitives.keyword).toBe('#e0a0ff');
  });

  it('counts a less preferred target that matches exactly as exact', () => {
    // keyword.control is preferred, but the theme styles plain keyword. That
    // is still the theme explicitly colouring keywords, so it is not a guess.
    const { primitives, report } = importVsCodeTheme(fixtures.broadScopesOnly);
    expect(primitives.keyword).toBe('#ff9f43');
    expect(byName(report.primitives, 'keyword').provenance).toBe('exact');
  });

  it('inherits when only a sibling scope exists', () => {
    // keyword.operator.arithmetic is neither of the scopes asked for, but it
    // shares a prefix with them, so it is the best available evidence.
    const { primitives, report } = importVsCodeTheme(fixtures.siblingScopesOnly);
    expect(primitives.keyword).toBe('#f28fad');
    expect(byName(report.primitives, 'keyword').provenance).toBe('inherited');
    expect(byName(report.primitives, 'keyword').source).toContain('keyword.operator.arithmetic');
  });
});

describe('structural hazards', () => {
  it('warns when tokenColors is a TextMate file path, and derives syntax roles', () => {
    const { report } = importVsCodeTheme(fixtures.tmThemePath);
    expect(report.warnings.join(' ')).toContain('Fixture.tmTheme');
    for (const role of ['keyword', 'string', 'function', 'comment', 'error']) {
      expect(byName(report.primitives, role).provenance).toBe('derived');
    }
    // The colors block is still readable, so surfaces remain exact.
    expect(byName(report.primitives, 'background').provenance).toBe('exact');
  });

  it('warns when the theme extends a file it cannot see', () => {
    const { report } = importVsCodeTheme(fixtures.withInclude);
    expect(report.warnings.join(' ')).toContain('base-dark.json');
  });

  it('falls back to the unscoped default rule when there is no colors block', () => {
    const { primitives, report } = importVsCodeTheme(fixtures.noColorsBlock);
    expect(primitives.foreground).toBe('#cfcfcf');
    expect(byName(report.primitives, 'foreground').provenance).toBe('inherited');
    expect(byName(report.primitives, 'background').provenance).toBe('fallback');
  });

  it('strips alpha rather than compositing it against an assumed backdrop', () => {
    const { primitives } = importVsCodeTheme(fixtures.alphaValues);
    expect(primitives.background).toBe('#1e1e1e');
    expect(primitives.foreground).toBe('#d4d4d4');
    expect(primitives.selection).toBe('#264f78');
    expect(primitives.keyword).toBe('#569cd6');
  });

  it('trusts the measured background over a wrong declared type', () => {
    const { report } = importVsCodeTheme(fixtures.mislabelledType);
    expect(report.declaredType).toBe('dark');
    expect(report.appearance).toBe('light');
    expect(report.warnings.join(' ')).toContain('declares type');
  });

  it('ignores entries that carry no usable colour', () => {
    const { primitives } = importVsCodeTheme(fixtures.junkEntries);
    expect(primitives.keyword).toBe('#bb86fc');
  });

  it('produces a usable palette from an empty object', () => {
    const { primitives, report } = importVsCodeTheme(fixtures.empty);
    expect(report.guessedCount).toBeGreaterThan(0);
    for (const value of Object.values(primitives)) {
      expect(value).toMatch(/^#[0-9a-f]{3,8}$/i);
    }
  });
});

describe('imported palettes feed the token layer', () => {
  const all = Object.entries(fixtures);

  it.each(all)('%s produces primitives the semantic layer accepts', (_name, theme) => {
    const { primitives } = importVsCodeTheme(theme);
    const semantic = toSemantic({
      id: 'imported',
      label: 'Imported',
      source: { theme: 'fixture', url: '', license: '' },
      primitives,
    });

    // The semantic layer already enforces contrast, so an imported palette
    // should arrive at the same guarantees as a hand written one. This is the
    // check that an import cannot smuggle in an illegible palette.
    expect(contrastRatio(semantic.text, semantic.surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(semantic.textOnAccent, semantic.accent)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(semantic.textMuted, semantic.surface)).toBeGreaterThanOrEqual(3);
  });
});
