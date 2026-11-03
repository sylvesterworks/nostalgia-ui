import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import type * as React from 'react';

/**
 * Thin styling wrappers over Base UI's Checkbox parts. Base UI renders the
 * box as a `span` with `role="checkbox"` beside a hidden `input`, handles
 * Space to toggle and the mixed state, and sets `data-checked`,
 * `data-unchecked` and `data-indeterminate` on both parts. This file only
 * attaches class names; every era draws the box and the mark from those
 * attributes.
 *
 * Neither part has a label. Wrap the checkbox in a `<label>` with its text so
 * that it has an accessible name and the text is clickable.
 */
export function Checkbox(
  props: React.ComponentProps<typeof BaseCheckbox.Root>,
): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseCheckbox.Root
      {...rest}
      className={typeof className === 'string' ? 'nui-Checkbox ' + className : 'nui-Checkbox'}
    />
  );
}

/**
 * The mark inside the box: a check when ticked and a dash when mixed, both
 * drawn by the stylesheet in the text color paired with the checked fill.
 * Base UI only mounts it while the box is ticked or mixed, unless
 * `keepMounted` is set.
 */
export function CheckboxIndicator(
  props: React.ComponentProps<typeof BaseCheckbox.Indicator>,
): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseCheckbox.Indicator
      {...rest}
      className={
        typeof className === 'string'
          ? 'nui-CheckboxIndicator ' + className
          : 'nui-CheckboxIndicator'
      }
    />
  );
}
