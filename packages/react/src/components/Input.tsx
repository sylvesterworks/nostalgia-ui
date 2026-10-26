import { Input as BaseInput } from '@base-ui/react/input';
import { clsx } from 'clsx';
import type * as React from 'react';

export interface InputProps extends React.ComponentProps<typeof BaseInput> {
  /** Marks the field as invalid, which eras express differently: a red inset
   * border in Classic Windows, a glow in Frutiger Aero, a solid bar in Flat. */
  readonly invalid?: boolean;
}

export function Input(props: InputProps): React.ReactElement {
  const { invalid = false, className, ...rest } = props;
  // Base UI also accepts className as a function of state; only a string can
  // be merged here, so a function is left as-is and the static classes win.
  const classes = clsx('nui-Input', invalid && 'nui-Input--invalid');

  return (
    <BaseInput
      {...rest}
      data-invalid={invalid ? '' : undefined}
      className={typeof className === 'string' ? clsx(classes, className) : classes}
    />
  );
}
