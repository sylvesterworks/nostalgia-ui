import type * as React from 'react';

import type { ComponentDoc } from '../../docs/schema.js';

import type { Switch } from './Switch.js';

export const switchDoc = {
  name: 'Switch',
  summary:
    "Thin styling wrappers over Base UI's Switch parts, for a setting that turns on or off the moment it is flipped. Toggling and form submission come from Base UI.",
  anatomy: [
    {
      name: 'Switch',
      className: 'nui-Switch',
      description:
        'The track. Base UI renders it as a `span` with `role="switch"` beside a hidden `input` that carries the form value.',
    },
    {
      name: 'SwitchThumb',
      className: 'nui-SwitchThumb',
      description: 'The thumb inside the track: at the start when off, at the end when on.',
    },
  ],
  props: {
    checked: {
      description: 'Whether the switch is on, for a controlled Switch. Use with `onCheckedChange`.',
    },
    defaultChecked: {
      description: 'Whether the switch starts on, for an uncontrolled Switch.',
    },
    onCheckedChange: {
      description: 'Called with the new value when the switch is turned on or off.',
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
      title: 'Switch with a label',
      description:
        'The switch inside a `<label>` with its text, so the text names it and clicking the text flips it.',
      story: 'WithLabel',
    },
    {
      title: 'A list of settings',
      description:
        'Several switches stacked, each one a setting that applies as soon as it is flipped.',
      story: 'SettingsList',
    },
  ],
  variants: ['Checked', 'Disabled'],
  doAndDont: [
    {
      do: {
        story: 'WithLabel',
        description: 'Wrap the switch and its text in a `<label>`.',
      },
      dont: {
        story: 'DontTextBesideSwitch',
        description: 'Put the text next to the switch with nothing tying them together.',
      },
      why: 'Without the label the switch has no accessible name, so a screen reader announces only "switch", and the text cannot be clicked to flip it.',
    },
  ],
  accessibility: [
    "Keyboard behavior is Base UI's: Tab to focus the switch, Space to turn it on or off.",
    'The switch needs a name. Wrap it in a `<label>` with its text, or give it `aria-label` when no visible text fits.',
    'The off edge and the off thumb are drawn in the muted text color, which clears 3:1 on every surface. The on thumb is drawn in the text color paired with the accent, so it clears 3:1 against the on track. The contrast audit checks both thumbs by name.',
    'In Terminal / CRT the switch is drawn as `[OFF]` and `[ON ]` in the body text color.',
  ],
  extensibility: {
    render: "Both parts accept `render`, following Base UI's composition contract.",
    className:
      "A string is added to each part's own class. Base UI also accepts a function of state, but these wrappers do not support it: a function is replaced by the part's own class.",
    cssVariables: [
      {
        name: '--nui-color-accent',
        description:
          'The on track. Override it together with `--nui-color-text-on-accent` to keep the thumb visible.',
      },
      {
        name: '--nui-color-text-muted',
        description:
          'The off edge and the off thumb. Keep it at 3:1 or more against the surface behind the switch.',
      },
    ],
    extendVsOverride:
      'Wrap Switch and a `<label>` together to make a labeled setting for your app, and style the label through `className`. Style the switch through the era rather than per instance, so every era keeps drawing its own.',
  },
  eraNotes: {
    'early-mac':
      'A box track that turns to the era dither when on; the thumb is solid pen when off and a plain box with a pen edge when on.',
    'classic-windows':
      'A sunken bevel well with a raised bevel block for a thumb, square at every corner.',
    'frutiger-aero':
      'A glass pill whose thumb carries the gloss band, filled with the accent when on.',
    'flat-metro': 'A square track with a 2px edge that turns into a solid accent tile when on.',
    'terminal-crt': 'No track: the state is drawn as a bracketed word with the era glow.',
    neubrutalism: 'A thick ink track and an ink-edged thumb with a hard shadow.',
    neumorphism:
      'A track pressed into the surface and a thumb that stands out of it. Unlike the rest of the era the track keeps a 1px muted edge, so the boundary does not rely on soft shadows.',
  },
  notes: [
    'Use Switch for a setting that applies at once, and Checkbox for a choice that waits for a submit button. A switch inside a form that only saves on submit tells the user something already happened when it has not.',
    'Put SwitchThumb inside Switch. Without it the track still toggles, but in most eras nothing but the track fill marks the state.',
  ],
} as const satisfies ComponentDoc<React.ComponentProps<typeof Switch>>;
