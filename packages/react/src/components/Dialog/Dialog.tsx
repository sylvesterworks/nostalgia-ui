import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type * as React from 'react';

import { useNostalgiaContainer } from '../NostalgiaRoot/index.js';

/**
 * Styling wrappers over Base UI's Dialog parts. Focus trapping, scroll lock
 * and dismissal all come from Base UI.
 *
 * Only the parts needed by the five-component set are wrapped. Root, Portal
 * and Close are re-exported unchanged, since Root and Portal render no element
 * of their own and so have nothing to style.
 */
export const Dialog = BaseDialog.Root;

/**
 * Portals into the nearest NostalgiaRoot rather than into document.body.
 *
 * Base UI's default sends the popup to the body, where the token variables and
 * the [data-era] selectors do not reach it, and the dialog renders unstyled.
 * An explicit `container` prop still wins, so this only supplies a default.
 */
export function DialogPortal(
  props: React.ComponentProps<typeof BaseDialog.Portal>,
): React.ReactElement {
  const container = useNostalgiaContainer();
  const { container: explicit, ...rest } = props;
  const resolved = explicit ?? container;
  return resolved === null || resolved === undefined ? (
    <BaseDialog.Portal {...rest} />
  ) : (
    <BaseDialog.Portal {...rest} container={resolved} />
  );
}

export function DialogTrigger(
  props: React.ComponentProps<typeof BaseDialog.Trigger>,
): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseDialog.Trigger
      {...rest}
      className={
        typeof className === 'string' ? 'nui-DialogTrigger ' + className : 'nui-DialogTrigger'
      }
    />
  );
}

export function DialogBackdrop(
  props: React.ComponentProps<typeof BaseDialog.Backdrop>,
): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseDialog.Backdrop
      {...rest}
      className={
        typeof className === 'string' ? 'nui-DialogBackdrop ' + className : 'nui-DialogBackdrop'
      }
    />
  );
}

export function DialogPopup(
  props: React.ComponentProps<typeof BaseDialog.Popup>,
): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseDialog.Popup
      {...rest}
      className={typeof className === 'string' ? 'nui-DialogPopup ' + className : 'nui-DialogPopup'}
    />
  );
}

export function DialogTitle(
  props: React.ComponentProps<typeof BaseDialog.Title>,
): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseDialog.Title
      {...rest}
      className={typeof className === 'string' ? 'nui-DialogTitle ' + className : 'nui-DialogTitle'}
    />
  );
}

export function DialogDescription(
  props: React.ComponentProps<typeof BaseDialog.Description>,
): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseDialog.Description
      {...rest}
      className={
        typeof className === 'string'
          ? 'nui-DialogDescription ' + className
          : 'nui-DialogDescription'
      }
    />
  );
}

export function DialogClose(
  props: React.ComponentProps<typeof BaseDialog.Close>,
): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseDialog.Close
      {...rest}
      className={typeof className === 'string' ? 'nui-DialogClose ' + className : 'nui-DialogClose'}
    />
  );
}
