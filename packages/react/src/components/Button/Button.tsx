import { useRender } from '@base-ui/react/use-render';
import { mergeProps } from '@base-ui/react/merge-props';
import { clsx } from 'clsx';
import type * as React from 'react';

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'danger';

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  /**
   * Visual weight. Every variant is styled only through era and palette tokens.
   *
   * @default 'solid'
   */
  readonly variant?: ButtonVariant;
  /** Replaces the rendered element, matching Base UI's composition contract. */
  readonly render?: useRender.RenderProp;
}

/**
 * Base UI has no Button primitive, because a button needs no behaviour a
 * native button lacks. It does provide useRender, which is the hook behind the
 * `render` prop on every Base UI component, so using it here keeps one
 * composition contract across the library rather than two.
 */
export function Button(props: ButtonProps): React.ReactElement | null {
  const { variant = 'solid', render, className, ...rest } = props;

  return useRender({
    render,
    defaultTagName: 'button',
    props: mergeProps<'button'>(
      {
        className: clsx('nui-Button', 'nui-Button--' + variant, className),
        type: 'button',
      },
      rest,
    ),
  });
}
