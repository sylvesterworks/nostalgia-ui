import { readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const stylesDir = join(dirname(fileURLToPath(import.meta.url)), 'styles');

async function readStylesheets(): Promise<ReadonlyArray<readonly [string, string]>> {
  const names = (await readdir(stylesDir)).filter((name) => name.endsWith('.css'));
  return Promise.all(
    names.map(async (name) => [name, await readFile(join(stylesDir, name), 'utf8')] as const),
  );
}

/**
 * The project's central rule, enforced rather than trusted: a component may
 * never name a colour. Every colour must arrive through a token, so that
 * changing palette cannot miss a component and adding a palette cannot
 * require touching one.
 */
describe('component stylesheets', () => {
  it('exist', async () => {
    const sheets = await readStylesheets();
    expect(sheets.length).toBeGreaterThanOrEqual(6);
  });

  it('contain no hex colour literals', async () => {
    for (const [name, css] of await readStylesheets()) {
      const matches = css.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
      expect(matches, name + ' contains hex colours: ' + matches.join(', ')).toHaveLength(0);
    }
  });

  it('contain no rgb, hsl, oklch or colour-function literals', async () => {
    for (const [name, css] of await readStylesheets()) {
      const matches = css.match(/\b(rgba?|hsla?|oklch|oklab|lab|lch|color-mix)\s*\(/g) ?? [];
      expect(matches, name + ' contains colour functions: ' + matches.join(', ')).toHaveLength(0);
    }
  });

  it('contain no named CSS colours', async () => {
    // transparent and currentColor are not colours in the sense that matters:
    // neither pins a component to a specific palette.
    const named = [
      'white',
      'black',
      'red',
      'green',
      'blue',
      'grey',
      'gray',
      'silver',
      'navy',
      'teal',
      'olive',
      'maroon',
      'aqua',
      'fuchsia',
      'lime',
      'yellow',
      'orange',
      'purple',
    ];
    // String.raw rather than a quoted string: in a normal string literal the
    // escape collapses, and the guard silently becomes (?<![w-]) instead of a
    // word boundary, which makes this check weaker than it looks.
    const pattern = new RegExp(
      String.raw`(?<![\w-])(` + named.join('|') + String.raw`)(?![\w-])`,
      'gi',
    );
    for (const [name, css] of await readStylesheets()) {
      // Strip comments first, since prose legitimately mentions colour names.
      const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
      const matches = withoutComments.match(pattern) ?? [];
      expect(matches, name + ' contains named colours: ' + matches.join(', ')).toHaveLength(0);
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
    const button = sheets.find(([name]) => name === 'button.css')?.[1] ?? '';
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
