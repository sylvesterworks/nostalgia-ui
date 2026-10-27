import type { FoundationsDoc } from './schema.js';

/**
 * What is true of every component, stated once so no component doc repeats
 * it. A reader that starts anywhere in the docs is pointed here.
 */
export const foundationsDoc: FoundationsDoc = {
  summary:
    'Every NostalgiaUI component is a Base UI part or a plain element with class names, styled only through CSS custom properties. Two choices decide how it looks: the era, for shape and feel, and the palette, for color. Both are set on one ancestor element.',
  rules: [
    {
      title: 'Render inside NostalgiaRoot',
      description:
        'Every component must render inside `<NostalgiaRoot era="..." palette="...">`, or inside an element carrying `data-era` and `data-palette`. Outside one, the token variables do not resolve and the component renders unstyled.',
    },
    {
      title: 'Import the two stylesheets once',
      description:
        'Import `@nostalgiaui/tokens/tokens.css` and then `@nostalgiaui/react/styles.css` once, at the application root. Components carry class names only and never import CSS themselves, so the library needs no bundler configuration for CSS.',
    },
    {
      title: 'Switching is an attribute change',
      description:
        'Changing era or palette changes one attribute each. Nothing re-renders differently and no markup changes; the browser resolves a different set of custom properties.',
    },
    {
      title: 'The class name contract',
      description:
        "Each part always carries a `nui-<Part>` class, for example `nui-Button` or `nui-DialogTitle`, and modifiers use `nui-<Part>--<modifier>`. A `className` you pass is added to those classes, never instead of them, so the library's styles always apply.",
    },
    {
      title: 'Composition through render',
      description:
        'Components that render an element accept Base UI\'s `render` prop, which swaps the element while keeping the styling. It works in both directions: `render={<a href="..." />}` turns a Button into a link, and `render={<Button />}` puts an era-styled Button into a Base UI slot such as `DialogTrigger`.',
    },
    {
      title: 'Colors come from tokens only',
      description:
        'No component names a color. Every color is a semantic token such as `--nui-color-accent` or `--nui-color-danger`, set by the palette and corrected for contrast. Overriding one on an element is allowed, but the contrast guarantee then becomes yours to keep.',
    },
  ],
};
