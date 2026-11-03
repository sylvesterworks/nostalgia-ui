import type * as React from 'react';

import type { ComponentDoc } from '../../docs/schema.js';

import type { Select } from './Select.js';

export const selectDoc = {
  name: 'Select',
  summary:
    "Styling wrappers over Base UI's Select parts, for choosing one option from a list too long for radio buttons. Opening, typeahead, arrow keys, selection and form submission come from Base UI.",
  anatomy: [
    {
      name: 'Select',
      className: '',
      description: 'The root. It renders no element of its own and holds the value.',
    },
    {
      name: 'SelectLabel',
      className: 'nui-SelectLabel',
      description:
        'The visible label. Base UI ties it to the trigger, which gives the trigger its name.',
    },
    {
      name: 'SelectTrigger',
      className: 'nui-SelectTrigger',
      description: 'The field that shows the chosen value and opens the list.',
    },
    {
      name: 'SelectValue',
      className: 'nui-SelectValue',
      description: 'The chosen label inside the trigger, or the placeholder when there is none.',
    },
    {
      name: 'SelectIcon',
      className: 'nui-SelectIcon',
      description:
        'The arrow at the end of the trigger, drawn by the stylesheet when it has no children.',
    },
    {
      name: 'SelectPortal',
      className: '',
      description:
        'Moves the list into the nearest NostalgiaRoot, so it keeps the era and palette.',
    },
    {
      name: 'SelectPositioner',
      className: 'nui-SelectPositioner',
      description: 'Places the popup against the trigger.',
    },
    {
      name: 'SelectPopup',
      className: 'nui-SelectPopup',
      description: 'The panel that holds the list.',
    },
    {
      name: 'SelectList',
      className: 'nui-SelectList',
      description: 'The scrolling list of options inside the popup.',
    },
    {
      name: 'SelectItem',
      className: 'nui-SelectItem',
      description: 'One option. Its `value` is what the Select holds once it is chosen.',
    },
    {
      name: 'SelectItemText',
      className: 'nui-SelectItemText',
      description: "The option's text, which the trigger shows once it is chosen.",
    },
    {
      name: 'SelectItemIndicator',
      className: 'nui-SelectItemIndicator',
      description:
        'The tick beside the chosen option. Mounted only on that option, unless `keepMounted` is set.',
    },
  ],
  props: {
    value: {
      description: 'The chosen value, for a controlled Select. Use with `onValueChange`.',
    },
    defaultValue: {
      description: 'The value chosen at first, for an uncontrolled Select.',
    },
    onValueChange: {
      description: 'Called with the new value when an option is chosen.',
    },
    items: {
      description:
        'The options as `{ value, label }` pairs or a record of value to label. With it, SelectValue shows the chosen label instead of the raw value.',
      whenToUse:
        "Whenever an option's value differs from the text people should see, such as a language code and its name.",
    },
    defaultOpen: {
      description: 'Whether the list starts open.',
    },
    disabled: {
      description:
        'Ignores interaction and sets `data-disabled` on the trigger, which each era draws.',
    },
    name: {
      description: 'The field name the hidden `input` submits with a form.',
    },
  },
  patterns: [
    {
      title: 'Select with a label',
      description:
        'SelectLabel inside Select, then the trigger with its value and arrow, then the portal with the options.',
      story: 'WithLabel',
    },
    {
      title: 'Open list',
      description:
        'The popup with the chosen option ticked and the highlighted option on the accent fill.',
      story: 'Open',
    },
  ],
  variants: ['Placeholder', 'Disabled'],
  doAndDont: [
    {
      do: {
        story: 'WithLabel',
        description: 'Name the trigger with SelectLabel inside Select.',
      },
      dont: {
        story: 'DontTextBesideTrigger',
        description: 'Put the label beside the trigger as plain text.',
      },
      why: 'Plain text is not tied to the trigger, so a screen reader announces only the chosen value, with nothing to say what it is a value of.',
    },
  ],
  accessibility: [
    "Keyboard behavior is Base UI's: Enter, Space or the arrow keys open the list, the arrow keys and typing move the highlight, Enter chooses, and Escape closes it with focus back on the trigger.",
    'The trigger needs a name. Use SelectLabel inside Select, or give the trigger `aria-label` when no visible text fits.',
    "The highlighted option is drawn on the accent fill in the text color paired with it, which the contrast audit checks as `item-highlighted`. The palette's selection color is not used: it is too close to the popup to show which option is highlighted.",
  ],
  extensibility: {
    render:
      "Every part that renders an element accepts `render`, following Base UI's composition contract, for example to give SelectIcon an icon of your own.",
    className:
      "A string is added to each part's own class. Base UI also accepts a function of state, but these wrappers do not support it: a function is replaced by the part's own class.",
    cssVariables: [
      {
        name: '--nui-color-accent',
        description:
          'The highlighted option. Override it together with `--nui-color-text-on-accent` to keep its text readable.',
      },
      {
        name: '--nui-color-surface-raised',
        description: 'The popup background in eras that use a plain panel.',
      },
    ],
    extendVsOverride:
      'Wrap the parts into a labeled select for your app, with your options passed in. An explicit `container` on SelectPortal still wins over the NostalgiaRoot default if the list must render elsewhere.',
  },
  eraNotes: {
    'classic-windows':
      'A sunken field with a raised arrow button holding a solid triangle, and a flat list with a plain dark edge.',
    'frutiger-aero':
      'An inset glass field and a glass popup painted over the surface, like Dialog.',
    'flat-metro':
      'A field with a single bottom rule, and a square popup with divider lines between options.',
    'terminal-crt':
      'An accent-bordered field and popup in the monospace font, with scanlines over the popup.',
    neubrutalism: 'An ink-edged field and popup, each with a hard shadow.',
    neumorphism: 'A field pressed into the surface and a popup that stands out of it.',
  },
  notes: [
    'Pass `items` to Select whenever values differ from their labels. Without it the trigger shows the raw value, such as `fr` instead of Français, once an option is chosen.',
    'SelectPortal renders into the nearest NostalgiaRoot rather than `document.body`. Without a NostalgiaRoot ancestor the list escapes the token scope and appears unstyled.',
    'Put SelectItemIndicator before SelectItemText in each SelectItem: the stylesheet keeps a column for the tick, so every option lines up whether or not it is the chosen one.',
  ],
} as const satisfies ComponentDoc<React.ComponentProps<typeof Select>>;
