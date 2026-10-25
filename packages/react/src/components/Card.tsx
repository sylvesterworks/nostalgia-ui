import { useRender } from '@base-ui/react/use-render';
import { mergeProps } from '@base-ui/react/merge-props';
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
        className: ['nui-Card', elevated ? 'nui-Card--elevated' : undefined, className]
          .filter(Boolean)
          .join(' '),
      },
      rest,
    ),
  });
}

export function CardTitle(props: React.ComponentPropsWithoutRef<'h3'>): React.ReactElement {
  const { className, ...rest } = props;
  return <h3 {...rest} className={['nui-CardTitle', className].filter(Boolean).join(' ')} />;
}

export function CardBody(props: React.ComponentPropsWithoutRef<'div'>): React.ReactElement {
  return <div {...props} className={['nui-CardBody', props.className].filter(Boolean).join(' ')} />;
}
