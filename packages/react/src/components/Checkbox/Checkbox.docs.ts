import type * as React from 'react';

import type { ComponentDoc } from '../../docs/schema.js';

import type { Checkbox } from './Checkbox.js';

export const checkboxDoc = {
  name: 'Checkbox',
  summary:
    "Thin styling wrappers over Base UI's Checkbox parts, for one on-or-off choice that takes effect on its own, or for picking several items from a list. Ticking, the mixed state and form submission come from Base UI.",
  anatomy: [
    {
      name: 'Checkbox',
      className: 'nui-Checkbox',
      description:
        'The box. Base UI renders it as a `span` with `role="checkbox"` beside a hidden `input` that carries the form value.',
    },
    {
      name: 'CheckboxIndicator',
      className: 'nui-CheckboxIndicator',
      description:
        'The mark inside the box: a tick when checked and a dash when mixed. Mounted only while the box is checked or mixed, unless `keepMounted` is set.',
    },
  ],
  props: {
    checked: {
      description:
        'Whether the box is ticked, for a controlled Checkbox. Use with `onCheckedChange`.',
    },
    defaultChecked: {
      description: 'Whether the box starts ticked, for an uncontrolled Checkbox.',
    },
    onCheckedChange: {
      description: 'Called with the new value when the box is ticked or unticked.',
    },
    indeterminate: {
      description: 'Shows the mixed state, neither ticked nor unticked, and announces it as mixed.',
      whenToUse:
        'For a box that stands for a group, such as "select all", when only some of the group is ticked. Set it from the group\'s state; ticking the box does not clear it for you.',
    },
    disabled: {
      description: 'Ignores interaction and sets `data-disabled`, which each era draws.',
    },
    name: {
      description: 'The field name the hidden `input` submits with a form.',
    },
  },
  patterns: [
    {
      title: 'Checkbox with a label',
      description:
        'The box inside a `<label>` with its text, so the text names it and clicking the text ticks it.',
      story: 'WithLabel',
    },
    {
      title: 'Select all',
      description: 'A parent box that is mixed while only some of the items below it are ticked.',
      story: 'SelectAll',
    },
  ],
  variants: ['Checked', 'Disabled'],
  doAndDont: [
    {
      do: {
        story: 'WithLabel',
        description: 'Wrap the box and its text in a `<label>`.',
      },
      dont: {
        story: 'DontTextBesideBox',
        description: 'Put the text next to the box with nothing tying them together.',
      },
      why: 'Without the label the box has no accessible name, so a screen reader announces only "checkbox", and the text cannot be clicked to tick it.',
    },
  ],
  accessibility: [
    "Keyboard behavior is Base UI's: Tab to focus the box, Space to tick or untick it.",
    'The box needs a name. Wrap it in a `<label>` with its text, or give it `aria-label` when no visible text fits.',
    'The unticked edge is drawn in the muted text color, which clears the 3:1 WCAG asks of a control boundary on every surface. The tick and dash are drawn in the text color paired with the accent fill, which the semantic layer corrects to WCAG AA.',
    'In Terminal / CRT the box is drawn as `[ ]`, `[x]` and `[-]` in the body text color.',
  ],
  extensibility: {
    render:
      "Both parts accept `render`, following Base UI's composition contract, for example to render the indicator as an icon of your own.",
    className:
      "A string is added to each part's own class. Base UI also accepts a function of state, but these wrappers do not support it: a function is replaced by the part's own class.",
    cssVariables: [
      {
        name: '--nui-color-accent',
        description:
          'The ticked fill. Override it together with `--nui-color-text-on-accent` to keep the mark visible.',
      },
      {
        name: '--nui-color-text-muted',
        description:
          'The unticked edge. Keep it at 3:1 or more against the surface behind the box.',
      },
    ],
    extendVsOverride:
      'Wrap Checkbox and a `<label>` together to make a labeled field for your app, and style the label through `className`. Style the box through the era rather than per instance, so every era keeps drawing its own.',
  },
  eraNotes: {
    'early-mac':
      'A square box that is never filled: ticking draws an X from corner to corner, as the era did.',
    'classic-windows':
      'A small sunken well that is never filled: ticking draws a heavy tick in the text color. Disabled turns the well to the button face.',
    'frutiger-aero': 'A rounded glass box that fills with the vivid accent when ticked.',
    'flat-metro': 'A square tile with a 2px edge that fills solid when ticked.',
    'terminal-crt': 'No box: the state is drawn as bracket glyphs with the era glow.',
    neubrutalism: 'A thick ink box with a hard shadow, filled with the accent when ticked.',
    neumorphism:
      'A well pressed into the surface that rises when ticked. Unlike the rest of the era it keeps a 1px muted edge, so the boundary does not rely on soft shadows.',
  },
  notes: [
    'Checkbox has no label part of its own: wrap it in a `<label>`, or the box is announced with no name.',
    'Put CheckboxIndicator inside Checkbox. Without it the box still ticks, but nothing marks the ticked state except the fill, and Classic Windows draws no fill at all.',
  ],
} as const satisfies ComponentDoc<React.ComponentProps<typeof Checkbox>>;
