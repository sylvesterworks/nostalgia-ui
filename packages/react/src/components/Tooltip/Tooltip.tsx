import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import type * as React from 'react';

import { useNostalgiaContainer } from '../NostalgiaRoot/index.js';

/**
 * Styling wrappers over Base UI's Tooltip parts. Opening on hover and on
 * keyboard focus, the delays and closing on Escape all come from Base UI,
 * which sets `data-side` and `data-open` on the popup and the arrow.
 *
 * Provider and Root render no element of their own, so they are re-exported
 * unchanged. Viewport and handles are not wrapped yet.
 */
export const TooltipProvider = BaseTooltip.Provider;

export const Tooltip = BaseTooltip.Root;

/**
 * The element the tooltip describes. It renders a plain `button` carrying
 * only its own class; pass `render={<Button variant="..." />}` for an
 * era-styled button.
 */
export function TooltipTrigger(
  props: React.ComponentProps<typeof BaseTooltip.Trigger>,
): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseTooltip.Trigger
      {...rest}
      className={
        typeof className === 'string' ? 'nui-TooltipTrigger ' + className : 'nui-TooltipTrigger'
      }
    />
  );
}

/**
 * Portals into the nearest NostalgiaRoot rather than into document.body, as
 * DialogPortal does (decision 0003). Base UI's default sends the tooltip to
 * the body, where the token variables and the [data-era] selectors do not
 * reach it, and it renders unstyled. An explicit `container` prop still wins.
 */
export function TooltipPortal(
  props: React.ComponentProps<typeof BaseTooltip.Portal>,
): React.ReactElement {
  const container = useNostalgiaContainer();
  const { container: explicit, ...rest } = props;
  const resolved = explicit ?? container;
  return resolved === null || resolved === undefined ? (
    <BaseTooltip.Portal {...rest} />
  ) : (
    <BaseTooltip.Portal {...rest} container={resolved} />
  );
}

/** Places the popup against the trigger. */
export function TooltipPositioner(
  props: React.ComponentProps<typeof BaseTooltip.Positioner>,
): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseTooltip.Positioner
      {...rest}
      className={
        typeof className === 'string'
          ? 'nui-TooltipPositioner ' + className
          : 'nui-TooltipPositioner'
      }
    />
  );
}

/** The box that holds the tooltip's text. */
export function TooltipPopup(
  props: React.ComponentProps<typeof BaseTooltip.Popup>,
): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseTooltip.Popup
      {...rest}
      className={
        typeof className === 'string' ? 'nui-TooltipPopup ' + className : 'nui-TooltipPopup'
      }
    />
  );
}

/**
 * The small pointer from the popup toward the trigger. Put it inside
 * TooltipPopup; the stylesheet draws it to match each era's popup.
 */
export function TooltipArrow(
  props: React.ComponentProps<typeof BaseTooltip.Arrow>,
): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseTooltip.Arrow
      {...rest}
      className={
        typeof className === 'string' ? 'nui-TooltipArrow ' + className : 'nui-TooltipArrow'
      }
    />
  );
}
