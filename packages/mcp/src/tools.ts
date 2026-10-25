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
 */
function splitCssByEra(css: string, eraId: string): { base: string; era: string } {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules = withoutComments.match(/[^{}]+\{[^{}]*\}/g) ?? [];
  const base: string[] = [];
  const era: string[] = [];
  for (const rule of rules) {
    const trimmed = rule.trim();
    if (!trimmed.includes('[data-era=')) {
      base.push(trimmed);
    } else if (trimmed.includes("[data-era='" + eraId + "']")) {
      era.push(trimmed);
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

  const notes: string[] = [
    'Every component must render inside <NostalgiaRoot era="' +
      era.id +
      '" palette="..."> or inside an element carrying data-era and data-palette. Outside one, the token variables do not resolve and the component renders unstyled.',
    'Import the two stylesheets once, at the application root. Components carry class names only and never import CSS themselves.',
  ];
  if (name === 'Dialog') {
    notes.push(
      'DialogPortal renders into the nearest NostalgiaRoot rather than document.body. Without a NostalgiaRoot ancestor the dialog portals to the body, escapes the token scope, and appears with no surface, border or title bar.',
    );
  }
  if (name === 'Tabs') {
    notes.push('TabIndicator must be placed inside TabList, not beside it.');
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
