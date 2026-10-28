import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../Button/index.js';

import { Card, CardBody, CardTitle } from './Card.js';

const meta = {
  title: 'Components/Card',
  component: Card,
  args: { elevated: false },
  argTypes: { elevated: { control: 'boolean' } },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Sits level with the surface it is on. */
export const Flat: Story = {
  args: { children: <CardBody>A flat card sits level with the surface it is on.</CardBody> },
};

/** Elevation is an era decision. Flat / Metro forbids shadows, so it uses fill instead. */
export const Elevated: Story = {
  args: {
    elevated: true,
    children: <CardBody>An elevated card sits above the surface.</CardBody>,
  },
};

/** `render` swaps the element, here for a section, and keeps the styling. */
export const RenderedAsSection: Story = {
  args: {
    elevated: true,
    render: <section aria-label="Storage" />,
    children: <CardBody>This card is a section element.</CardBody>,
  },
};

/** CardTitle and CardBody are siblings the caller places, in that order. */
export const WithTitleAndBody: Story = {
  args: {
    elevated: true,
    children: (
      <>
        <CardTitle>Account</CardTitle>
        <CardBody>Card has no header slot. The title and body are placed by the caller.</CardBody>
      </>
    ),
  },
};

/**
 * A row of actions after CardBody, with its own top margin. Card pads only its
 * edges, so the gap has to come from the row.
 */
export const WithActions: Story = {
  args: {
    elevated: true,
    children: (
      <>
        <CardTitle>Delete project</CardTitle>
        <CardBody>This removes the project and its history.</CardBody>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <Button variant="ghost">Cancel</Button>
          <Button variant="danger">Delete</Button>
        </div>
      </>
    ),
  },
};

/** Don't: place a row straight after CardBody. It touches the text above it. Compare WithActions. */
export const DontActionsWithoutSpacing: Story = {
  args: {
    elevated: true,
    children: (
      <>
        <CardTitle>Delete project</CardTitle>
        <CardBody>This removes the project and its history.</CardBody>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="ghost">Cancel</Button>
          <Button variant="danger">Delete</Button>
        </div>
      </>
    ),
  },
};
