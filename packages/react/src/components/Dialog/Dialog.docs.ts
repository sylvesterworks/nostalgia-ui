import type * as React from 'react';

import type { ComponentDoc } from '../../docs/schema.js';

import type { Dialog } from './Dialog.js';

export const dialogDoc = {
  name: 'Dialog',
  summary:
    "A modal window over the page, on Base UI's Dialog. Focus trapping, scroll lock and dismissal come from Base UI; NostalgiaUI adds styling and portals the popup into the nearest NostalgiaRoot so the theme reaches it.",
  anatomy: [
    {
      name: 'Dialog',
      className: '',
      description: "Base UI's Root, unchanged. Holds the open state and renders no element.",
    },
    {
      name: 'DialogTrigger',
      className: 'nui-DialogTrigger',
      description: 'The button that opens the dialog.',
    },
    {
      name: 'DialogPortal',
      className: '',
      description:
        'Renders its children into the nearest NostalgiaRoot. Renders no element of its own.',
    },
    {
      name: 'DialogBackdrop',
      className: 'nui-DialogBackdrop',
      description: 'The layer behind the popup.',
    },
    {
      name: 'DialogPopup',
      className: 'nui-DialogPopup',
      description: 'The dialog window.',
    },
    {
      name: 'DialogTitle',
      className: 'nui-DialogTitle',
      description: 'The heading. Base UI uses it to label the popup.',
    },
    {
      name: 'DialogDescription',
      className: 'nui-DialogDescription',
      description: 'Supporting text. Base UI uses it to describe the popup.',
    },
    {
      name: 'DialogClose',
      className: 'nui-DialogClose',
      description: 'A button that closes the dialog.',
    },
  ],
  props: {
    open: {
      description: 'Whether the dialog is open, for a controlled Dialog. Use with `onOpenChange`.',
    },
    defaultOpen: {
      description: 'Whether the dialog starts open, for an uncontrolled Dialog.',
    },
    onOpenChange: {
      description: 'Called when the dialog opens or closes.',
    },
    modal: {
      description:
        "`true` by default: focus is trapped, page scroll is locked and the page behind cannot be clicked. `'trap-focus'` keeps only the focus trap.",
    },
  },
  patterns: [
    {
      title: 'Styled trigger and actions',
      description: 'DialogTrigger and DialogClose rendered as Buttons through `render`.',
      story: 'StyledTriggerAndClose',
    },
    {
      title: 'Open dialog',
      description: 'Title, description, then actions, inside DialogPopup.',
      story: 'Open',
    },
  ],
  variants: [],
  doAndDont: [
    {
      do: {
        story: 'Open',
        description: 'Put DialogTitle first inside DialogPopup.',
      },
      dont: {
        story: 'DontTitleAfterDescription',
        description: 'Put DialogDescription before DialogTitle.',
      },
      why: 'Classic Windows styles DialogTitle into the title bar at the top of the window, so a title placed later appears as a bar in the middle of the content.',
    },
  ],
  accessibility: [
    'When modal, Base UI traps focus in the popup and locks page scroll. Escape closes the dialog, and on close focus returns to the trigger or to whatever was focused before.',
    'Base UI labels the popup with DialogTitle and describes it with DialogDescription, so include both.',
    'Render a DialogClose inside DialogPopup for a modal dialog; Base UI notes that touch screen reader users need it to leave the popup.',
  ],
  extensibility: {
    render:
      'DialogTrigger and DialogClose render a plain `button` by default. Pass `render={<Button variant="..." />}` for an era-styled button in those slots.',
    className:
      "A string is added to each part's own class. Base UI also accepts a function of state, but these wrappers do not support it: a function is replaced by the part's own class.",
    cssVariables: [
      {
        name: '--nui-color-surface-raised',
        description:
          'The popup background. Override it together with `--nui-color-text` to keep contrast.',
      },
      {
        name: '--nui-radius-lg',
        description: 'The popup corner radius in eras that round their windows.',
      },
    ],
    extendVsOverride:
      'Build specific dialogs, such as a confirmation, by composing the parts. An explicit `container` on DialogPortal still wins over the NostalgiaRoot default if a dialog must render elsewhere.',
  },
  eraNotes: {
    'classic-windows':
      'DialogTitle becomes a filled title bar using the accent color, with the markup unchanged.',
    'terminal-crt': 'DialogTitle takes the accent color with a phosphor glow.',
  },
  notes: [
    'Order inside DialogPopup is DialogTitle, DialogDescription, then the actions.',
    'DialogPortal renders into the nearest NostalgiaRoot rather than `document.body`. Without a NostalgiaRoot ancestor the dialog escapes the token scope and appears with no surface, border or title bar.',
    'DialogTrigger and DialogClose render a plain `button` carrying only their own class; for an era-styled button, pass `render={<Button variant="..." />}`.',
  ],
} as const satisfies ComponentDoc<React.ComponentProps<typeof Dialog>>;
