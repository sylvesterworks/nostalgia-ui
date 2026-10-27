/**
 * What counts as naming a color, shared by the stylesheet test and the
 * component documentation test so the two cannot drift apart.
 *
 * The project's central rule is that a component never names a color: every
 * color arrives through a token, so changing palette cannot miss a component
 * and adding a palette cannot require touching one. Documentation is held to
 * the same rule, so it says "the danger color" rather than a value or a name
 * that is only true of some palettes.
 *
 * Lives under src/docs, which the package build excludes, so none of this
 * ships.
 */

/**
 * CSS named colors that would pin something to a specific look. transparent
 * and currentColor are deliberately absent: neither ties anything to a
 * palette.
 */
export const NAMED_COLORS = [
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
] as const;

const HEX = /#[0-9a-fA-F]{3,8}\b/g;
const FUNCTIONS = /\b(rgba?|hsla?|oklch|oklab|lab|lch|color-mix)\s*\(/g;
// String.raw rather than a quoted string: in a normal string literal the
// escape collapses, and the guard silently becomes (?<![w-]) instead of a
// word boundary, which makes this check weaker than it looks.
const NAMED = new RegExp(
  String.raw`(?<![\w-])(` + NAMED_COLORS.join('|') + String.raw`)(?![\w-])`,
  'gi',
);

export function findHexColors(text: string): string[] {
  return text.match(HEX) ?? [];
}

export function findColorFunctions(text: string): string[] {
  return text.match(FUNCTIONS) ?? [];
}

export function findNamedColors(text: string): string[] {
  return text.match(NAMED) ?? [];
}

/** Every way the text names a color, in one list. */
export function findColors(text: string): string[] {
  return [...findHexColors(text), ...findColorFunctions(text), ...findNamedColors(text)];
}

export function stripCssComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}
