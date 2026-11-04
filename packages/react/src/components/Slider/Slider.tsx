import { Slider as BaseSlider } from '@base-ui/react/slider';
import type * as React from 'react';

/**
 * Styling wrappers over Base UI's Slider parts. Dragging, the keys, stepping
 * and form submission all come from Base UI. Each thumb holds a real `<input type="range">` that takes focus.
 * Base UI sets `data-dragging`, `data-disabled` and `data-orientation` on the
 * parts.
 *
 * Only the horizontal orientation is styled.
 */
export function Slider(props: React.ComponentProps<typeof BaseSlider.Root>): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseSlider.Root
      {...rest}
      className={typeof className === 'string' ? 'nui-Slider ' + className : 'nui-Slider'}
    />
  );
}

/** The visible label, which Base UI ties to the thumbs. Put it inside Slider. */
export function SliderLabel(
  props: React.ComponentProps<typeof BaseSlider.Label>,
): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseSlider.Label
      {...rest}
      className={typeof className === 'string' ? 'nui-SliderLabel ' + className : 'nui-SliderLabel'}
    />
  );
}

/** The current value as text, rendered as an `<output>`. */
export function SliderValue(
  props: React.ComponentProps<typeof BaseSlider.Value>,
): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseSlider.Value
      {...rest}
      className={typeof className === 'string' ? 'nui-SliderValue ' + className : 'nui-SliderValue'}
    />
  );
}

/** The area that takes pointer input; it holds the track. */
export function SliderControl(
  props: React.ComponentProps<typeof BaseSlider.Control>,
): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseSlider.Control
      {...rest}
      className={
        typeof className === 'string' ? 'nui-SliderControl ' + className : 'nui-SliderControl'
      }
    />
  );
}

/** The groove that stands for the whole range. */
export function SliderTrack(
  props: React.ComponentProps<typeof BaseSlider.Track>,
): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseSlider.Track
      {...rest}
      className={typeof className === 'string' ? 'nui-SliderTrack ' + className : 'nui-SliderTrack'}
    />
  );
}

/** The filled part of the track, from the start (or between thumbs) to the value. */
export function SliderIndicator(
  props: React.ComponentProps<typeof BaseSlider.Indicator>,
): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseSlider.Indicator
      {...rest}
      className={
        typeof className === 'string' ? 'nui-SliderIndicator ' + className : 'nui-SliderIndicator'
      }
    />
  );
}

/**
 * The handle. It holds the focusable `<input type="range">`, so the focus
 * ring is drawn on the thumb while that input has keyboard focus. Put one
 * per value inside SliderTrack.
 */
export function SliderThumb(
  props: React.ComponentProps<typeof BaseSlider.Thumb>,
): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseSlider.Thumb
      {...rest}
      className={typeof className === 'string' ? 'nui-SliderThumb ' + className : 'nui-SliderThumb'}
    />
  );
}
