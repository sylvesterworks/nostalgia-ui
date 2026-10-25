/**
 * Scope resolution over a theme's tokenColors.
 *
 * VS Code resolves competing TextMate rules by letting the most specific
 * matching scope win. The importer asks the mirror-image question: given a
 * concept such as "the keyword colour", which rule in this theme speaks to it?
 *
 * Specificity is measured in dotted segments. A rule scoped `keyword` matches
 * the target `keyword.control` with two segments of agreement out of three,
 * while a rule scoped `comment` does not match it at all. The rule sharing the
 * longest prefix wins, which reproduces VS Code's ordering for the cases that
 * matter here without reimplementing the whole selector grammar.
 */

export interface ThemeRule {
  readonly scopes: readonly string[];
  readonly foreground: string;
}

export interface ScopeMatch {
  readonly color: string;
  readonly scope: string;
  readonly exact: boolean;
}

/**
 * Normalise the many shapes tokenColors entries take in the wild:
 * `scope` may be absent, a single string, a comma separated string, or an
 * array, and a rule without a foreground contributes no colour.
 */
export function normaliseRules(tokenColors: unknown): readonly ThemeRule[] {
  if (!Array.isArray(tokenColors)) {
    return [];
  }

  const rules: ThemeRule[] = [];
  for (const entry of tokenColors) {
    if (typeof entry !== 'object' || entry === null) {
      continue;
    }
    const record = entry as Record<string, unknown>;
    const settings = record['settings'];
    if (typeof settings !== 'object' || settings === null) {
      continue;
    }
    const foreground = (settings as Record<string, unknown>)['foreground'];
    if (typeof foreground !== 'string' || foreground.length === 0) {
      continue;
    }

    const rawScope = record['scope'];
    let scopes: string[];
    if (typeof rawScope === 'string') {
      // TextMate allows several selectors in one comma separated string.
      scopes = rawScope
        .split(',')
        .map((part) => part.trim())
        .filter((part) => part.length > 0);
    } else if (Array.isArray(rawScope)) {
      scopes = rawScope.filter((part): part is string => typeof part === 'string');
    } else {
      // A rule with no scope is the theme's default foreground rule.
      scopes = [''];
    }

    rules.push({ scopes, foreground });
  }
  return rules;
}

/** Segments of agreement between two dotted scope selectors, 0 if unrelated. */
function sharedPrefixLength(a: string, b: string): number {
  if (a === '' || b === '') {
    return 0;
  }
  const left = a.split('.');
  const right = b.split('.');
  let shared = 0;
  while (shared < left.length && shared < right.length && left[shared] === right[shared]) {
    shared += 1;
  }
  return shared;
}

/**
 * Find the best colour for a ranked list of target selectors.
 *
 * Targets are tried in order, so a role can express a preference
 * (`keyword.control` before the broader `keyword`) and fall back gracefully
 * when a theme only styles the broad scope.
 */
export function resolveScope(
  rules: readonly ThemeRule[],
  targets: readonly string[],
): ScopeMatch | undefined {
  // Exact matches win across the whole target list before any partial match is
  // considered. Without this, asking for `comment.line` in a theme that styles
  // plain `comment` would report an inherited match, even though the very next
  // target would have hit exactly.
  for (const target of targets) {
    for (const rule of rules) {
      for (const scope of rule.scopes) {
        if (scope === target) {
          return { color: rule.foreground, scope, exact: true };
        }
      }
    }
  }

  // No exact hit anywhere. Fall back to the rule sharing the longest dotted
  // prefix with the most preferred target that matches anything at all.
  for (const target of targets) {
    let best: ScopeMatch | undefined;
    let bestScore = 0;

    for (const rule of rules) {
      for (const scope of rule.scopes) {
        const score = sharedPrefixLength(scope, target);
        if (score > bestScore) {
          bestScore = score;
          best = { color: rule.foreground, scope, exact: false };
        }
      }
    }

    if (best !== undefined) {
      return best;
    }
  }

  return undefined;
}
