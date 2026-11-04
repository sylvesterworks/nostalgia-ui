import type * as React from 'react';

import type { ComponentDoc } from '../../docs/schema.js';

import type { Tooltip } from './Tooltip.js';

export const tooltipDoc = {
  name: 'Tooltip',
  summary:
    "Styling wrappers over Base UI's Tooltip parts, for a short hint about a control, shown on hover and on keyboard focus. Opening, the delays and dismissal come from Base UI; NostalgiaUI adds styling and portals the popup into the nearest NostalgiaRoot so the theme reaches it.",
  anatomy: [
    {
      name: 'TooltipProvider',
      className: '',
      description:
        "Base UI's Provider, unchanged. Shares one delay among the tooltips inside it and renders no element.",
    },
    {
      name: 'Tooltip',
      className: '',
      description: "Base UI's Root, unchanged. Holds the open state and renders no element.",
    },
    {
      name: 'TooltipTrigger',
      className: 'nui-TooltipTrigger',
      description: 'The control the tooltip describes. Render it as a Button for era styling.',
    },
    {
      name: 'TooltipPortal',
      className: '',
      description:
        'Moves the popup into the nearest NostalgiaRoot, so it keeps the era and palette.',
    },
    {
      name: 'TooltipPositioner',
      className: 'nui-TooltipPositioner',
      description: 'Places the popup against the trigger. Its `side` picks the edge.',
    },
    {
      name: 'TooltipPopup',
      className: 'nui-TooltipPopup',
      description: "The box that holds the tooltip's text.",
    },
    {
      name: 'TooltipArrow',
      className: 'nui-TooltipArrow',
      description:
        "The pointer toward the trigger, drawn in the popup's fill and edge. Hidden in Neumorphism.",
    },
  ],
  props: {
    open: {
      description:
        'Whether the tooltip is open, for a controlled Tooltip. Use with `onOpenChange`.',
    },
    defaultOpen: {
      description: 'Whether the tooltip starts open, for an uncontrolled Tooltip.',
    },
    onOpenChange: {
      description: 'Called when the tooltip opens or closes.',
    },
    disabled: {
      description: 'Stops the tooltip from opening.',
    },
  },
  patterns: [
    {
      title: 'Button trigger',
      description:
        'TooltipTrigger rendered as a Button through `render`, with the hint in the portal.',
      story: 'ButtonTrigger',
    },
    {
      title: 'Open tooltip',
      description: 'The popup above the trigger, with the arrow pointing down at it.',
      story: 'Open',
    },
  ],
  variants: ['Below'],
  doAndDont: [
    {
      do: {
        story: 'ButtonTrigger',
        description: 'Name the control with its own text and use the tooltip for an extra hint.',
      },
      dont: {
        story: 'DontTooltipAsName',
        description: "Make the tooltip an icon button's only name.",
      },
      why: "The tooltip is not the button's name, so axe reports an unnamed button and a screen reader has nothing to announce for it; and touch screens, with no hover, may never show the hint.",
    },
  ],
  accessibility: [
    'Base UI opens the tooltip on hover and on keyboard focus, after a delay, and Escape closes it with focus left on the trigger.',
    'Give the trigger a name of its own, from its text or `aria-label`. The tooltip adds a hint; it does not name the control.',
    "In Base UI 1.9.0 the open popup has no `tooltip` role and the trigger carries no `aria-describedby` pointing at it, so a screen reader is not told about the hint. Anything a screen reader user needs must be in the control's name or on the page.",
    "Tooltip text is body text, held to 4.5:1 on each era's fill: the contrast audit checks Classic Windows' tooltip fill as `text-on-tooltip-fill`, and the other eras use fills it already covers.",
  ],
  extensibility: {
    render:
      'TooltipTrigger renders a plain `button` by default. Pass `render={<Button variant="..." />}` for an era-styled button in that slot.',
    className:
      "A string is added to each part's own class. Base UI also accepts a function of state, but these wrappers do not support it: a function is replaced by the part's own class.",
    cssVariables: [
      {
        name: '--nui-color-surface-raised',
        description: 'The popup fill in eras that use a plain panel.',
      },
      {
        name: '--nui-color-text',
        description:
          'The tooltip text, and the fill of the inverted block in Flat / Metro. Keep it at 4.5:1 or more against the surface.',
      },
    ],
    extendVsOverride:
      'Wrap the parts into a tooltip helper for your app that takes the hint text. An explicit `container` on TooltipPortal still wins over the NostalgiaRoot default if the tooltip must render elsewhere.',
  },
  eraNotes: {
    'early-mac': 'A plain box with a pen edge and a hard drop shadow.',
    'classic-windows':
      'A square box with a plain dark edge on a warm fill derived from the raised surface and the warning color, so its hue follows the palette.',
    'frutiger-aero': 'A rounded glass box painted over the surface, with a soft shadow.',
    'flat-metro':
      'An inverted solid block: the surface color on the text color, with no edge or shadow.',
    'terminal-crt': 'An accent-bordered box in the monospace font.',
    neubrutalism: 'A thick ink edge with a hard shadow.',
    neumorphism: 'An extruded pill with no arrow.',
  },
  notes: [
    'A Tooltip opens on hover and keyboard focus, and touch screens have no hover, so put nothing in it that a person needs to use the page. A Tooltip is for hints; anything essential belongs on the page itself.',
    'TooltipPortal renders into the nearest NostalgiaRoot rather than `document.body`. Without a NostalgiaRoot ancestor the tooltip escapes the token scope and appears unstyled.',
    'TooltipTrigger renders a plain `button` carrying only its own class; for an era-styled button, pass `render={<Button variant="..." />}`.',
  ],
} as const satisfies ComponentDoc<React.ComponentProps<typeof Tooltip>>;
