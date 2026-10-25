import { describe, expect, it } from 'vitest';

import {
  checkContrast,
  getComponent,
  getTokens,
  importTheme,
  listEras,
  listPalettes,
  ToolError,
} from './tools.js';

describe('list_eras and list_palettes', () => {
  it('list the three milestone eras with their periods', () => {
    const result = listEras();
    expect(result.map((era) => era.id)).toEqual(['classic-windows', 'frutiger-aero', 'flat-metro']);
    for (const era of result) {
      expect(era.period.length).toBeGreaterThan(0);
    }
  });

  it('report appearance so an agent can choose light or dark without reading hex', () => {
    const byId = Object.fromEntries(listPalettes().map((p) => [p.id, p]));
    expect(byId['dracula']?.appearance).toBe('dark');
    expect(byId['nord']?.appearance).toBe('dark');
    expect(byId['solarized-light']?.appearance).toBe('light');
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
