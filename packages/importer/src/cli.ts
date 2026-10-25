#!/usr/bin/env node
/**
 * nostalgiaui-import ./my-theme.json
 *
 * Prints the palette and, more importantly, the provenance of every value, so
 * that a guess is visible rather than silent. An import that quietly invents
 * half a palette is worse than one that refuses, which is what --strict is for.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import process from 'node:process';

import { importVsCodeTheme } from './import.js';
import type { ImportReport, Provenance } from './types.js';

interface Options {
  readonly file: string | undefined;
  readonly out: string | undefined;
  readonly strict: boolean;
  readonly help: boolean;
}

function parseArgs(argv: readonly string[]): Options {
  let file: string | undefined;
  let out: string | undefined;
  let strict = false;
  let help = false;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--strict') {
      strict = true;
    } else if (arg === '--help' || arg === '-h') {
      help = true;
    } else if (arg === '--out') {
      out = argv[i + 1];
      i += 1;
    } else if (arg !== undefined && !arg.startsWith('-')) {
      file ??= arg;
    }
  }

  return { file, out, strict, help };
}

const USAGE = [
  'Usage: nostalgiaui-import <theme.json> [options]',
  '',
  'Options:',
  '  --out <dir>   Write a palette module and a SOURCE.md stub into <dir>',
  '  --strict      Exit non-zero if any value had to be guessed',
  '  -h, --help    Show this message',
].join('\n');

/** Slug suitable for a palette id and a directory name. */
function toId(name: string | undefined, file: string): string {
  const base = name ?? basename(file, extname(file));
  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toCamel(id: string): string {
  return id.replace(/-([a-z0-9])/g, (_match, char: string) => char.toUpperCase());
}

const MARKER: Record<Provenance, string> = {
  exact: '  ',
  inherited: ' ~',
  derived: ' ?',
  fallback: ' !',
};

function renderReport(report: ImportReport): string {
  const lines: string[] = [];
  lines.push('');
  lines.push((report.name ?? 'Unnamed theme') + '  (' + report.appearance + ')');
  if (report.declaredType !== undefined && report.declaredType !== report.appearance) {
    lines.push('declared type: ' + report.declaredType);
  }
  lines.push('');

  const width = Math.max(...report.primitives.map((entry) => entry.primitive.length));
  for (const entry of report.primitives) {
    lines.push(
      MARKER[entry.provenance] +
        ' ' +
        entry.primitive.padEnd(width) +
        '  ' +
        entry.value.padEnd(9) +
        '  ' +
        entry.provenance.padEnd(9) +
        '  ' +
        entry.source,
    );
  }

  lines.push('');
  lines.push('   exact  taken straight from the theme');
  lines.push(' ~ inherited  a related scope, not the one preferred');
  lines.push(' ? derived    computed from another value in this theme');
  lines.push(' ! fallback   nothing in the theme could inform it');
  lines.push('');

  if (report.warnings.length > 0) {
    for (const warning of report.warnings) {
      lines.push('warning: ' + warning);
      lines.push('');
    }
  }

  lines.push(
    report.guessedCount === 0
      ? 'Every value came straight from the theme.'
      : String(report.guessedCount) +
          ' of ' +
          String(report.primitives.length) +
          ' values were not exact.',
  );

  return lines.join('\n');
}

function renderPaletteModule(
  id: string,
  label: string,
  primitives: Record<string, string>,
): string {
  const entries = Object.entries(primitives)
    .map(([key, value]) => '    ' + key + ": '" + value + "',")
    .join('\n');

  return [
    "import type { Palette } from '../types.js';",
    '',
    'export const ' + toCamel(id) + ': Palette = {',
    "  id: '" + id + "',",
    "  label: '" + label.replace(/'/g, "\\'") + "',",
    '  source: {',
    "    theme: '" + label.replace(/'/g, "\\'") + "',",
    "    url: '', // TODO: link the source theme repo",
    "    license: '', // TODO: record the licence before shipping this palette",
    '  },',
    '  primitives: {',
    entries,
    '  },',
    '};',
    '',
  ].join('\n');
}

function renderSourceStub(label: string): string {
  return [
    '# ' + label,
    '',
    'Imported with nostalgiaui-import.',
    '',
    '- Source: TODO link the original theme repository',
    '- Licence: TODO record the licence before shipping this palette',
    '- Licence file: TODO',
    '',
    'Prefer wording this as inspired by the theme if the theme carries its own',
    'branding.',
    '',
  ].join('\n');
}

const options = parseArgs(process.argv.slice(2));

if (options.help || options.file === undefined) {
  process.stdout.write(USAGE + '\n');
  process.exit(options.help ? 0 : 1);
}

const raw = await readFile(options.file, 'utf8');

let parsed: unknown;
try {
  parsed = JSON.parse(raw);
} catch (error) {
  process.stderr.write(
    'Could not parse ' + options.file + ' as JSON: ' + (error as Error).message + '\n',
  );
  process.exit(1);
}

const { primitives, report } = importVsCodeTheme(parsed);
process.stdout.write(renderReport(report) + '\n');

if (options.out !== undefined) {
  const id = toId(report.name, options.file);
  const label = report.name ?? id;
  const dir = options.out;
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, id + '.ts'), renderPaletteModule(id, label, primitives), 'utf8');
  await mkdir(join(dir, id), { recursive: true });
  await writeFile(join(dir, id, 'SOURCE.md'), renderSourceStub(label), 'utf8');
  process.stdout.write(
    '\nwrote ' + join(dir, id + '.ts') + '\nwrote ' + join(dir, id, 'SOURCE.md') + '\n',
  );
}

if (options.strict && report.guessedCount > 0) {
  process.stderr.write('\nStrict mode: ' + String(report.guessedCount) + ' values were guessed.\n');
  process.exit(1);
}
