import { importVsCodeTheme } from '@nostalgiaui/importer';
import type { ImportReport } from '@nostalgiaui/importer';
import { manifest } from '@nostalgiaui/react/manifest';
import {
  auditContrast,
  emitDtcg,
  emitTailwindPreset,
  eraVars,
  eras,
  getEra,
  getPalette,
  isLight,
  pairingVars,
  palettes,
  semanticVars,
} from '@nostalgiaui/tokens';
import type { ContrastAudit, Palette, PalettePrimitives } from '@nostalgiaui/tokens';

/**
 * The logic behind each MCP tool, as plain functions.
 *
 * Keeping the protocol layer out of here means every tool can be unit tested
 * by calling it, and the server file is reduced to schema declarations and a
 * thin adapter. It also keeps this logic reusable if a second transport is
 * ever wanted.
 */

export type TokenFormat = 'css' | 'tailwind' | 'dtcg';
export const TOKEN_FORMATS: readonly TokenFormat[] = ['css', 'tailwind', 'dtcg'];

export class ToolError extends Error {}

function requireEra(id: string): ReturnType<typeof getEra> {
  try {
    return getEra(id);
  } catch {
    throw new ToolError(
      'Unknown era "' + id + '". Valid eras: ' + eras.map((era) => era.id).join(', '),
    );
  }
}

function requirePalette(id: string): Palette {
  try {
    return getPalette(id);
  } catch {
    throw new ToolError(
      'Unknown palette "' + id + '". Valid palettes: ' + palettes.map((p) => p.id).join(', '),
    );
  }
}

// --- list_eras / list_palettes ---------------------------------------------

export function listEras(): ReadonlyArray<{
  readonly id: string;
  readonly label: string;
  readonly period: string;
}> {
  return eras.map((era) => ({ id: era.id, label: era.label, period: era.period }));
}

export function listPalettes(): ReadonlyArray<{
  readonly id: string;
  readonly label: string;
  readonly appearance: 'light' | 'dark';
  readonly source: Palette['source'];
}> {
  return palettes.map((palette) => ({
    id: palette.id,
    label: palette.label,
    // Reported so an agent can pick a light or dark palette without
    // inspecting colour values. Same OKLCH threshold the token layer uses.
    appearance: isLight(palette.primitives.background) ? 'light' : 'dark',
    source: palette.source,
  }));
}

// --- get_tokens ------------------------------------------------------------

function cssBlock(selector: string, vars: Record<string, string>): string {
  const lines = Object.entries(vars).map(([name, value]) => '  ' + name + ': ' + value + ';');
  return [selector + ' {', ...lines, '}'].join('\n');
}

/**
 * Tokens for one pairing only, rather than the whole generated file.
 *
 * An agent building a page in one era and one palette needs exactly those
 * variables. Handing over all nine pairings would bury the twenty lines that
 * matter inside two hundred that do not.
 */
export function getTokens(eraId: string, paletteId: string, format: TokenFormat): string {
  const era = requireEra(eraId);
  const palette = requirePalette(paletteId);

  switch (format) {
    case 'css':
      return [
        '/* NostalgiaUI tokens: ' + era.label + ' x ' + palette.label + ' */',
        '/* Set data-era="' +
          era.id +
          '" and data-palette="' +
          palette.id +
          '" on a wrapper element, or use NostalgiaRoot. */',
        '',
        cssBlock('[data-palette="' + palette.id + '"]', semanticVars(palette)),
        '',
        cssBlock('[data-era="' + era.id + '"]', eraVars(era)),
        '',
        cssBlock(
          '[data-palette="' + palette.id + '"][data-era="' + era.id + '"]',
          pairingVars(era, palette),
        ),
        '',
      ].join('\n');

    case 'tailwind':
      // The preset maps utilities onto CSS variables, so it is the same for
      // every pairing. The variables themselves still come from the css
      // format or the shipped stylesheet.
      return emitTailwindPreset();

    case 'dtcg': {
      const all = JSON.parse(emitDtcg()) as {
        palette: Record<string, unknown>;
        era: Record<string, unknown>;
        pairing: Record<string, unknown>;
      };
      const subset = {
        palette: { [palette.id]: all.palette[palette.id] },
        era: { [era.id]: all.era[era.id] },
        pairing: { [palette.id + '--' + era.id]: all.pairing[palette.id + '--' + era.id] },
      };
      return JSON.stringify(subset, null, 2) + '\n';
    }
  }
}

// --- get_component ---------------------------------------------------------

/** Named exports an agent needs for each component. */
const EXPORTS: Record<string, readonly string[]> = {
  NostalgiaRoot: ['NostalgiaRoot'],
  Button: ['Button'],
  Input: ['Input'],
  Card: ['Card', 'CardTitle', 'CardBody'],
  Tabs: ['Tabs', 'TabList', 'Tab', 'TabIndicator', 'TabPanel'],
  Dialog: [
    'Dialog',
    'DialogPortal',
    'DialogTrigger',
    'DialogBackdrop',
    'DialogPopup',
    'DialogTitle',
    'DialogDescription',
    'DialogClose',
  ],
};

export interface ComponentAnswer {
  readonly name: string;
  readonly era: string;
  /** The import lines a consumer needs, including the stylesheets. */
  readonly imports: string;
  /** The TSX source of the wrapper. */
  readonly source: string;
  /** Rules that apply in every era. */
  readonly baseCss: string;
  /** Rules scoped to the requested era only. */
  readonly eraCss: string;
  /** Things that are easy to get wrong, stated up front. */
  readonly notes: readonly string[];
}

/**
 * Split a stylesheet into the rules that apply everywhere and the rules
 * scoped to one era. Other eras' rules are dropped, since an agent working in
 * Frutiger Aero gains nothing from reading the Classic Windows bevel rules.
 *
 * Comments are handled by position rather than deleted wholesale. A comment
 * outside any rule block is a section divider naming an era or a component;
 * that information is redundant once rules are grouped by era, so it goes.
 * A comment inside a rule block explains a declaration (which variables Base
 * UI publishes, why a shadow is inset) and is exactly what an agent reading
 * the CSS as reference needs, so it stays. Whitespace-only lines left behind
 * are removed so no rule contains a blank line.
 */
export function splitCssByEra(css: string, eraId: string): { base: string; era: string } {
  // Drop comments at brace depth 0 only.
  let depth = 0;
  let out = '';
  let i = 0;
  while (i < css.length) {
    if (css.startsWith('/*', i)) {
      const close = css.indexOf('*/', i + 2);
      const endIdx = close === -1 ? css.length : close + 2;
      if (depth > 0) {
        out += css.slice(i, endIdx);
      }
      i = endIdx;
      continue;
    }
    const ch = css[i] ?? '';
    if (ch === '{') depth += 1;
    if (ch === '}') depth = Math.max(0, depth - 1);
    out += ch;
    i += 1;
  }

  const rules = out.match(/[^{}]+\{[^{}]*\}/g) ?? [];
  const base: string[] = [];
  const era: string[] = [];
  for (const rule of rules) {
    const cleaned = rule
      .trim()
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .join('\n');
    if (!cleaned.includes('[data-era=')) {
      base.push(cleaned);
    } else if (cleaned.includes("[data-era='" + eraId + "']")) {
      era.push(cleaned);
    }
  }
  return { base: base.join('\n\n'), era: era.join('\n\n') };
}

export function getComponent(name: string, eraId: string): ComponentAnswer {
  const era = requireEra(eraId);
  const entry = manifest.find((item) => item.name === name);
  if (entry === undefined) {
    throw new ToolError(
      'Unknown component "' +
        name +
        '". Available: ' +
        manifest.map((item) => item.name).join(', '),
    );
  }

  const named = EXPORTS[name] ?? [name];
  const { base, era: eraCss } = splitCssByEra(entry.css, era.id);

  const notes: string[] = [];

  // Guidance that applies to everything is stated in full on NostalgiaRoot,
  // which every consumer has to read first, and as a one line reminder on
  // the others, so a component's own notes are not buried under boilerplate.
  if (name === 'NostalgiaRoot') {
    notes.push(
      'Every component must render inside <NostalgiaRoot era="' +
        era.id +
        '" palette="..."> or inside an element carrying data-era and data-palette. Outside one, the token variables do not resolve and the component renders unstyled.',
      'Import the two stylesheets once, at the application root: @nostalgiaui/tokens/tokens.css then @nostalgiaui/react/styles.css. Components carry class names only and never import CSS themselves.',
      'Changing era or palette changes one attribute each. Nothing re-renders differently; the browser resolves a different set of custom properties.',
      'Portalled parts (Dialog) render back into this element rather than document.body, which is why it publishes its own element through context.',
    );
  } else {
    notes.push(
      'Must render inside NostalgiaRoot (see get_component for NostalgiaRoot), with both stylesheets imported once at the root.',
    );
  }

  switch (name) {
    case 'Button':
      notes.push(
        'Variants are solid, outline and ghost; that is the whole set. type defaults to "button", so a submit button needs type="submit" explicitly.',
        'render swaps the rendered element while keeping the styling: render={<a href="..." />} for a link, and the reverse direction, render={<Button variant="solid" />} on a Base UI part such as DialogTrigger, DialogClose or Tab, is how to put an era-styled button in a slot.',
      );
      break;
    case 'Input':
      notes.push(
        'invalid is the only extra prop. It adds the nui-Input--invalid class and sets data-invalid, which the era stylesheets key on.',
        'This is a bare <input> with no label of its own. Supply a <label htmlFor> that matches the id you pass, or wrap it in a label, or the field has no accessible name.',
      );
      break;
    case 'Card':
      notes.push(
        'Card has no header slot. CardTitle and CardBody are siblings placed by the caller, in that order. Anything after CardBody, such as a form or a button row, needs its own spacing; the card only pads its edges.',
        "elevated adds the era's raised shadow. Flat / Metro forbids shadows, so it distinguishes an elevated card by fill instead.",
      );
      break;
    case 'Tabs':
      notes.push(
        "Inside Tabs, TabIndicator must be placed inside TabList, not beside it. It positions itself from the active tab's geometry, which only TabList publishes.",
        'Tab accepts render, so render={<a href="..." />} makes link tabs and render={<Button variant="ghost" />} styles a tab as a button.',
      );
      break;
    case 'Dialog':
      notes.push(
        'DialogPortal renders into the nearest NostalgiaRoot rather than document.body. Without a NostalgiaRoot ancestor the dialog portals to the body, escapes the token scope, and appears with no surface, border or title bar.',
        'DialogTrigger and DialogClose render a plain <button> carrying only the nui-DialogTrigger or nui-DialogClose class. For an era-styled button in those slots, pass render={<Button variant="..." />}; the same render prop works on Tab.',
        'Order inside DialogPopup is DialogTitle, DialogDescription, then your actions. Classic Windows styles DialogTitle into the title bar, so it must come first.',
      );
      break;
    default:
      break;
  }

  return {
    name,
    era: era.id,
    imports: [
      'import { ' + named.join(', ') + " } from '@nostalgiaui/react';",
      "import '@nostalgiaui/tokens/tokens.css';",
      "import '@nostalgiaui/react/styles.css';",
    ].join('\n'),
    source: entry.source,
    baseCss: base,
    eraCss,
    notes,
  };
}

// --- import_vscode_theme ---------------------------------------------------

export interface ImportAnswer {
  readonly primitives: PalettePrimitives;
  readonly report: ImportReport;
  /** The semantic variables, ready to set on an element. */
  readonly cssVariables: Record<string, string>;
}

export function importTheme(theme: unknown): ImportAnswer {
  const { primitives, report } = importVsCodeTheme(theme);
  const palette: Palette = {
    id: 'imported',
    label: report.name ?? 'Imported theme',
    source: { theme: report.name ?? 'Imported theme', url: '', license: '' },
    primitives,
  };
  return { primitives, report, cssVariables: semanticVars(palette) };
}

// --- check_contrast --------------------------------------------------------

export function checkContrast(eraId: string, paletteId: string): ContrastAudit {
  return auditContrast(requireEra(eraId), requirePalette(paletteId));
}
