import type { Meta, StoryObj } from '@storybook/react-vite';

import { Switch, SwitchThumb } from './Switch.js';

const meta = {
  title: 'Components/Switch',
  component: Switch,
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

const row = { display: 'inline-flex', alignItems: 'center', gap: '0.5rem' } as const;

/** The switch inside a label with its text: the text names it and flips it. */
export const WithLabel: Story = {
  render: () => (
    <label style={row}>
      <Switch defaultChecked>
        <SwitchThumb />
      </Switch>
      Dark mode
    </label>
  ),
};

/** Several settings that each apply as soon as they are flipped. */
export const SettingsList: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <label style={row}>
        <Switch defaultChecked>
          <SwitchThumb />
        </Switch>
        Desktop notifications
      </label>
      <label style={row}>
        <Switch>
          <SwitchThumb />
        </Switch>
        Play sounds
      </label>
      <label style={row}>
        <Switch defaultChecked>
          <SwitchThumb />
        </Switch>
        Show previews
      </label>
    </div>
  ),
};

/** Off and on side by side. */
export const Checked: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1.5rem' }}>
      <label style={row}>
        <Switch>
          <SwitchThumb />
        </Switch>
        Off
      </label>
      <label style={row}>
        <Switch defaultChecked>
          <SwitchThumb />
        </Switch>
        On
      </label>
    </div>
  ),
};

/** Disabled, off and on. */
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1.5rem' }}>
      <label style={row}>
        <Switch disabled>
          <SwitchThumb />
        </Switch>
        Unavailable
      </label>
      <label style={row}>
        <Switch disabled defaultChecked>
          <SwitchThumb />
        </Switch>
        Always on
      </label>
    </div>
  ),
};

/**
 * Don't: put the text beside the switch with nothing tying them together.
 * The switch has no name and the text cannot be clicked. Compare WithLabel.
 */
export const DontTextBesideSwitch: Story = {
  render: () => (
    <div style={row}>
      <Switch defaultChecked>
        <SwitchThumb />
      </Switch>
      <span>Dark mode</span>
    </div>
  ),
};
