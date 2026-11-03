import type { Meta, StoryObj } from '@storybook/react-vite';
import type * as React from 'react';

import { Button } from '../Button/index.js';
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuPortal,
  MenuPositioner,
  MenuSeparator,
  MenuTrigger,
} from './Menu.js';

const meta = {
  title: 'Components/Menu',
  component: Menu,
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

function Items(): React.ReactElement {
  return (
    <MenuPortal>
      <MenuPositioner>
        <MenuPopup>
          <MenuItem>Copy profile link</MenuItem>
          <MenuItem>Export data</MenuItem>
          <MenuItem disabled>Transfer ownership</MenuItem>
          <MenuSeparator />
          <MenuItem>Sign out</MenuItem>
        </MenuPopup>
      </MenuPositioner>
    </MenuPortal>
  );
}

/**
 * MenuTrigger rendered as a Button through `render`, so the trigger is styled
 * by the era like every other button.
 */
export const ButtonTrigger: Story = {
  render: () => (
    <Menu>
      <MenuTrigger render={<Button variant="outline" />}>Profile actions</MenuTrigger>
      <Items />
    </Menu>
  ),
};

/**
 * Open on load, to show the popup, a separator, a disabled item and the
 * highlighted item. MenuPortal renders into the NostalgiaRoot the story sits
 * in, which is why the popup keeps the era and palette.
 */
export const Open: Story = {
  render: () => (
    <Menu defaultOpen>
      <MenuTrigger render={<Button variant="outline" />}>Profile actions</MenuTrigger>
      <Items />
    </Menu>
  ),
};

/** A disabled Menu: the trigger ignores clicks and keys. */
export const Disabled: Story = {
  render: () => (
    <Menu disabled>
      <MenuTrigger render={<Button variant="outline" disabled />}>Profile actions</MenuTrigger>
      <Items />
    </Menu>
  ),
};

/**
 * Don't: leave MenuTrigger as a plain button. It carries only its own class,
 * so it has no era styling and looks out of place next to Buttons. Compare
 * ButtonTrigger.
 */
export const DontPlainTrigger: Story = {
  render: () => (
    <Menu>
      <MenuTrigger>Profile actions</MenuTrigger>
      <Items />
    </Menu>
  ),
};
