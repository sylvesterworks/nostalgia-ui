import { useRender } from '@base-ui/react/use-render';
import { mergeProps } from '@base-ui/react/merge-props';
import { clsx } from 'clsx';
import type * as React from 'react';

export interface CardProps extends React.ComponentPropsWithoutRef<'div'> {
  /** A card that sits above the page surface rather than flush with it. */
  readonly elevated?: boolean;
  readonly render?: useRender.RenderProp;
}

/**
 * Also not a Base UI primitive: a card is presentation with no interaction
 * model. It still goes through useRender so that `render` behaves the same way
 * it does on Button and on every Base UI part.
 */
export function Card(props: CardProps): React.ReactElement | null {
  const { elevated = false, render, className, ...rest } = props;

  return useRender({
    render,
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className: clsx('nui-Card', elevated && 'nui-Card--elevated', className),
      },
      rest,
    ),
  });
}

export function CardTitle(props: React.ComponentPropsWithoutRef<'h3'>): React.ReactElement {
  const { className, ...rest } = props;
  return <h3 {...rest} className={clsx('nui-CardTitle', className)} />;
}

export function CardBody(props: React.ComponentPropsWithoutRef<'div'>): React.ReactElement {
  const { className, ...rest } = props;
  return <div {...rest} className={clsx('nui-CardBody', className)} />;
}
