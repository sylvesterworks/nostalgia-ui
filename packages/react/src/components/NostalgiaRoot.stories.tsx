import { ERA_IDS, PALETTE_IDS } from '@nostalgiaui/tokens';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './Button.js';
import { Card, CardBody, CardTitle } from './Card.js';
import { NostalgiaRoot } from './NostalgiaRoot.js';

const meta = {
  title: 'Foundations/NostalgiaRoot',
  component: NostalgiaRoot,
  args: { era: 'classic-windows', palette: 'solarized-light' },
  argTypes: {
    era: { control: 'select', options: [...ERA_IDS] },
    palette: { control: 'select', options: [...PALETTE_IDS] },
  },
} satisfies Meta<typeof NostalgiaRoot>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A NostalgiaRoot inside another. The outer one comes from the toolbar; the
 * inner one from this story's controls. Each region resolves its own
 * variables, which is what lets two eras sit side by side on one page.
 */
export const Nesting: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <Card elevated>
        <CardTitle>Outer root</CardTitle>
        <CardBody>Era and palette from the toolbar.</CardBody>
      </Card>
      <NostalgiaRoot {...args} style={{ padding: '1rem' }}>
        <Card elevated>
          <CardTitle>Inner root</CardTitle>
          <CardBody>
            Era and palette from this story&apos;s controls.{' '}
            <Button variant="solid">A button</Button>
          </CardBody>
        </Card>
      </NostalgiaRoot>
    </div>
  ),
};
