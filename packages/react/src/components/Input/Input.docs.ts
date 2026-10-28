import type { ComponentDoc } from '../../docs/schema.js';

import type { InputProps } from './Input.js';

export const inputDoc = {
  name: 'Input',
  summary:
    "A single-line text field on Base UI's Input, styled by the era and palette. It is a bare `input` with no label of its own, so it always needs one supplied.",
  anatomy: [
    {
      name: 'Input',
      className: 'nui-Input',
      description:
        'The field. Gains `nui-Input--invalid` and `data-invalid` when `invalid` is set.',
    },
  ],
  props: {
    invalid: {
      description:
        'Marks the field as invalid. Adds the `nui-Input--invalid` class and the `data-invalid` attribute, which the era stylesheets key on.',
      whenToUse:
        'After validation fails. Pair it with `aria-invalid` and a message linked through `aria-describedby`, since the class alone is visual.',
    },
    className: {
      description:
        'A string is added to `nui-Input`. Base UI also accepts a function of state, but Input does not support it: a function is dropped and only the component classes apply.',
    },
  },
  patterns: [
    {
      title: 'Labeled field',
      description: 'A `label` whose `htmlFor` matches the input `id`.',
      story: 'WithLabel',
    },
    {
      title: 'Invalid field',
      description: 'The same markup with `invalid` set; each era draws it its own way.',
      story: 'Invalid',
    },
  ],
  variants: ['Default'],
  doAndDont: [
    {
      do: {
        story: 'WithLabel',
        description: 'Give the field a visible label linked by `htmlFor`.',
      },
      dont: {
        story: 'DontPlaceholderAsLabel',
        description: 'Rely on the placeholder as the only label.',
      },
      why: 'A placeholder disappears as soon as someone types and is not a reliable accessible name, so the field loses its label exactly when it is in use.',
    },
  ],
  accessibility: [
    'Input has no accessible name of its own. Supply a `label` with a matching `htmlFor`, wrap it in a `label`, or pass `aria-label`.',
    '`invalid` is visual only. Set `aria-invalid` and point `aria-describedby` at the error message so assistive technology announces it.',
    'The invalid state uses the palette danger color, which the semantic layer corrects to WCAG AA against the field surface.',
  ],
  extensibility: {
    render: "Accepts Base UI's `render` prop through its own props.",
    className: 'A string is added to `nui-Input`; a function of state is dropped.',
    cssVariables: [
      {
        name: '--nui-color-surface-sunken',
        description: 'The field background in eras that sink their fields.',
      },
      {
        name: '--nui-radius-sm',
        description: 'The corner radius in eras that round their fields.',
      },
    ],
    extendVsOverride:
      'Build a labeled field component around Input rather than adding label props to it, so Input stays one element.',
  },
  eraNotes: {
    'classic-windows': 'Invalid adds an inset ring in the danger color inside the border.',
    'flat-metro': 'Invalid recolors only the bottom border.',
    'terminal-crt': 'Invalid recolors both the border and the typed text.',
    neumorphism: 'Invalid adds a ring in the danger color outside the inset shadow.',
  },
  notes: [
    '`invalid` is the only prop Input adds to the Base UI field.',
    'Input is a bare `input` with no label of its own; without a label, `aria-label` or a wrapping `label`, it has no accessible name.',
  ],
} as const satisfies ComponentDoc<InputProps>;
