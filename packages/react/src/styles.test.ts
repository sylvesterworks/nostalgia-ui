import { readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import {
  findColorFunctions,
  findHexColors,
  findNamedColors,
  stripCssComments,
} from './docs/color-rules.js';

const srcDir = dirname(fileURLToPath(import.meta.url));

/**
 * Every stylesheet under src: one per component folder, plus the shared
 * foundation in src/styles. Names are paths relative to src with forward
 * slashes, for example components/Button/Button.css.
 */
async function readStylesheets(): Promise<ReadonlyArray<readonly [string, string]>> {
  const names = (await readdir(srcDir, { recursive: true }))
    .map((name) => name.replaceAll('\\', '/'))
    .filter((name) => name.endsWith('.css'));
  return Promise.all(
    names.map(async (name) => [name, await readFile(join(srcDir, name), 'utf8')] as const),
  );
}

/**
 * The project's central rule, enforced rather than trusted: a component may
 * never name a color. Every color must arrive through a token, so that
 * changing palette cannot miss a component and adding a palette cannot
 * require touching one. The patterns are shared with the documentation test
 * through docs/color-rules.ts.
 */
describe('component stylesheets', () => {
  it('exist: one per component folder plus the shared foundation', async () => {
    const names = (await readStylesheets()).map(([name]) => name);
    expect(names).toContain('styles/foundations.css');
    for (const component of ['NostalgiaRoot', 'Button', 'Input', 'Card', 'Tabs', 'Dialog']) {
      expect(names).toContain('components/' + component + '/' + component + '.css');
    }
  });

  it('contain no hex color literals', async () => {
    for (const [name, css] of await readStylesheets()) {
      const matches = findHexColors(css);
      expect(matches, name + ' contains hex colors: ' + matches.join(', ')).toHaveLength(0);
    }
  });

  it('contain no rgb, hsl, oklch or color-function literals', async () => {
    for (const [name, css] of await readStylesheets()) {
      const matches = findColorFunctions(css);
      expect(matches, name + ' contains color functions: ' + matches.join(', ')).toHaveLength(0);
    }
  });

  it('contain no named CSS colors', async () => {
    for (const [name, css] of await readStylesheets()) {
      // Strip comments first, since prose in a comment legitimately mentions
      // color names.
      const matches = findNamedColors(stripCssComments(css));
      expect(matches, name + ' contains named colors: ' + matches.join(', ')).toHaveLength(0);
    }
  });

  it('reference only nui tokens and Base UI published variables', async () => {
    for (const [name, css] of await readStylesheets()) {
      const vars = css.match(/var\(\s*(--[\w-]+)/g) ?? [];
      for (const raw of vars) {
        const varName = raw.replace(/var\(\s*/, '');
        const allowed = varName.startsWith('--nui-') || varName.startsWith('--active-tab-');
        expect(allowed, name + ' references unknown variable ' + varName).toBe(true);
      }
    }
  });
});

describe('button variants', () => {
  it('styles the danger variant in every era, through tokens only', async () => {
    const sheets = await readStylesheets();
    const button = sheets.find(([name]) => name === 'components/Button/Button.css')?.[1] ?? '';
    expect(button).toContain('.nui-Button--danger {');
    for (const era of [
      'classic-windows',
      'frutiger-aero',
      'flat-metro',
      'terminal-crt',
      'neubrutalism',
      'neumorphism',
    ]) {
      expect(button, 'no danger rule for ' + era).toContain(
        "[data-era='" + era + "'] .nui-Button--danger",
      );
    }
    expect(button).toContain('--nui-color-text-on-danger');
  });
});
