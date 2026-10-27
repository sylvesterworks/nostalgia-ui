import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './Button.js';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Button', variant: 'solid' },
  argTypes: {
    variant: { control: 'select', options: ['solid', 'outline', 'ghost', 'danger'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Solid: Story = { args: { variant: 'solid', children: 'Solid' } };

export const Outline: Story = { args: { variant: 'outline', children: 'Outline' } };

export const Ghost: Story = { args: { variant: 'ghost', children: 'Ghost' } };

/** The destructive action. It reads the palette's own danger color. */
export const Danger: Story = { args: { variant: 'danger', children: 'Delete' } };

export const Disabled: Story = { args: { variant: 'solid', children: 'Disabled', disabled: true } };

/** `render` swaps the element and keeps the styling. */
export const AsLink: Story = {
  args: { variant: 'outline', children: 'Read the docs', render: <a href="#as-link" /> },
};
