import type { Meta, StoryObj } from '@storybook/react-vite';

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
