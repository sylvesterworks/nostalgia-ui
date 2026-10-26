import { describe, expect, it } from 'vitest';

import {
  checkContrast,
  getComponent,
  getTokens,
  importTheme,
  listEras,
  listPalettes,
  splitCssByEra,
  ToolError,
} from './tools.js';

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

describe('get_component', () => {
  it('returns imports, source, and both css layers', () => {
    const answer = getComponent('Button', 'classic-windows');
    expect(answer.imports).toContain("import { Button } from '@nostalgiaui/react';");
    expect(answer.imports).toContain("import '@nostalgiaui/tokens/tokens.css';");
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

  it('lists every named export a composite component needs', () => {
    const answer = getComponent('Dialog', 'frutiger-aero');
    for (const name of ['DialogPortal', 'DialogPopup', 'DialogTitle', 'DialogClose']) {
      expect(answer.imports).toContain(name);
    }
  });

  it('warns about the portal trap on Dialog specifically', () => {
    const dialog = getComponent('Dialog', 'flat-metro');
    expect(dialog.notes.join(' ')).toContain('document.body');
    const button = getComponent('Button', 'flat-metro');
    expect(button.notes.join(' ')).not.toContain('document.body');
  });

  it('always says components must sit inside NostalgiaRoot', () => {
    for (const name of ['Button', 'Input', 'Card', 'Tabs', 'Dialog']) {
      expect(getComponent(name, 'flat-metro').notes.join(' ')).toContain('NostalgiaRoot');
    }
  });

  it('rejects an unknown component with the list of valid ones', () => {
    expect(() => getComponent('Carousel', 'flat-metro')).toThrow(/Button/);
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
