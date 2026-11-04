import type * as React from 'react';

import type { ComponentDoc } from '../../docs/schema.js';

import type { Slider } from './Slider.js';

export const sliderDoc = {
  name: 'Slider',
  summary:
    "Styling wrappers over Base UI's Slider parts, for picking a number, or a range, from a span by dragging or with the arrow keys. Dragging, the keys, stepping and form submission come from Base UI.",
  anatomy: [
    {
      name: 'Slider',
      className: 'nui-Slider',
      description: 'The root. It lays out the label and value above the control.',
    },
    {
      name: 'SliderLabel',
      className: 'nui-SliderLabel',
      description: 'The visible label. Base UI ties it to the thumbs, which gives them their name.',
    },
    {
      name: 'SliderValue',
      className: 'nui-SliderValue',
      description: 'The current value as text, in an `<output>`.',
    },
    {
      name: 'SliderControl',
      className: 'nui-SliderControl',
      description: 'The area that takes pointer input. It holds the track.',
    },
    {
      name: 'SliderTrack',
      className: 'nui-SliderTrack',
      description: 'The groove for the whole span, with a muted edge.',
    },
    {
      name: 'SliderIndicator',
      className: 'nui-SliderIndicator',
      description: 'The accent fill from the start to the value, or between two thumbs.',
    },
    {
      name: 'SliderThumb',
      className: 'nui-SliderThumb',
      description:
        'The handle, in the body text color. It holds a real `<input type="range">` that takes focus.',
    },
  ],
  props: {
    value: {
      description:
        'The value, for a controlled Slider: a number, or an array of numbers for a range. Use with `onValueChange`.',
    },
    defaultValue: {
      description: 'The starting value, for an uncontrolled Slider.',
    },
    onValueChange: {
      description: 'Called with the new value while the thumb moves.',
    },
    onValueCommitted: {
      description:
        'Called when Base UI commits a change; `eventDetails.reason` says whether it came from a drag, a track press or the keyboard.',
      whenToUse: 'For work that should not follow every `onValueChange`, such as saving the value.',
    },
    min: {
      description: 'The lowest value. 0 by default.',
    },
    max: {
      description: 'The highest value. 100 by default.',
    },
    step: {
      description: 'The amount each arrow key moves the value.',
    },
    disabled: {
      description: 'Ignores interaction and sets `data-disabled`, which each era draws.',
    },
    name: {
      description: 'The field name the value submits with a form.',
    },
  },
  patterns: [
    {
      title: 'Slider with a label and value',
      description:
        'SliderLabel and SliderValue inside Slider, then the control, track, indicator and thumb.',
      story: 'WithLabel',
    },
    {
      title: 'Range',
      description:
        'Two thumbs with their own `index` and `getAriaLabel`; the indicator fills between them.',
      story: 'Range',
    },
  ],
  variants: ['Disabled'],
  doAndDont: [
    {
      do: {
        story: 'WithLabel',
        description: 'Name the slider with SliderLabel inside Slider.',
      },
      dont: {
        story: 'DontUnlabeled',
        description: 'Leave the slider without a label.',
      },
      why: 'Without a label the thumb has no name, so a screen reader announces only a number, with nothing to say what it sets.',
    },
  ],
  accessibility: [
    "Keyboard behavior is Base UI's: the arrow keys move by `step`, Page Up and Page Down by `largeStep`, 10 by default, and Home and End jump to `min` and `max`.",
    'The thumb needs a name. Use SliderLabel inside Slider, or `getAriaLabel` on each thumb of a range.',
    'The thumb is in the body text color and larger than the track, so its outline sits on the page surface, which the contrast audit checks as `slider-thumb-on-surface`. The range is checked against the track as `slider-range-on-track`, and the track keeps a muted edge so its boundary is visible.',
  ],
  extensibility: {
    render:
      "Every part accepts `render`, following Base UI's composition contract, for example to render SliderValue in an element of your own.",
    className:
      "A string is added to each part's own class. Base UI also accepts a function of state, but these wrappers do not support it: a function is replaced by the part's own class.",
    cssVariables: [
      {
        name: '--nui-color-accent',
        description: 'The range. Keep it at 3:1 or more against the sunken track.',
      },
      {
        name: '--nui-color-text',
        description: 'The thumb. Keep it at 3:1 or more against the surface behind the slider.',
      },
    ],
    extendVsOverride:
      'Wrap the parts into a labeled slider for your app with its own min, max and step. Style the slider through the era rather than per instance, so every era keeps drawing its own.',
  },
  eraNotes: {
    'classic-windows': 'A thin sunken groove and an upright thumb with a raised bevel.',
    'frutiger-aero': 'A glass pill track with a glossy range and a bubble thumb.',
    'flat-metro': 'A thin square track and a tall square thumb, with no shadow.',
    'terminal-crt':
      'The range is a row of solid blocks in the body text color with the era glow, and the rest of the track a dotted rule.',
    neubrutalism: 'An ink-edged track and thumb, with a hard shadow on the thumb.',
    neumorphism:
      'A track pressed into the surface and a thumb that stands out of it. The track keeps a 1px muted edge, unlike the rest of the era.',
  },
  notes: [
    'Use Slider for values where roughly right is fine, such as volume. When an exact number matters, show it with SliderValue or offer an Input as well, since dragging to an exact value is hard.',
    'Put SliderThumb inside SliderTrack, after SliderIndicator. For a range, give each thumb an `index` and a `getAriaLabel` so the two can be told apart.',
  ],
} as const satisfies ComponentDoc<React.ComponentProps<typeof Slider>>;
