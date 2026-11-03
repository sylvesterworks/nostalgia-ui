import type { Meta, StoryObj } from '@storybook/react-vite';
import type * as React from 'react';

import {
  Select,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectList,
  SelectPopup,
  SelectPortal,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
} from './Select.js';

const meta = {
  title: 'Components/Select',
  component: Select,
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const languages = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ja', label: '日本語' },
] as const;

function Options(): React.ReactElement {
  return (
    <SelectPortal>
      <SelectPositioner>
        <SelectPopup>
          <SelectList>
            {languages.map((language) => (
              <SelectItem key={language.value} value={language.value}>
                <SelectItemIndicator />
                <SelectItemText>{language.label}</SelectItemText>
              </SelectItem>
            ))}
          </SelectList>
        </SelectPopup>
      </SelectPositioner>
    </SelectPortal>
  );
}

const field = { display: 'grid', justifyItems: 'start' } as const;

/**
 * SelectLabel inside Select, so Base UI ties it to the trigger. `items` lets
 * the trigger show the chosen label rather than the raw value.
 */
export const WithLabel: Story = {
  render: () => (
    <Select items={languages} defaultValue="en">
      <div style={field}>
        <SelectLabel>Language</SelectLabel>
        <SelectTrigger>
          <SelectValue />
          <SelectIcon />
        </SelectTrigger>
      </div>
      <Options />
    </Select>
  ),
};

/** No value yet: the trigger shows the placeholder in the muted text color. */
export const Placeholder: Story = {
  render: () => (
    <Select items={languages}>
      <div style={field}>
        <SelectLabel>Language</SelectLabel>
        <SelectTrigger>
          <SelectValue placeholder="Choose a language" />
          <SelectIcon />
        </SelectTrigger>
      </div>
      <Options />
    </Select>
  ),
};

/**
 * Open on load, to show the popup, the chosen item's tick and the
 * highlighted item. SelectPortal renders into the NostalgiaRoot the story
 * sits in, which is why the popup keeps the era and palette.
 */
export const Open: Story = {
  render: () => (
    <Select items={languages} defaultValue="fr" defaultOpen>
      <div style={field}>
        <SelectLabel>Language</SelectLabel>
        <SelectTrigger>
          <SelectValue />
          <SelectIcon />
        </SelectTrigger>
      </div>
      <Options />
    </Select>
  ),
};

/** A disabled Select ignores clicks and keys. */
export const Disabled: Story = {
  render: () => (
    <Select items={languages} defaultValue="en" disabled>
      <div style={field}>
        <SelectLabel>Language</SelectLabel>
        <SelectTrigger>
          <SelectValue />
          <SelectIcon />
        </SelectTrigger>
      </div>
      <Options />
    </Select>
  ),
};

/**
 * Don't: put the label text beside the trigger as plain text. The trigger
 * has no name, so a screen reader announces only its value. Compare
 * WithLabel.
 */
export const DontTextBesideTrigger: Story = {
  render: () => (
    <Select items={languages} defaultValue="en">
      <div style={field}>
        <span>Language</span>
        <SelectTrigger>
          <SelectValue />
          <SelectIcon />
        </SelectTrigger>
      </div>
      <Options />
    </Select>
  ),
};
