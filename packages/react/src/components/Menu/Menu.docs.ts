import type * as React from 'react';

import type { ComponentDoc } from '../../docs/schema.js';

import type { Menu } from './Menu.js';

export const menuDoc = {
  name: 'Menu',
  summary:
    "Styling wrappers over Base UI's Menu parts, for a list of actions behind a button. Opening, arrow keys, typeahead, activation and dismissal come from Base UI; NostalgiaUI adds styling and portals the popup into the nearest NostalgiaRoot so the theme reaches it.",
  anatomy: [
    {
      name: 'Menu',
      className: '',
      description: "Base UI's Root, unchanged. Holds the open state and renders no element.",
    },
    {
      name: 'MenuTrigger',
      className: 'nui-MenuTrigger',
      description: 'The button that opens the menu. Render it as a Button for era styling.',
    },
    {
      name: 'MenuPortal',
      className: '',
      description:
        'Moves the popup into the nearest NostalgiaRoot, so it keeps the era and palette.',
    },
    {
      name: 'MenuPositioner',
      className: 'nui-MenuPositioner',
      description: 'Places the popup against the trigger.',
    },
    {
      name: 'MenuPopup',
      className: 'nui-MenuPopup',
      description: 'The panel that holds the items.',
    },
    {
      name: 'MenuItem',
      className: 'nui-MenuItem',
      description: 'One action. Activating it calls `onClick` and closes the menu.',
    },
    {
      name: 'MenuSeparator',
      className: 'nui-MenuSeparator',
      description: 'A rule between groups of items.',
    },
  ],
  props: {
    open: {
      description: 'Whether the menu is open, for a controlled Menu. Use with `onOpenChange`.',
    },
    defaultOpen: {
      description: 'Whether the menu starts open, for an uncontrolled Menu.',
    },
    onOpenChange: {
      description: 'Called when the menu opens or closes.',
    },
    modal: {
      description:
        '`true` by default: while open, page scroll is locked and the rest of the page cannot be clicked. `false` leaves the page usable.',
    },
    disabled: {
      description: 'Makes the menu ignore interaction.',
    },
  },
  patterns: [
    {
      title: 'Button trigger',
      description:
        'MenuTrigger rendered as a Button through `render`, then the items in the portal.',
      story: 'ButtonTrigger',
    },
    {
      title: 'Open menu',
      description:
        'Items with a separator before the last group, a disabled item and the highlighted item on the accent fill.',
      story: 'Open',
    },
  ],
  variants: ['Disabled'],
  doAndDont: [
    {
      do: {
        story: 'ButtonTrigger',
        description: 'Render MenuTrigger as a Button with `render={<Button variant="..." />}`.',
      },
      dont: {
        story: 'DontPlainTrigger',
        description: 'Leave MenuTrigger as a plain button.',
      },
      why: 'MenuTrigger carries only its own class, so on its own it is a browser-default button with no era styling.',
    },
  ],
  accessibility: [
    "Keyboard behavior is Base UI's: Enter, Space or the arrow keys open the menu, the arrow keys and typing move the highlight, Enter or Space activates, and Escape closes it with focus back on the trigger.",
    'The trigger is named by its text, so give it words that say what the actions are about, such as "Profile actions", rather than an icon alone.',
    'The highlighted item is drawn on the accent fill in the text color paired with it, which the contrast audit checks as `item-highlighted`, with a ring in the body text color so the row stands out from the popup in every palette. Disabled items use the muted text color.',
  ],
  extensibility: {
    render:
      'MenuTrigger renders a plain `button` by default. Pass `render={<Button variant="..." />}` for an era-styled button in that slot.',
    className:
      "A string is added to each part's own class. Base UI also accepts a function of state, but these wrappers do not support it: a function is replaced by the part's own class.",
    cssVariables: [
      {
        name: '--nui-color-accent',
        description:
          'The highlighted item. Override it together with `--nui-color-text-on-accent` to keep its text readable.',
      },
      {
        name: '--nui-color-surface-raised',
        description: 'The popup background in eras that use a plain panel.',
      },
    ],
    extendVsOverride:
      'Compose the parts into the menus your app needs, with your own items. An explicit `container` on MenuPortal still wins over the NostalgiaRoot default if the menu must render elsewhere.',
  },
  eraNotes: {
    'early-mac':
      'A pull-down menu with a hard drop shadow and a dotted separator; the highlighted item is the two tones inverted.',
    'classic-windows':
      'A flat list with a plain dark edge and square rows, with an etched groove for a separator.',
    'frutiger-aero': 'A glass popup painted over the surface, like Dialog.',
    'flat-metro':
      'A square popup with divider lines between items and a heavier rule for a separator.',
    'terminal-crt':
      'An accent-bordered popup in the monospace font with scanlines, and a dashed separator.',
    neubrutalism: 'An ink-edged popup with a hard shadow and an ink separator.',
    neumorphism: 'A popup that stands out of the surface.',
  },
  notes: [
    'Use Menu for actions, not for choosing a value to keep. A Menu item runs something and closes the Menu; nothing stays chosen, so a Menu used as a picker leaves no sign of what was picked.',
    'MenuPortal renders into the nearest NostalgiaRoot rather than `document.body`. Without a NostalgiaRoot ancestor the menu escapes the token scope and appears unstyled.',
    'MenuTrigger renders a plain `button` carrying only its own class; for an era-styled button, pass `render={<Button variant="..." />}`.',
  ],
} as const satisfies ComponentDoc<React.ComponentProps<typeof Menu>>;
