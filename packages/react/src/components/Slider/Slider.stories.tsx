import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderLabel,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from './Slider.js';

const meta = {
  title: 'Components/Slider',
  component: Slider,
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * SliderLabel and SliderValue inside Slider: the label names the thumb, and
 * the value shows the number the position stands for.
 */
export const WithLabel: Story = {
  render: () => (
    <Slider defaultValue={60}>
      <SliderLabel>Volume</SliderLabel>
      <SliderValue />
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
          <SliderThumb />
        </SliderTrack>
      </SliderControl>
    </Slider>
  ),
};

/** Two thumbs for a range; the indicator fills between them. */
export const Range: Story = {
  render: () => (
    <Slider defaultValue={[20, 70]}>
      <SliderLabel>Price range</SliderLabel>
      <SliderValue />
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
          <SliderThumb index={0} getAriaLabel={() => 'Minimum price'} />
          <SliderThumb index={1} getAriaLabel={() => 'Maximum price'} />
        </SliderTrack>
      </SliderControl>
    </Slider>
  ),
};

/** A disabled Slider ignores the pointer and the keys. */
export const Disabled: Story = {
  render: () => (
    <Slider defaultValue={40} disabled>
      <SliderLabel>Volume</SliderLabel>
      <SliderValue />
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
          <SliderThumb />
        </SliderTrack>
      </SliderControl>
    </Slider>
  ),
};

/**
 * Don't: leave out SliderLabel. The thumb's input has no name, so a screen
 * reader announces only a number, with nothing to say what it sets.
 * Compare WithLabel.
 */
export const DontUnlabeled: Story = {
  render: () => (
    <Slider defaultValue={60}>
      <SliderValue />
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
          <SliderThumb />
        </SliderTrack>
      </SliderControl>
    </Slider>
  ),
};
