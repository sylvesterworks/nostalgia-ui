import { foundations } from '@nostalgiaui/react/manifest';
import { describe, expect, it } from 'vitest';

import {
  checkContrast,
  COMPONENT_SECTIONS,
  getComponent,
  getTokens,
  importTheme,
  listEras,
  listPalettes,
  serverInstructions,
  splitCssByEra,
  ToolError,
} from './tools.js';
import type { ComponentSection } from './tools.js';

describe('list_eras and list_palettes', () => {
  it('list every era in chronological order, with a period each', () => {
    const result = listEras();
    expect(result.map((era) => era.id)).toEqual([
      'terminal-crt',
      'classic-windows',
      'frutiger-aero',
      'flat-metro',
      'neumorphism',
      'neubrutalism',
    ]);
    for (const era of result) {
      expect(era.period.length).toBeGreaterThan(0);
    }
  });

  it('report appearance so an agent can choose light or dark without reading hex', () => {
    const byId = Object.fromEntries(listPalettes().map((p) => [p.id, p]));
    expect(byId['dracula']?.appearance).toBe('dark');
    expect(byId['nord']?.appearance).toBe('dark');
    expect(byId['solarized-light']?.appearance).toBe('light');
    expect(byId['catppuccin-mocha']?.appearance).toBe('dark');
    expect(byId['one-dark-pro']?.appearance).toBe('dark');
  });

  it('carry the source theme and licence, so an agent can attribute correctly', () => {
    for (const palette of listPalettes()) {
      expect(palette.source.license).toBe('MIT');
      expect(palette.source.url).toMatch(/^https:\/\/github\.com\//);
    }
  });
});

describe('get_tokens', () => {
  it('css returns exactly three scoped blocks for the pairing', () => {
    const css = getTokens('frutiger-aero', 'nord', 'css');
    expect(css).toContain('[data-palette="nord"] {');
    expect(css).toContain('[data-era="frutiger-aero"] {');
    expect(css).toContain('[data-palette="nord"][data-era="frutiger-aero"] {');
    // and nothing from any other pairing
    expect(css).not.toContain('dracula');
    expect(css).not.toContain('classic-windows');
  });

  it('css carries the derived era colours for that palette', () => {
    const css = getTokens('classic-windows', 'dracula', 'css');
    expect(css).toMatch(/--nui-era-bevel-light: #[0-9a-f]{6};/);
  });

  it('dtcg returns only the requested pairing', () => {
    const json = JSON.parse(getTokens('flat-metro', 'solarized-light', 'dtcg')) as {
      palette: Record<string, unknown>;
      era: Record<string, unknown>;
      pairing: Record<string, unknown>;
    };
    expect(Object.keys(json.palette)).toEqual(['solarized-light']);
    expect(Object.keys(json.era)).toEqual(['flat-metro']);
    expect(Object.keys(json.pairing)).toEqual(['solarized-light--flat-metro']);
  });

  it('tailwind returns a preset that references variables, not values', () => {
    const preset = getTokens('flat-metro', 'nord', 'tailwind');
    expect(preset).toContain('var(--nui-color-');
    expect(preset).not.toMatch(/#[0-9a-f]{6}/i);
  });

  it('rejects an unknown era with the list of valid ones', () => {
    expect(() => getTokens('web-2', 'nord', 'css')).toThrow(ToolError);
    expect(() => getTokens('web-2', 'nord', 'css')).toThrow(/classic-windows/);
  });
});

const COMPONENTS = ['NostalgiaRoot', 'Button', 'Input', 'Card', 'Tabs', 'Dialog'] as const;

/** Each family's name, as a pattern that matches its parts too. */
const FAMILY_PATTERNS: Readonly<Record<string, RegExp>> = {
  NostalgiaRoot: /\bNostalgiaRoot\b/,
  Button: /\bButton\b/,
  Input: /\bInput\b/,
  Card: /\bCard\w*/,
  Tabs: /\bTab\w*/,
  Dialog: /\bDialog\w*/,
};

/** Every string anywhere inside a value. */
function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value !== null && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

describe('get_component', () => {
  it('returns the import line, source, and both css layers', () => {
    const answer = getComponent('Button', 'classic-windows');
    expect(answer.imports).toBe("import { Button } from '@nostalgiaui/react';");
    expect(answer.source).toContain('export function Button');
    expect(answer.baseCss).toContain('.nui-Button {');
    expect(answer.eraCss).toContain("[data-era='classic-windows']");
  });

  it('drops the rules of every other era', () => {
    const answer = getComponent('Button', 'classic-windows');
    expect(answer.eraCss).not.toContain('frutiger-aero');
    expect(answer.eraCss).not.toContain('flat-metro');
    expect(answer.baseCss).not.toContain('[data-era=');
  });

  it('imports every part in the doc anatomy', () => {
    const answer = getComponent('Dialog', 'frutiger-aero');
    for (const part of answer.doc.anatomy) {
      expect(answer.imports).toContain(part.name);
    }
    expect(answer.imports).toContain('DialogPortal');
  });

  it('carries the props table of every part', () => {
    const answer = getComponent('Tabs', 'flat-metro');
    expect(Object.keys(answer.props)).toEqual(answer.doc.anatomy.map((part) => part.name));
    const variant = getComponent('Button', 'flat-metro').props['Button']?.find(
      (row) => row.name === 'variant',
    );
    expect(variant?.default).toBe("'solid'");
    expect(variant?.type).toBe('"solid" | "outline" | "ghost" | "danger"');
  });

  it("narrows eraNotes to the requested era's note", () => {
    const classic = getComponent('Tabs', 'classic-windows').doc.eraNotes;
    expect(Object.keys(classic)).toEqual(['classic-windows']);
    expect(getComponent('Tabs', 'frutiger-aero').doc.eraNotes).toEqual({});
  });

  it('returns only the requested section', () => {
    const answer = getComponent('Button', 'flat-metro', 'accessibility');
    expect(Object.keys(answer).sort()).toEqual(['content', 'era', 'name', 'section']);
    expect(answer.section).toBe('accessibility');
    expect(answer.content).toEqual(getComponent('Button', 'flat-metro').doc.accessibility);
  });

  it('answers the props section with the tables and the guidance', () => {
    const answer = getComponent('Input', 'flat-metro', 'props');
    const full = getComponent('Input', 'flat-metro');
    expect(answer.content).toEqual({ tables: full.props, guidance: full.doc.props });
  });

  it('answers every section for every component', () => {
    for (const name of COMPONENTS) {
      for (const section of COMPONENT_SECTIONS) {
        expect(
          getComponent(name, 'neumorphism', section).content,
          name + ' ' + section,
        ).toBeDefined();
      }
    }
  });

  it('rejects an unknown section with the list of valid ones', () => {
    expect(() => getComponent('Button', 'flat-metro', 'colors' as ComponentSection)).toThrow(
      /accessibility/,
    );
  });

  it('warns about the portal trap on Dialog specifically', () => {
    const dialog = getComponent('Dialog', 'flat-metro');
    expect(dialog.doc.notes.join(' ')).toContain('document.body');
    const button = getComponent('Button', 'flat-metro');
    expect(button.doc.notes.join(' ')).not.toContain('document.body');
  });

  it('tells a Dialog reader how to put a styled Button in the trigger and close slots', () => {
    const notes = getComponent('Dialog', 'classic-windows').doc.notes.join(' ');
    expect(notes).toContain('render={<Button variant=');
    expect(notes).toContain('DialogClose');
  });

  it.each(COMPONENTS)('%s has a note that names it and no other component', (name) => {
    const own = FAMILY_PATTERNS[name];
    const others = Object.entries(FAMILY_PATTERNS)
      .filter(([family]) => family !== name)
      .map(([, pattern]) => pattern);
    const distinctive = getComponent(name, 'frutiger-aero').doc.notes.filter(
      (note) =>
        own !== undefined && own.test(note) && others.every((pattern) => !pattern.test(note)),
    );
    expect(distinctive.length, name + ' lacks a note of its own').toBeGreaterThan(0);
  });

  it.each(COMPONENTS)('%s does not repeat the rules stated in the instructions', (name) => {
    const text = JSON.stringify(getComponent(name, 'flat-metro'));
    expect(text).not.toMatch(/must render inside/i);
    expect(text).not.toContain('tokens.css');
    expect(text).not.toContain('Import the two stylesheets once');
  });

  it('shares no doc text between Dialog and Button', () => {
    const button = new Set(allStrings(getComponent('Button', 'flat-metro').doc));
    const shared = allStrings(getComponent('Dialog', 'flat-metro').doc).filter((text) =>
      button.has(text),
    );
    expect(shared).toEqual([]);
  });

  it('rejects an unknown component with the list of valid ones', () => {
    expect(() => getComponent('Carousel', 'flat-metro')).toThrow(/Button/);
  });
});

describe('the server instructions', () => {
  it('state the NostalgiaRoot rule and both stylesheet imports once', () => {
    const instructions = serverInstructions();
    expect(instructions).toContain('Render inside NostalgiaRoot');
    expect(instructions).toContain('@nostalgiaui/tokens/tokens.css');
    expect(instructions).toContain('@nostalgiaui/react/styles.css');
  });

  it('come from the foundations doc, rule for rule', () => {
    const instructions = serverInstructions();
    for (const rule of foundations.rules) {
      expect(instructions).toContain(rule.description);
    }
  });
});

describe('import_vscode_theme', () => {
  it('returns primitives, a provenance report, and ready css variables', () => {
    const answer = importTheme({
      name: 'Test',
      colors: { 'editor.background': '#101010', 'editor.foreground': '#f0f0f0' },
      tokenColors: [{ scope: 'keyword', settings: { foreground: '#ff00aa' } }],
    });
    expect(answer.primitives.background).toBe('#101010');
    expect(answer.report.primitives.length).toBe(8);
    expect(answer.cssVariables['--nui-color-surface']).toBe('#101010');
    expect(Object.keys(answer.cssVariables).length).toBeGreaterThan(8);
  });
});

describe('check_contrast', () => {
  it('passes for every shipped pairing', () => {
    for (const era of listEras()) {
      for (const palette of listPalettes()) {
        const audit = checkContrast(era.id, palette.id);
        expect(audit.passes, era.id + ' x ' + palette.id).toBe(true);
      }
    }
  });

  it('audits text on the danger fill, since a danger button is a text background', () => {
    const audit = checkContrast('flat-metro', 'solarized-light');
    const finding = audit.findings.find((f) => f.id === 'text-on-danger');
    expect(finding).toBeDefined();
    expect(finding?.passes).toBe(true);
  });

  it('returns findings a person can act on', () => {
    const audit = checkContrast('classic-windows', 'solarized-light');
    expect(audit.findings.length).toBeGreaterThanOrEqual(9);
    const first = audit.findings[0];
    expect(first).toBeDefined();
    if (first === undefined) return;
    expect(first.label.length).toBeGreaterThan(0);
    expect(first.ratio).toBeGreaterThan(1);
  });
});

describe('splitCssByEra', () => {
  const css = [
    '/* ---- section divider naming an era ---- */',
    '.nui-Thing {',
    '  color: var(--nui-color-text);',
    '  /* geometry published by Base UI */',
    '  width: var(--active-tab-width);',
    '}',
    '',
    "[data-era='flat-metro'] .nui-Thing {",
    '  border: 0;',
    '}',
    "[data-era='classic-windows'] .nui-Thing {",
    '  border: 2px solid var(--nui-era-bevel-light);',
    '}',
  ].join('\n');

  it('keeps a comment that sits inside a rule', () => {
    const { base } = splitCssByEra(css, 'flat-metro');
    expect(base).toContain('/* geometry published by Base UI */');
  });

  it('drops a section-divider comment that sits outside any rule', () => {
    const { base, era } = splitCssByEra(css, 'flat-metro');
    expect(base + era).not.toContain('section divider');
  });

  it('leaves no blank line inside any rule', () => {
    const { base, era } = splitCssByEra(css, 'flat-metro');
    for (const block of [base, era]) {
      for (const line of block.split('\n')) {
        expect(line.trim().length, 'blank line in: ' + block).toBeGreaterThan(0);
      }
    }
  });

  it('returns only the requested era', () => {
    const { era } = splitCssByEra(css, 'flat-metro');
    expect(era).toContain('flat-metro');
    expect(era).not.toContain('classic-windows');
  });

  it('matches the real Tabs stylesheet: indicator block intact, no blank line', () => {
    const answer = getComponent('Tabs', 'flat-metro');
    const block = (answer.baseCss.split('.nui-TabIndicator {')[1]?.split('}')[0] ?? '').trim();
    expect(block).toContain('--active-tab');
    for (const line of block.split('\n')) {
      expect(line.trim().length, 'blank line in TabIndicator block').toBeGreaterThan(0);
    }
  });
});
