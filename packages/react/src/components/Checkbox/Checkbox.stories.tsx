import type { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox, CheckboxIndicator } from './Checkbox.js';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

const row = { display: 'inline-flex', alignItems: 'center', gap: '0.5rem' } as const;

/** The box inside a label with its text: the text names it and ticks it. */
export const WithLabel: Story = {
  render: () => (
    <label style={row}>
      <Checkbox defaultChecked>
        <CheckboxIndicator />
      </Checkbox>
      Email me about releases
    </label>
  ),
};

/**
 * A parent box that is mixed while only some of the items below it are
 * ticked. Here the state is fixed; an app sets `indeterminate` from the
 * items.
 */
export const SelectAll: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '0.5rem' }}>
      <label style={row}>
        <Checkbox indeterminate>
          <CheckboxIndicator />
        </Checkbox>
        All notifications
      </label>
      <div style={{ display: 'grid', gap: '0.5rem', paddingLeft: '1.5rem' }}>
        <label style={row}>
          <Checkbox defaultChecked>
            <CheckboxIndicator />
          </Checkbox>
          Releases
        </label>
        <label style={row}>
          <Checkbox>
            <CheckboxIndicator />
          </Checkbox>
          Security advisories
        </label>
      </div>
    </div>
  ),
};

/** Unticked and ticked side by side. */
export const Checked: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1.5rem' }}>
      <label style={row}>
        <Checkbox>
          <CheckboxIndicator />
        </Checkbox>
        Unticked
      </label>
      <label style={row}>
        <Checkbox defaultChecked>
          <CheckboxIndicator />
        </Checkbox>
        Ticked
      </label>
    </div>
  ),
};

/** Disabled, unticked and ticked. */
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1.5rem' }}>
      <label style={row}>
        <Checkbox disabled>
          <CheckboxIndicator />
        </Checkbox>
        Unavailable
      </label>
      <label style={row}>
        <Checkbox disabled defaultChecked>
          <CheckboxIndicator />
        </Checkbox>
        Always on
      </label>
    </div>
  ),
};

/**
 * Don't: put the text beside the box with nothing tying them together. The
 * box has no name and the text cannot be clicked. Compare WithLabel.
 */
export const DontTextBesideBox: Story = {
  render: () => (
    <div style={row}>
      <Checkbox defaultChecked>
        <CheckboxIndicator />
      </Checkbox>
      <span>Email me about releases</span>
    </div>
  ),
};
