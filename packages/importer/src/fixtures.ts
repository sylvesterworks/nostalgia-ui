/**
 * Theme fixtures synthesised in-repo.
 *
 * Deliberately not copies of published themes. Real theme files carry licence
 * obligations and considerable bulk, and none of that buys test value: what
 * needs exercising is the shape of the format, not any particular author's
 * colour choices. Each fixture below isolates one hazard.
 */

/** The well-behaved case: inline rules, exact scopes, a full colors block. */
export const wellFormed = {
  name: 'Fixture Well Formed',
  type: 'dark',
  colors: {
    'editor.background': '#202430',
    'editor.foreground': '#e6e9f0',
    'editor.selectionBackground': '#39415a',
  },
  tokenColors: [
    { scope: 'comment', settings: { foreground: '#6b7392', fontStyle: 'italic' } },
    { scope: 'keyword.control', settings: { foreground: '#c792ea' } },
    { scope: 'string.quoted', settings: { foreground: '#86d98a' } },
    { scope: 'entity.name.function', settings: { foreground: '#82aaff' } },
    { scope: 'invalid.illegal', settings: { foreground: '#ff5370' } },
  ],
};

/** scope as an array, and as a comma separated string. Both are legal. */
export const multiScope = {
  name: 'Fixture Multi Scope',
  type: 'dark',
  colors: {
    'editor.background': '#1b1d23',
    'editor.foreground': '#dcdfe4',
  },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#707585' } },
    { scope: 'keyword, storage.type', settings: { foreground: '#e0a0ff' } },
    { scope: ['string'], settings: { foreground: '#9ad17b' } },
  ],
};

/** Only broad scopes are styled, so narrow targets must resolve by inheritance. */
export const broadScopesOnly = {
  name: 'Fixture Broad Scopes',
  type: 'dark',
  colors: {
    'editor.background': '#161616',
    'editor.foreground': '#f0f0f0',
  },
  tokenColors: [
    { scope: 'keyword', settings: { foreground: '#ff9f43' } },
    { scope: 'string', settings: { foreground: '#55efc4' } },
    { scope: 'comment', settings: { foreground: '#636e72' } },
  ],
};

/** tokenColors is a path to a TextMate file, so no syntax colours are readable. */
export const tmThemePath = {
  name: 'Fixture External TextMate',
  type: 'dark',
  colors: {
    'editor.background': '#242424',
    'editor.foreground': '#e8e8e8',
  },
  tokenColors: './Fixture.tmTheme',
};

/** The theme extends another file that is not available here. */
export const withInclude = {
  name: 'Fixture Include',
  include: './base-dark.json',
  colors: {
    'editor.background': '#101418',
  },
  tokenColors: [{ scope: 'keyword', settings: { foreground: '#7fd1ff' } }],
};

/** No colors block at all, and an unscoped default rule carrying the text colour. */
export const noColorsBlock = {
  name: 'Fixture No Colors',
  tokenColors: [
    { settings: { foreground: '#cfcfcf' } },
    { scope: 'keyword', settings: { foreground: '#ffb86c' } },
  ],
};

/** Colour values carrying an alpha suffix. */
export const alphaValues = {
  name: 'Fixture Alpha',
  type: 'dark',
  colors: {
    'editor.background': '#1e1e1eff',
    'editor.foreground': '#d4d4d4ee',
    'editor.selectionBackground': '#264f7855',
  },
  tokenColors: [{ scope: 'keyword', settings: { foreground: '#569cd6cc' } }],
};

/** Declares itself dark while actually being light. Themes do get this wrong. */
export const mislabelledType = {
  name: 'Fixture Mislabelled',
  type: 'dark',
  colors: {
    'editor.background': '#fbf8f1',
    'editor.foreground': '#4a4a4a',
  },
  tokenColors: [{ scope: 'keyword', settings: { foreground: '#8a6d00' } }],
};

/** Entries that contribute nothing: no settings, no foreground, wrong types. */
export const junkEntries = {
  name: 'Fixture Junk',
  type: 'dark',
  colors: {
    'editor.background': '#222222',
    'editor.foreground': '#eeeeee',
  },
  tokenColors: [
    null,
    'not an object',
    { scope: 'keyword' },
    { scope: 'string', settings: {} },
    { scope: 'comment', settings: { fontStyle: 'italic' } },
    { scope: 'keyword', settings: { foreground: '#bb86fc' } },
  ],
};

/** Nothing usable whatsoever. */
export const empty = {};

/**
 * Styles only a SIBLING of the scopes we ask for: `keyword.operator` exists,
 * but neither `keyword.control` nor plain `keyword` does. This is the case
 * that genuinely forces inheritance, as opposed to merely matching a less
 * preferred target exactly.
 */
export const siblingScopesOnly = {
  name: 'Fixture Sibling Scopes',
  type: 'dark',
  colors: {
    'editor.background': '#17191f',
    'editor.foreground': '#e3e6ec',
  },
  tokenColors: [
    { scope: 'keyword.operator.arithmetic', settings: { foreground: '#f28fad' } },
    { scope: 'string.template', settings: { foreground: '#a6e3a1' } },
  ],
};
