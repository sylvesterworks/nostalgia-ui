import { readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { eras } from '@nostalgiaui/tokens';
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
    for (const component of [
      'NostalgiaRoot',
      'Button',
      'Input',
      'Checkbox',
      'Switch',
      'Select',
      'Menu',
      'Tooltip',
      'Slider',
      'Card',
      'Tabs',
      'Dialog',
    ]) {
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

describe('selected tab', () => {
  it("is styled by Base UI's data-active, the attribute Base UI 1.9 sets", async () => {
    // Base UI marks the selected tab with data-active and aria-selected, not
    // data-selected. Every [data-selected] rule here matched nothing, so no
    // era drew its selected tab, and eras that hide the indicator showed no
    // selection at all (#13).
    const sheets = await readStylesheets();
    const tabs = sheets.find(([name]) => name === 'components/Tabs/Tabs.css')?.[1] ?? '';
    expect(tabs).not.toContain('[data-selected]');
    expect(tabs).toContain('.nui-Tab[data-active]');
  });
});

describe('button variants', () => {
  it('styles the danger variant in every era, through tokens only', async () => {
    const sheets = await readStylesheets();
    const button = sheets.find(([name]) => name === 'components/Button/Button.css')?.[1] ?? '';
    expect(button).toContain('.nui-Button--danger {');
    for (const era of [
      'early-mac',
      'classic-windows',
      'web-1',
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

/**
 * Fills with their own text color: accent and danger fills carry
 * `--nui-color-text-on-accent` or `--nui-color-text-on-danger`, which the
 * contrast audit checks against those fills.
 */
const FILLS_WITH_OWN_TEXT = new Set([
  'titlebar-fill',
  'accent-vivid',
  'danger-vivid',
  'tile-fill',
  'tile-hover',
  'tile-active',
  'danger-hover',
  'danger-active',
  'phosphor-fill',
]);

/** Each era fill a rule paints as its background, with the era the rule is scoped to. */
function eraFills(
  css: string,
): { readonly era: string; readonly fill: string; readonly body: string }[] {
  const found: { era: string; fill: string; body: string }[] = [];
  for (const rule of stripCssComments(css).matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    const [, selector = '', body = ''] = rule;
    const scoped = [...selector.matchAll(/data-era='([^']+)'/g)].map((m) => m[1] ?? '');
    for (const use of body.matchAll(/background(?:-color)?:\s*var\(--nui-era-([a-z-]+)\)/g)) {
      for (const era of scoped) found.push({ era, fill: use[1] ?? '', body });
    }
  }
  return found;
}

describe('era fills behind text', () => {
  it('are each listed in that era as a text fill, so the audit checks them', async () => {
    // The contrast audit only knows the fills an era lists in textFills (#69).
    // A stylesheet that paints any other neutral era fill behind text would
    // escape it.
    const unaudited: string[] = [];
    for (const [name, css] of await readStylesheets()) {
      for (const { era, fill, body } of eraFills(css)) {
        if (FILLS_WITH_OWN_TEXT.has(fill)) continue;
        const known = eras.find((e) => e.id === era);
        if ((known?.textFills ?? []).includes(fill)) continue;
        // A body-text fill is audited for body text only (#26), so the rule
        // that paints it must not set muted text on it.
        if ((known?.bodyTextFills ?? []).includes(fill)) {
          if (body.includes('--nui-color-text-muted'))
            unaudited.push(name + ': ' + era + ' muted text on ' + fill);
          continue;
        }
        unaudited.push(name + ': ' + era + ' ' + fill);
      }
    }
    expect(unaudited).toEqual([]);
  });

  it('reject a neutral fill the era does not list', () => {
    const css = "[data-era='flat-metro'] .nui-Card { background: var(--nui-era-divider); }";
    expect(eraFills(css)).toEqual([
      { era: 'flat-metro', fill: 'divider', body: ' background: var(--nui-era-divider); ' },
    ]);
    const listed = eras.find((e) => e.id === 'flat-metro')?.textFills ?? [];
    expect(listed).not.toContain('divider');
  });

  it('reject muted text on a body-text fill', () => {
    // Classic Windows lists tooltip-fill for body text only (#26).
    const css =
      "[data-era='classic-windows'] .nui-X { background: var(--nui-era-tooltip-fill); color: var(--nui-color-text-muted); }";
    const [found] = eraFills(css);
    expect(found?.fill).toBe('tooltip-fill');
    expect(found?.body).toContain('--nui-color-text-muted');
    const classic = eras.find((e) => e.id === 'classic-windows');
    expect(classic?.bodyTextFills).toContain('tooltip-fill');
    expect(classic?.textFills).not.toContain('tooltip-fill');
  });
});
