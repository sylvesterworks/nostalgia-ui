import { Input as BaseInput } from '@base-ui/react/input';
import type * as React from 'react';

export interface InputProps extends React.ComponentProps<typeof BaseInput> {
  /** Marks the field as invalid, which eras express differently: a red inset
   * border in Classic Windows, a glow in Frutiger Aero, a solid bar in Flat. */
  readonly invalid?: boolean;
}

export function Input(props: InputProps): React.ReactElement {
  const { invalid = false, className, ...rest } = props;
  const classes = ['nui-Input', invalid ? 'nui-Input--invalid' : undefined]
    .filter(Boolean)
    .join(' ');

  return (
    <BaseInput
      {...rest}
      data-invalid={invalid ? '' : undefined}
      className={typeof className === 'string' ? classes + ' ' + className : classes}
    />
  );
}
