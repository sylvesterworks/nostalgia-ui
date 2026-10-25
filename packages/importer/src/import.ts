import { chroma, isLight, mix, setHue } from '@nostalgiaui/tokens';
import type { PalettePrimitives } from '@nostalgiaui/tokens';

import { normaliseRules, resolveScope } from './scopes.js';
import type { ImportReport, ImportResult, PrimitiveReport, Provenance } from './types.js';

/**
 * Ranked scope selectors per role. Earlier entries are preferred, so a theme
 * that styles the narrow scope is read precisely and a theme that only styles
 * the broad one still resolves.
 */
const SCOPE_TARGETS = {
  keyword: ['keyword.control', 'keyword', 'storage.type', 'storage'],
  string: ['string.quoted', 'string'],
  function: ['entity.name.function', 'support.function', 'entity.name'],
  comment: ['comment.line', 'comment'],
  error: ['invalid.illegal', 'invalid', 'message.error'],
} as const;

/** Conventional hues, used only when a theme publishes nothing for a role. */
const FALLBACK_HUES = { string: 145, function: 85, error: 25 } as const;

/** Last-resort values, used only when a theme has no usable colours at all. */
const LAST_RESORT = { background: '#1e1e1e', foreground: '#d4d4d4' } as const;

type SyntaxRole = 'keyword' | 'string' | 'function' | 'comment' | 'error';

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
}

function colorAt(colors: Record<string, unknown>, key: string): string | undefined {
  const value = colors[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * VS Code colour values may carry an alpha suffix. Alpha is meaningless for a
 * palette primitive, which has to be an opaque surface or text colour, so it
 * is dropped rather than silently composited against an assumed backdrop.
 */
function stripAlpha(value: string): string {
  if (/^#[0-9a-fA-F]{8}$/.test(value)) {
    return value.slice(0, 7);
  }
  if (/^#[0-9a-fA-F]{4}$/.test(value)) {
    return value.slice(0, 4);
  }
  return value;
}

export function importVsCodeTheme(theme: unknown): ImportResult {
  const root = asRecord(theme);
  const colors = asRecord(root['colors']);
  const warnings: string[] = [];
  const reports: PrimitiveReport[] = [];

  const include = root['include'];
  if (typeof include === 'string') {
    warnings.push(
      'This theme extends ' +
        include +
        ' through the include field. That file is not available here, so anything it would have contributed is missing and the roles below may fall back.',
    );
  }

  const tokenColors = root['tokenColors'];
  if (typeof tokenColors === 'string') {
    warnings.push(
      'tokenColors points at the TextMate file ' +
        tokenColors +
        ' rather than listing rules inline. Syntax colours cannot be read from this file alone, so every syntax role is derived.',
    );
  } else if (tokenColors === undefined) {
    warnings.push('No tokenColors field, so every syntax role is derived.');
  }

  if (Object.keys(colors).length === 0) {
    warnings.push('No colors block, so the surface and text colours are derived or defaulted.');
  }

  const rules = normaliseRules(tokenColors);

  const backgroundHit = colorAt(colors, 'editor.background');
  const background = stripAlpha(backgroundHit ?? LAST_RESORT.background);
  reports.push({
    primitive: 'background',
    value: background,
    provenance: backgroundHit === undefined ? 'fallback' : 'exact',
    source: backgroundHit === undefined ? 'default dark background' : 'colors[editor.background]',
  });

  const foregroundHit = colorAt(colors, 'editor.foreground');
  let foreground: string;
  let foregroundProvenance: Provenance;
  let foregroundSource: string;
  if (foregroundHit !== undefined) {
    foreground = stripAlpha(foregroundHit);
    foregroundProvenance = 'exact';
    foregroundSource = 'colors[editor.foreground]';
  } else {
    // The theme's unscoped default rule is the next best authority on text.
    const defaultRule = rules.find((rule) => rule.scopes.includes(''));
    if (defaultRule !== undefined) {
      foreground = stripAlpha(defaultRule.foreground);
      foregroundProvenance = 'inherited';
      foregroundSource = 'tokenColors default rule';
    } else {
      foreground = isLight(background) ? '#1a1a1a' : LAST_RESORT.foreground;
      foregroundProvenance = 'fallback';
      foregroundSource = 'opposite end of the background';
    }
  }
  reports.push({
    primitive: 'foreground',
    value: foreground,
    provenance: foregroundProvenance,
    source: foregroundSource,
  });

  const selectionHit =
    colorAt(colors, 'editor.selectionBackground') ??
    colorAt(colors, 'editor.inactiveSelectionBackground');
  const selection =
    selectionHit === undefined ? mix(background, foreground, 0.2) : stripAlpha(selectionHit);
  reports.push({
    primitive: 'selection',
    value: selection,
    provenance: selectionHit === undefined ? 'derived' : 'exact',
    source:
      selectionHit === undefined
        ? 'background mixed 20 percent toward foreground'
        : 'colors[editor.selectionBackground]',
  });

  const syntax: Partial<Record<SyntaxRole, string>> = {};
  const roles: readonly SyntaxRole[] = ['keyword', 'string', 'function', 'comment', 'error'];

  // The workbench publishes an explicit error colour, and it is a better
  // source for the error role than the invalid.* token scopes. One Dark Pro
  // styles invalid.illegal as WHITE text, because in the editor it sits on a
  // red fill; read as a palette colour that white would become the danger
  // role. Its colors block carries editorError.foreground #c24038, which is
  // the colour a person would call the theme's red.
  const workbenchError =
    colorAt(colors, 'editorError.foreground') ?? colorAt(colors, 'errorForeground');
  if (workbenchError !== undefined) {
    const value = stripAlpha(workbenchError);
    syntax.error = value;
    reports.push({
      primitive: 'error',
      value,
      provenance: 'exact',
      source: 'colors[editorError.foreground]',
    });
  }

  for (const role of roles) {
    if (role === 'error' && syntax.error !== undefined) {
      continue;
    }
    let match = resolveScope(rules, SCOPE_TARGETS[role]);

    // An invalid.* foreground with almost no chroma is a text colour meant
    // for a filled background, not the theme's error colour. Treat it as no
    // match so the role derives from the keyword hue instead.
    if (role === 'error' && match !== undefined && chroma(stripAlpha(match.color)) < 0.03) {
      match = undefined;
    }

    if (match !== undefined) {
      const value = stripAlpha(match.color);
      syntax[role] = value;
      reports.push({
        primitive: role,
        value,
        provenance: match.exact ? 'exact' : 'inherited',
        source: 'tokenColors scope ' + match.scope,
      });
      continue;
    }

    // Nothing matched. Derive from what the theme does have, rather than
    // reaching for a colour it never contained.
    if (role === 'comment') {
      const value = mix(background, foreground, 0.45);
      syntax[role] = value;
      reports.push({
        primitive: role,
        value,
        provenance: 'derived',
        source: 'background mixed 45 percent toward foreground',
      });
      continue;
    }

    if (role === 'keyword') {
      const value = mix(background, foreground, 0.85);
      syntax[role] = value;
      reports.push({
        primitive: role,
        value,
        provenance: 'derived',
        source: 'background mixed 85 percent toward foreground',
      });
      continue;
    }

    // The remaining roles rotate the keyword colour to the hue convention for
    // that role, which keeps them inside the theme's own tonal family.
    const anchor = syntax.keyword ?? foreground;
    const degrees = FALLBACK_HUES[role];
    const value = setHue(anchor, degrees);
    syntax[role] = value;
    reports.push({
      primitive: role,
      value,
      provenance: 'derived',
      source: 'keyword colour rotated to ' + String(degrees) + ' degrees',
    });
  }

  const primitives: PalettePrimitives = {
    background,
    foreground,
    selection,
    keyword: syntax.keyword ?? foreground,
    string: syntax.string ?? foreground,
    function: syntax.function ?? foreground,
    comment: syntax.comment ?? foreground,
    error: syntax.error ?? foreground,
  };

  const declaredType = typeof root['type'] === 'string' ? root['type'] : undefined;
  const appearance = isLight(background) ? 'light' : 'dark';
  if (declaredType !== undefined && declaredType !== appearance && declaredType !== 'hc') {
    warnings.push(
      'The theme declares type ' +
        declaredType +
        ' but its background reads as ' +
        appearance +
        '. The measured background wins, since a declared type is occasionally wrong.',
    );
  }

  const report: ImportReport = {
    name: typeof root['name'] === 'string' ? root['name'] : undefined,
    appearance,
    declaredType,
    primitives: reports,
    warnings,
    guessedCount: reports.filter((entry) => entry.provenance !== 'exact').length,
  };

  return { primitives, report };
}
