/**
 * Props tables, extracted from the TypeScript types with the compiler API
 * (#38, decision 0010).
 *
 * The types are the source of truth for a prop's name, type and whether it is
 * required, and its JSDoc is the source for the description and the default.
 * Writing any of that by hand in a doc would let the two drift apart.
 *
 * Only props declared in this package or by Base UI are kept. Every part also
 * inherits around three hundred React and DOM attributes, which are the same
 * on every element and documented by React. A prop declared anywhere else is
 * an error rather than silently dropped, so a new source of props is noticed.
 *
 * This runs at build time only, from cli.ts, and is not published: it imports
 * typescript, which is a dev dependency.
 */
import { join } from 'node:path';

import ts from 'typescript';

import type { PropRow, PropsTable } from '../docs/schema.js';

/** A program over the package's public entry point, with its own compiler options. */
export function createSourceProgram(packageDir: string): ts.Program {
  const configPath = join(packageDir, 'tsconfig.json');
  const config = ts.getParsedCommandLineOfConfigFile(
    configPath,
    {},
    {
      ...ts.sys,
      onUnRecoverableConfigFileDiagnostic: (diagnostic) => {
        throw new Error(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
      },
    },
  );
  if (config === undefined) throw new Error('could not read ' + configPath);
  return ts.createProgram([join(packageDir, 'src', 'index.ts')], config.options);
}

type Origin = PropRow['origin'] | 'react';

function originOf(declaration: ts.Declaration, srcDir: string): Origin {
  const file = declaration.getSourceFile().fileName.replace(/\\/g, '/');
  if (file.startsWith(srcDir)) return 'nostalgiaui';
  if (file.includes('/@base-ui/react/')) return 'base-ui';
  if (file.includes('/@types/react/')) return 'react';
  throw new Error('prop declared outside this package, Base UI and React: ' + file);
}

/**
 * The type as a reader needs it. exactOptionalPropertyTypes adds
 * `| undefined` to every optional prop; the `required` column already says it
 * may be left out, so that member is dropped. A union of string or number
 * literals is spelled out, so `variant` reads as its four values rather than
 * as `ButtonVariant`, a name a reader of the manifest cannot look up.
 */
function printType(checker: ts.TypeChecker, type: ts.Type, required: boolean): string {
  const members = type.isUnion() ? type.types : [type];
  const kept = required
    ? members
    : members.filter((member) => (member.flags & ts.TypeFlags.Undefined) === 0);
  const flags = ts.TypeFormatFlags.NoTruncation;
  if (
    kept.length > 0 &&
    kept.every((member) => member.isStringLiteral() || member.isNumberLiteral())
  ) {
    return kept.map((member) => checker.typeToString(member, undefined, flags)).join(' | ');
  }
  const printed = checker.typeToString(type, undefined, flags);
  return required ? printed : printed.replace(/ \| undefined$/, '');
}

function rowFor(checker: ts.TypeChecker, prop: ts.Symbol, origin: PropRow['origin']): PropRow {
  const required = (prop.flags & ts.SymbolFlags.Optional) === 0;
  const type = printType(checker, checker.getTypeOfSymbol(prop), required);
  // JSDoc wraps lines at the source's width. Join those, keeping blank-line
  // paragraph breaks, which is the Prose format the docs use.
  const description = ts
    .displayPartsToString(prop.getDocumentationComment(checker))
    .trim()
    .replace(/(?<!\n)\n(?!\n)/g, ' ');
  const defaultTag = prop.getJsDocTags(checker).find((tag) => tag.name === 'default');
  const defaultText =
    defaultTag === undefined ? undefined : ts.displayPartsToString(defaultTag.text).trim();
  return {
    name: prop.name,
    type,
    required,
    ...(defaultText === undefined || defaultText === '' ? {} : { default: defaultText }),
    description,
    origin,
  };
}

/**
 * The props table for every component exported from src/index.ts, keyed by
 * export name. Hooks (`use*`) and type-only exports are skipped. Within a
 * part, this package's own props come first, then Base UI's, each in
 * declaration order.
 */
export function extractProps(program: ts.Program, packageDir: string): PropsTable {
  const checker = program.getTypeChecker();
  const srcDir = join(packageDir, 'src').replace(/\\/g, '/') + '/';
  const entry = program.getSourceFile(join(packageDir, 'src', 'index.ts'));
  const moduleSymbol = entry === undefined ? undefined : checker.getSymbolAtLocation(entry);
  if (moduleSymbol === undefined) throw new Error('src/index.ts not found in the program');

  const table: Record<string, readonly PropRow[]> = {};
  for (const exported of checker.getExportsOfModule(moduleSymbol)) {
    if (exported.name.startsWith('use')) continue;
    const symbol =
      exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
    if ((symbol.flags & (ts.SymbolFlags.Function | ts.SymbolFlags.Variable)) === 0) continue;

    const signature = checker.getTypeOfSymbol(symbol).getCallSignatures()[0];
    const propsParameter = signature?.parameters[0];
    if (propsParameter === undefined) {
      throw new Error(exported.name + ' is exported but takes no props');
    }

    const own: PropRow[] = [];
    const baseUi: PropRow[] = [];
    for (const prop of checker.getPropertiesOfType(checker.getTypeOfSymbol(propsParameter))) {
      const declaration = prop.declarations?.[0];
      if (declaration === undefined)
        throw new Error(exported.name + '.' + prop.name + ' has no declaration');
      const origin = originOf(declaration, srcDir);
      if (origin === 'react') continue;
      (origin === 'nostalgiaui' ? own : baseUi).push(rowFor(checker, prop, origin));
    }
    table[exported.name] = [...own, ...baseUi];
  }
  return table;
}
