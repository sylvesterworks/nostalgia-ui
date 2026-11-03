import { Menu as BaseMenu } from '@base-ui/react/menu';
import type * as React from 'react';

import { useNostalgiaContainer } from '../NostalgiaRoot/index.js';

/**
 * Styling wrappers over Base UI's Menu parts. Opening, arrow-key movement,
 * typeahead, activation and dismissal all come from Base UI, which sets
 * `data-popup-open` on the trigger and `data-highlighted` and
 * `data-disabled` on each item.
 *
 * Root renders no element of its own, so it is re-exported unchanged.
 * CheckboxItem, RadioItem, Group, GroupLabel, LinkItem, submenus, Arrow,
 * Backdrop and Viewport are not wrapped yet.
 */
export const Menu = BaseMenu.Root;

/**
 * The button that opens the menu. It renders a plain `button` carrying only
 * its own class; pass `render={<Button variant="..." />}` for an era-styled
 * button.
 */
export function MenuTrigger(
  props: React.ComponentProps<typeof BaseMenu.Trigger>,
): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseMenu.Trigger
      {...rest}
      className={typeof className === 'string' ? 'nui-MenuTrigger ' + className : 'nui-MenuTrigger'}
    />
  );
}

/**
 * Portals into the nearest NostalgiaRoot rather than into document.body, as
 * DialogPortal does (decision 0003). Base UI's default sends the menu to the
 * body, where the token variables and the [data-era] selectors do not reach
 * it, and it renders unstyled. An explicit `container` prop still wins.
 */
export function MenuPortal(
  props: React.ComponentProps<typeof BaseMenu.Portal>,
): React.ReactElement {
  const container = useNostalgiaContainer();
  const { container: explicit, ...rest } = props;
  const resolved = explicit ?? container;
  return resolved === null || resolved === undefined ? (
    <BaseMenu.Portal {...rest} />
  ) : (
    <BaseMenu.Portal {...rest} container={resolved} />
  );
}

/** Places the popup against the trigger. */
export function MenuPositioner(
  props: React.ComponentProps<typeof BaseMenu.Positioner>,
): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseMenu.Positioner
      {...rest}
      className={
        typeof className === 'string' ? 'nui-MenuPositioner ' + className : 'nui-MenuPositioner'
      }
    />
  );
}

/** The panel that holds the items. */
export function MenuPopup(props: React.ComponentProps<typeof BaseMenu.Popup>): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseMenu.Popup
      {...rest}
      className={typeof className === 'string' ? 'nui-MenuPopup ' + className : 'nui-MenuPopup'}
    />
  );
}

/** One action. Activating it calls `onClick` and closes the menu. */
export function MenuItem(props: React.ComponentProps<typeof BaseMenu.Item>): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseMenu.Item
      {...rest}
      className={typeof className === 'string' ? 'nui-MenuItem ' + className : 'nui-MenuItem'}
    />
  );
}

/** A rule between groups of items. */
export function MenuSeparator(
  props: React.ComponentProps<typeof BaseMenu.Separator>,
): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseMenu.Separator
      {...rest}
      className={
        typeof className === 'string' ? 'nui-MenuSeparator ' + className : 'nui-MenuSeparator'
      }
    />
  );
}
