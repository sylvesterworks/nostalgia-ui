import type * as React from 'react';

import type { ComponentDoc } from '../../docs/schema.js';

import type { Tabs } from './Tabs.js';

export const tabsDoc = {
  name: 'Tabs',
  summary:
    "Thin styling wrappers over Base UI's Tabs parts, for switching between panels of related content in one place. All keyboard behavior and panel association come from Base UI.",
  anatomy: [
    {
      name: 'Tabs',
      className: 'nui-Tabs',
      description: 'The root. Holds the selected value.',
    },
    {
      name: 'TabList',
      className: 'nui-TabList',
      description: 'The row of tabs. Publishes the active tab geometry that TabIndicator reads.',
    },
    {
      name: 'Tab',
      className: 'nui-Tab',
      description: 'One tab. Its `value` matches a TabPanel.',
    },
    {
      name: 'TabIndicator',
      className: 'nui-TabIndicator',
      description: 'The bar under the active tab, positioned from the geometry TabList publishes.',
    },
    {
      name: 'TabPanel',
      className: 'nui-TabPanel',
      description: 'The content for one tab value.',
    },
  ],
  props: {
    defaultValue: {
      description: 'The tab selected on first render, for an uncontrolled Tabs.',
    },
    value: {
      description: 'The selected tab, for a controlled Tabs. Use with `onValueChange`.',
    },
    onValueChange: {
      description: 'Called when the selected tab changes.',
    },
    orientation: {
      description:
        'Layout direction, `horizontal` by default. It also decides which arrow keys move focus.',
    },
  },
  patterns: [
    {
      title: 'Tabs with an indicator',
      description: 'TabIndicator placed last inside TabList.',
      story: 'WithIndicator',
    },
    {
      title: 'Link tabs',
      description: 'Each Tab rendered as a link through `render`.',
      story: 'LinkTabs',
    },
  ],
  variants: [],
  doAndDont: [
    {
      do: {
        story: 'WithIndicator',
        description: 'Use Tabs for a set of panels shown one at a time.',
      },
      dont: {
        story: 'DontButtonsAsTabs',
        description: 'Build the same thing from a row of buttons.',
      },
      why: 'Buttons look similar but have no tab roles, no arrow-key movement between them and no link to the panel they show, so assistive technology cannot tell what they do.',
    },
  ],
  accessibility: [
    "Keyboard behavior is Base UI's: arrow keys move focus between tabs and loop at the ends, and Enter or Space selects the focused tab. Set `activateOnFocus` on TabList to select on focus instead.",
    'Base UI links each Tab to its TabPanel, so the panel is labeled by its tab.',
    'The focus ring comes from the era, as for Button.',
  ],
  extensibility: {
    render:
      'Each part accepts `render`. `render={<a href="..." />}` on Tab makes link tabs, and `render={<Button variant="ghost" />}` styles a tab as a button.',
    className:
      "A string is added to each part's own class. Base UI also accepts a function of state, but these wrappers do not support it: a function is replaced by the part's own class.",
    cssVariables: [
      {
        name: '--nui-color-accent',
        description: 'The indicator color in eras that show one.',
      },
    ],
    extendVsOverride:
      'Keep the parts separate rather than collapsing them into one convenience component, so the composition Base UI provides stays available.',
  },
  eraNotes: {
    'classic-windows':
      'The indicator is hidden: the era had no animation, and an instant slide is still a slide.',
    neubrutalism: 'The indicator is hidden; the selected tab is marked by its own styling.',
    neumorphism: 'The indicator is hidden; the selected tab is marked by its own styling.',
  },
  notes: [
    'Inside Tabs, TabIndicator must be placed inside TabList. Base UI throws an error otherwise, because the indicator reads the active tab position from TabList.',
    'Tabs re-exports Base UI parts individually rather than as one component, so every part stays composable.',
  ],
} as const satisfies ComponentDoc<React.ComponentProps<typeof Tabs>>;
