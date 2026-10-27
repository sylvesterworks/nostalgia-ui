import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from './Input.js';

const meta = {
  title: 'Components/Input',
  component: Input,
  args: { placeholder: 'Your name', 'aria-label': 'Your name' },
  argTypes: {
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Each era expresses invalid differently; the markup is the same. */
export const Invalid: Story = {
  args: { invalid: true, defaultValue: 'not an email', 'aria-label': 'Email' },
};

/** Input has no label of its own. A label with a matching htmlFor gives it an accessible name. */
export const WithLabel: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: '0.5rem', maxWidth: '20rem' }}>
      <label htmlFor="story-email">Email</label>
      <Input {...args} id="story-email" type="email" placeholder="you@example.com" />
    </div>
  ),
};

/** Don't: rely on the placeholder as the only label. Compare WithLabel. */
export const DontPlaceholderAsLabel: Story = {
  args: { placeholder: 'Email', 'aria-label': undefined },
};
