import { Switch as BaseSwitch } from '@base-ui/react/switch';
import type * as React from 'react';

/**
 * Thin styling wrappers over Base UI's Switch parts. Base UI renders the
 * track as a `span` beside a hidden `input`, handles Space to toggle, and sets
 * `data-checked` and `data-unchecked` on both parts. This file only attaches
 * class names; every era draws the track and the thumb from those attributes.
 *
 * Neither part has a label. Wrap the switch in a `<label>` with its text so
 * that it has an accessible name and the text is clickable.
 */
export function Switch(props: React.ComponentProps<typeof BaseSwitch.Root>): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseSwitch.Root
      {...rest}
      className={typeof className === 'string' ? 'nui-Switch ' + className : 'nui-Switch'}
    />
  );
}

/**
 * The thumb that slides across the track: at the start when off, at the end
 * when on.
 */
export function SwitchThumb(
  props: React.ComponentProps<typeof BaseSwitch.Thumb>,
): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseSwitch.Thumb
      {...rest}
      className={typeof className === 'string' ? 'nui-SwitchThumb ' + className : 'nui-SwitchThumb'}
    />
  );
}
