import type { ComponentDoc } from '../../docs/schema.js';

import type { CardProps } from './Card.js';

export const cardDoc = {
  name: 'Card',
  summary:
    'A container that groups related content on a surface of its own. It has no interaction model, so it is plain presentation: Card, with CardTitle and CardBody placed inside it by the caller.',
  anatomy: [
    {
      name: 'Card',
      className: 'nui-Card',
      description: 'The container. Gains `nui-Card--elevated` when `elevated` is set.',
    },
    {
      name: 'CardTitle',
      className: 'nui-CardTitle',
      description: 'An `h3` heading for the card.',
    },
    {
      name: 'CardBody',
      className: 'nui-CardBody',
      description: 'A `div` for the card content.',
    },
  ],
  props: {
    elevated: {
      description: "Raises the card above the surface it sits on, using the era's raised shadow.",
      whenToUse: 'For a card that floats over other content, rather than one in a grid of peers.',
    },
    render: {
      description:
        'Replaces the rendered element while keeping the styling, for example `render={<section />}` or `render={<a href="..." />}`.',
    },
  },
  patterns: [
    {
      title: 'Title and body',
      description: 'CardTitle then CardBody, as siblings inside Card.',
      story: 'WithTitleAndBody',
    },
    {
      title: 'Elevated card',
      description: 'A card raised above the surface.',
      story: 'Elevated',
    },
  ],
  doAndDont: [
    {
      do: {
        story: 'WithActions',
        description: 'Give a row placed after CardBody its own top margin.',
      },
      dont: {
        story: 'DontActionsWithoutSpacing',
        description: 'Place a button row straight after CardBody.',
      },
      why: 'CardBody has no margin and Card pads only its edges, so a row placed straight after CardBody touches the text above it.',
    },
  ],
  accessibility: [
    'CardTitle always renders an `h3`. If that level does not fit the page outline, use a heading of the right level inside the card instead of CardTitle.',
    'Card is not focusable and has no role. A card that is a link should be rendered as one through `render`.',
  ],
  extensibility: {
    render: 'Card accepts `render`. CardTitle and CardBody are plain elements without it.',
    className: "Added to each part's own class, never instead of it.",
    cssVariables: [
      {
        name: '--nui-color-surface-raised',
        description:
          'The card background. Override it together with `--nui-color-text` to keep contrast.',
      },
      {
        name: '--nui-radius-lg',
        description: 'The corner radius in eras that round their cards.',
      },
    ],
    extendVsOverride:
      'Compose new card layouts from the three parts, for example a footer row inside CardBody, rather than adding slots to Card.',
  },
  eraNotes: {
    'flat-metro':
      'Flat / Metro forbids shadows, so an elevated card is distinguished by the raised surface fill instead.',
    'terminal-crt': 'CardTitle takes the accent color with a phosphor glow.',
  },
  notes: [
    'Card has no header slot. CardTitle and CardBody are siblings placed by the caller, in that order.',
    'Anything after CardBody, such as a button row, needs its own spacing; Card only pads its edges.',
  ],
} as const satisfies ComponentDoc<CardProps>;
