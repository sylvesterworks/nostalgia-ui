import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';
import { beforeAll, describe, expect, it } from 'vitest';

import { buttonDoc } from '../components/Button/Button.docs.js';
import { cardDoc } from '../components/Card/Card.docs.js';
import { dialogDoc } from '../components/Dialog/Dialog.docs.js';
import { inputDoc } from '../components/Input/Input.docs.js';
import { nostalgiaRootDoc } from '../components/NostalgiaRoot/NostalgiaRoot.docs.js';
import { tabsDoc } from '../components/Tabs/Tabs.docs.js';
import { findColors } from '../docs/color-rules.js';
import type { PropsTable } from '../docs/schema.js';
import * as pkg from '../index.js';

import { createSourceProgram, extractProps } from './props.js';

/**
 * The props tables the build writes into the manifest (#38, decision 0010).
 * The tables are extracted here from the same source the build reads, so a
 * failure points at the type or JSDoc to fix rather than at dist.
 */

const packageDir = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const docs = [nostalgiaRootDoc, buttonDoc, inputDoc, cardDoc, tabsDoc, dialogDoc] as const;

/** Exported parts, as docs.test.ts counts them: hooks are not parts. */
const parts = Object.keys(pkg)
  .filter((name) => !name.startsWith('use'))
  .sort();

let program: ts.Program;
let table: PropsTable;

beforeAll(() => {
  program = createSourceProgram(packageDir);
  table = extractProps(program, packageDir);
}, 60_000);

function rowsOf(part: string): NonNullable<PropsTable[string]> {
  const rows = table[part];
  if (rows === undefined) throw new Error('no props table for ' + part);
  return rows;
}

/**
 * Defaults written in a component's own destructuring, for example
 * `const { variant = 'solid' } = props`, keyed by prop name.
 */
function destructuredDefaults(part: string): Map<string, string> {
  const defaults = new Map<string, string>();
  for (const file of program.getSourceFiles()) {
    if (!file.fileName.replace(/\\/g, '/').includes('/packages/react/src/components/')) continue;
    for (const statement of file.statements) {
      if (!ts.isFunctionDeclaration(statement) || statement.name?.text !== part) continue;
      for (const inner of statement.body?.statements ?? []) {
        if (!ts.isVariableStatement(inner)) continue;
        for (const declaration of inner.declarationList.declarations) {
          if (!ts.isObjectBindingPattern(declaration.name)) continue;
          for (const element of declaration.name.elements) {
            if (element.initializer !== undefined && ts.isIdentifier(element.name)) {
              defaults.set(element.name.text, element.initializer.getText(file));
            }
          }
        }
      }
    }
  }
  return defaults;
}

function fail(part: string): never {
  throw new Error('src/index.ts not found while looking up ' + part);
}

/** Every prop a part accepts, React and DOM attributes included. */
function allPropNames(part: string): string[] {
  const checker = program.getTypeChecker();
  const entry = program.getSourceFile(join(packageDir, 'src', 'index.ts'));
  const moduleSymbol = entry === undefined ? undefined : checker.getSymbolAtLocation(entry);
  const exported = checker
    .getExportsOfModule(moduleSymbol ?? fail(part))
    .find((s) => s.name === part);
  if (exported === undefined) throw new Error(part + ' is not exported');
  const symbol = checker.getAliasedSymbol(exported);
  const parameter = checker.getTypeOfSymbol(symbol).getCallSignatures()[0]?.parameters[0];
  if (parameter === undefined) throw new Error(part + ' takes no props');
  return checker.getPropertiesOfType(checker.getTypeOfSymbol(parameter)).map((p) => p.name);
}

describe('props tables', () => {
  it('exist for every exported part and nothing else', () => {
    expect(Object.keys(table).sort()).toEqual(parts);
  });

  it.each(parts)('%s: every prop has a JSDoc description', (part) => {
    const missing = rowsOf(part)
      .filter((row) => row.description === '')
      .map((row) => row.name);
    expect(missing, part + ' props without a description').toEqual([]);
  });

  it.each(parts)('%s: descriptions written here name no color', (part) => {
    const found = rowsOf(part)
      .filter((row) => row.origin === 'nostalgiaui')
      .flatMap((row) => findColors(row.description));
    expect(found).toEqual([]);
  });

  it.each(parts)('%s: each @default matches the default in the code', (part) => {
    const inCode = destructuredDefaults(part);
    for (const row of rowsOf(part).filter((r) => r.origin === 'nostalgiaui')) {
      expect(row.default, part + '.' + row.name + ' @default').toBe(inCode.get(row.name));
    }
  });

  it.each(docs.map((doc) => [doc.name, doc] as const))(
    '%s: every prop the doc names exists on the component',
    (name, doc) => {
      // A doc may describe an inherited React prop, such as Button's `type`;
      // the table leaves those out, so check against the full props type.
      const known = new Set([...rowsOf(name).map((row) => row.name), ...allPropNames(name)]);
      const unknown = Object.keys(doc.props).filter((prop) => !known.has(prop));
      expect(unknown, name + ' doc names props the component does not have').toEqual([]);
    },
  );

  // Updated deliberately: `pnpm --filter @nostalgiaui/react test -- -u`
  // after a prop, its JSDoc or the Base UI version changes.
  it.each(parts)('%s matches its snapshot', (part) => {
    expect(rowsOf(part)).toMatchSnapshot();
  });
});

/** The props of the virtual fixture's only export. */
function allNames(virtual: ts.Program): string[] {
  const checker = virtual.getTypeChecker();
  const entry = virtual
    .getSourceFiles()
    .find((f) => normalizeName(f.fileName).endsWith('/virtual/src/index.ts'));
  const moduleSymbol = entry === undefined ? undefined : checker.getSymbolAtLocation(entry);
  if (moduleSymbol === undefined) return [];
  const part = checker.getExportsOfModule(moduleSymbol)[0];
  const parameter =
    part === undefined
      ? undefined
      : checker.getTypeOfSymbol(part).getCallSignatures()[0]?.parameters[0];
  if (parameter === undefined) return [];
  return checker.getPropertiesOfType(checker.getTypeOfSymbol(parameter)).map((p) => p.name);
}

function normalizeName(fileName: string): string {
  return fileName.replace(/\\/g, '/');
}

describe('the extractor', () => {
  it('rejects a prop declared outside this package, Base UI and React', () => {
    // Two in-memory files: the entry point, and a global declaration that
    // lives outside src, standing in for a new dependency's props.
    const files = new Map([
      [
        '/virtual/src/index.ts',
        'export function Part(props: Foreign): Foreign { return props; }\n',
      ],
      ['/virtual/lib/foreign.d.ts', 'interface Foreign { readonly stray: string }\n'],
    ]);
    const normalize = (fileName: string): string =>
      fileName.replace(/\\/g, '/').replace(/^[A-Za-z]:/, '');
    const host = ts.createCompilerHost({ strict: true });
    const original = host.getSourceFile.bind(host);
    host.getSourceFile = (fileName, languageVersion) => {
      const text = files.get(normalize(fileName));
      return text === undefined
        ? original(fileName, languageVersion)
        : ts.createSourceFile(fileName, text, languageVersion, true);
    };
    const virtual = ts.createProgram([...files.keys()], { strict: true }, host);
    // The fixture itself must be sound, or the assertion below proves nothing.
    expect(allNames(virtual)).toEqual(['stray']);
    expect(() => extractProps(virtual, '/virtual')).toThrow(/outside this package/);
  });
});

// --- Our props in story args (#41) ----------------------------------------

const storyModules = {
  NostalgiaRoot: () => import('../components/NostalgiaRoot/NostalgiaRoot.stories.js'),
  Button: () => import('../components/Button/Button.stories.js'),
  Input: () => import('../components/Input/Input.stories.js'),
  Card: () => import('../components/Card/Card.stories.js'),
  Tabs: () => import('../components/Tabs/Tabs.stories.js'),
  Dialog: () => import('../components/Dialog/Dialog.stories.js'),
} as const;

/** Every arg name the meta or any story in a stories module sets. */
function argNames(module: Readonly<Record<string, unknown>>): Set<string> {
  const names = new Set<string>();
  for (const value of Object.values(module)) {
    if (value === null || typeof value !== 'object') continue;
    const args = (value as { readonly args?: unknown }).args;
    if (args !== null && typeof args === 'object') {
      for (const name of Object.keys(args)) names.add(name);
    }
  }
  return names;
}

/**
 * The props this package declares on a family's parts that no story sets in
 * its args. Base UI's props are left out: they are Base UI's to demonstrate.
 */
function propsMissingFromArgs(
  family: readonly string[],
  props: PropsTable,
  args: ReadonlySet<string>,
): string[] {
  return family.flatMap((part) =>
    (props[part] ?? [])
      .filter((row) => row.origin === 'nostalgiaui' && !args.has(row.name))
      .map((row) => part + '.' + row.name),
  );
}

describe('story args', () => {
  it.each(docs.map((doc) => [doc.name, doc] as const))(
    '%s sets every prop this package declares in some story',
    async (name, doc) => {
      const module: Record<string, unknown> = await storyModules[name]();
      const family = doc.anatomy.map((part) => part.name);
      expect(propsMissingFromArgs(family, table, argNames(module))).toEqual([]);
    },
  );

  it('reject a prop of ours that no story sets', () => {
    const props: PropsTable = {
      Card: [
        {
          name: 'elevated',
          type: 'boolean',
          required: false,
          description: '',
          origin: 'nostalgiaui',
        },
        {
          name: 'render',
          type: 'unknown',
          required: false,
          description: '',
          origin: 'nostalgiaui',
        },
        {
          name: 'nativeButton',
          type: 'boolean',
          required: false,
          description: '',
          origin: 'base-ui',
        },
      ],
    };
    const module = {
      default: { args: { elevated: false } },
      Elevated: { args: { elevated: true } },
    };
    expect(propsMissingFromArgs(['Card'], props, argNames(module))).toEqual(['Card.render']);
  });
});
