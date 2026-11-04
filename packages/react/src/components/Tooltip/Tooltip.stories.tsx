import type { Meta, StoryObj } from '@storybook/react-vite';
import type * as React from 'react';

import { Button } from '../Button/index.js';
import {
  Tooltip,
  TooltipArrow,
  TooltipPopup,
  TooltipPortal,
  TooltipPositioner,
  TooltipTrigger,
} from './Tooltip.js';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Room above and below the trigger so an open tooltip is not clipped. */
const stage = { padding: '3rem 1rem' } as const;

function Tip(props: {
  readonly side?: 'top' | 'bottom';
  readonly children: React.ReactNode;
}): React.ReactElement {
  return (
    <TooltipPortal>
      <TooltipPositioner side={props.side ?? 'top'} sideOffset={8}>
        <TooltipPopup>
          <TooltipArrow />
          {props.children}
        </TooltipPopup>
      </TooltipPositioner>
    </TooltipPortal>
  );
}

/**
 * TooltipTrigger rendered as a Button through `render`. The button is named
 * by its own text; the tooltip adds a hint on hover and keyboard focus.
 */
export const ButtonTrigger: Story = {
  render: () => (
    <div style={stage}>
      <Tooltip>
        <TooltipTrigger render={<Button variant="solid" />}>Publish</TooltipTrigger>
        <Tip>Makes this page visible to everyone with the link.</Tip>
      </Tooltip>
    </div>
  ),
};

/**
 * Open on load, to show the popup and its arrow. TooltipPortal renders into
 * the NostalgiaRoot the story sits in, which is why the tooltip keeps the era
 * and palette.
 */
export const Open: Story = {
  render: () => (
    <div style={stage}>
      <Tooltip defaultOpen>
        <TooltipTrigger render={<Button variant="solid" />}>Publish</TooltipTrigger>
        <Tip>Makes this page visible to everyone with the link.</Tip>
      </Tooltip>
    </div>
  ),
};

/** Open below the trigger, with the arrow on the popup's top edge. */
export const Below: Story = {
  render: () => (
    <div style={stage}>
      <Tooltip defaultOpen>
        <TooltipTrigger render={<Button variant="solid" />}>Publish</TooltipTrigger>
        <Tip side="bottom">Makes this page visible to everyone with the link.</Tip>
      </Tooltip>
    </div>
  ),
};

/**
 * Don't: use the tooltip as an icon button's only name. The tooltip is not
 * the button's name, so the button has none, and touch screens, with no
 * hover, may never show it. Compare ButtonTrigger.
 */
export const DontTooltipAsName: Story = {
  render: () => (
    <div style={stage}>
      <Tooltip>
        <TooltipTrigger render={<Button variant="solid" />}>
          <span aria-hidden="true">?</span>
        </TooltipTrigger>
        <Tip>Help</Tip>
      </Tooltip>
    </div>
  ),
};
