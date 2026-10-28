import type { ComponentDoc } from '../../docs/schema.js';

import type { NostalgiaRootProps } from './NostalgiaRoot.js';

export const nostalgiaRootDoc = {
  name: 'NostalgiaRoot',
  summary:
    'Wraps a region of the page in one era and one palette. Every other component must sit inside one. It renders a single `div` carrying `data-era` and `data-palette`, and publishes that element so portalled parts can render back into it.',
  anatomy: [
    {
      name: 'NostalgiaRoot',
      className: 'nui-root',
      description:
        "The themed region. It takes the palette's surface and text colors and the era's sans font.",
    },
  ],
  props: {
    era: {
      description: 'The era id, for example `classic-windows`. Controls shape and feel only.',
    },
    palette: {
      description: 'The palette id, for example `nord`. Controls color only.',
    },
    className: {
      description: 'Added to `nui-root`, never instead of it.',
    },
  },
  patterns: [
    {
      title: 'Two eras on one page',
      description:
        'A NostalgiaRoot inside another resolves its own variables, so regions can show different eras or palettes side by side.',
      story: 'Nesting',
    },
  ],
  variants: [],
  doAndDont: [
    {
      do: {
        story: 'Nesting',
        description: 'Render components inside a NostalgiaRoot.',
      },
      dont: {
        story: 'DontOutsideRoot',
        description: 'Render a component with no NostalgiaRoot above it.',
      },
      why: 'Outside a root the token variables do not resolve, so the component renders with no surface, border or era styling.',
    },
  ],
  accessibility: [
    'NostalgiaRoot adds no role or label; it is a plain `div`. Landmarks and headings remain the job of the content inside it.',
    'Every palette is corrected to WCAG AA by the semantic layer before it reaches the page, so text inside a NostalgiaRoot meets contrast for every era and palette pairing that ships.',
  ],
  extensibility: {
    render:
      'NostalgiaRoot has no `render` prop. It must be a real element, because portalled parts render into it.',
    className: 'A `className` is added to `nui-root`.',
    cssVariables: [
      {
        name: '--nui-color-surface',
        description:
          'The background of the region. Override it together with `--nui-color-text` to keep contrast.',
      },
      {
        name: '--nui-color-text',
        description: 'The default text color of the region.',
      },
    ],
    extendVsOverride:
      'To change the look of a whole region, choose a different era or palette rather than overriding variables. To theme a palette that does not ship, the importer builds one from a VS Code theme.',
  },
  eraNotes: {},
  notes: [
    'Changing era or palette changes one attribute on NostalgiaRoot; nothing else re-renders differently.',
    'NostalgiaRoot publishes its own element through context. That is what lets DialogPortal render into it instead of `document.body`, where the theme would not reach.',
  ],
} as const satisfies ComponentDoc<NostalgiaRootProps>;
