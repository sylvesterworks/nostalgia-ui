import { Select as BaseSelect } from '@base-ui/react/select';
import type * as React from 'react';

import { useNostalgiaContainer } from '../NostalgiaRoot/index.js';

/**
 * Styling wrappers over Base UI's Select parts. Opening, typeahead, arrow-key
 * movement, selection and form submission all come from Base UI, which sets
 * `data-popup-open` and `data-placeholder` on the trigger and
 * `data-highlighted`, `data-selected` and `data-disabled` on each item.
 *
 * Root renders no element of its own, so it is re-exported unchanged. Group,
 * GroupLabel, Separator, Backdrop, Arrow and the scroll arrows are not
 * wrapped yet.
 */
export const Select = BaseSelect.Root;

/** The visible label, which Base UI ties to the trigger. Put it inside Select. */
export function SelectLabel(
  props: React.ComponentProps<typeof BaseSelect.Label>,
): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseSelect.Label
      {...rest}
      className={typeof className === 'string' ? 'nui-SelectLabel ' + className : 'nui-SelectLabel'}
    />
  );
}

/** The field that shows the chosen value and opens the list. */
export function SelectTrigger(
  props: React.ComponentProps<typeof BaseSelect.Trigger>,
): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseSelect.Trigger
      {...rest}
      className={
        typeof className === 'string' ? 'nui-SelectTrigger ' + className : 'nui-SelectTrigger'
      }
    />
  );
}

/** The chosen value's text inside the trigger, or the placeholder. */
export function SelectValue(
  props: React.ComponentProps<typeof BaseSelect.Value>,
): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseSelect.Value
      {...rest}
      className={typeof className === 'string' ? 'nui-SelectValue ' + className : 'nui-SelectValue'}
    />
  );
}

/**
 * The arrow at the end of the trigger. The stylesheet draws it, so it needs
 * no children; pass an icon of your own to replace the drawn one. Base UI
 * would fill an empty icon with a `▼` glyph, so the wrapper passes no
 * children instead and the drawn arrow is the only one.
 */
export function SelectIcon(
  props: React.ComponentProps<typeof BaseSelect.Icon>,
): React.ReactElement {
  const { className, children = null, ...rest } = props;
  return (
    <BaseSelect.Icon
      {...rest}
      className={typeof className === 'string' ? 'nui-SelectIcon ' + className : 'nui-SelectIcon'}
    >
      {children}
    </BaseSelect.Icon>
  );
}

/**
 * Portals into the nearest NostalgiaRoot rather than into document.body, as
 * DialogPortal does (decision 0003). Base UI's default sends the list to the
 * body, where the token variables and the [data-era] selectors do not reach
 * it, and it renders unstyled. An explicit `container` prop still wins.
 */
export function SelectPortal(
  props: React.ComponentProps<typeof BaseSelect.Portal>,
): React.ReactElement {
  const container = useNostalgiaContainer();
  const { container: explicit, ...rest } = props;
  const resolved = explicit ?? container;
  return resolved === null || resolved === undefined ? (
    <BaseSelect.Portal {...rest} />
  ) : (
    <BaseSelect.Portal {...rest} container={resolved} />
  );
}

/** Places the popup against the trigger. */
export function SelectPositioner(
  props: React.ComponentProps<typeof BaseSelect.Positioner>,
): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseSelect.Positioner
      {...rest}
      className={
        typeof className === 'string' ? 'nui-SelectPositioner ' + className : 'nui-SelectPositioner'
      }
    />
  );
}

/** The panel that holds the list. */
export function SelectPopup(
  props: React.ComponentProps<typeof BaseSelect.Popup>,
): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseSelect.Popup
      {...rest}
      className={typeof className === 'string' ? 'nui-SelectPopup ' + className : 'nui-SelectPopup'}
    />
  );
}

/** The scrolling list of items inside the popup. */
export function SelectList(
  props: React.ComponentProps<typeof BaseSelect.List>,
): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseSelect.List
      {...rest}
      className={typeof className === 'string' ? 'nui-SelectList ' + className : 'nui-SelectList'}
    />
  );
}

/** One option. Its `value` is what the Select holds when it is chosen. */
export function SelectItem(
  props: React.ComponentProps<typeof BaseSelect.Item>,
): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseSelect.Item
      {...rest}
      className={typeof className === 'string' ? 'nui-SelectItem ' + className : 'nui-SelectItem'}
    />
  );
}

/** The option's text, which the trigger shows once it is chosen. */
export function SelectItemText(
  props: React.ComponentProps<typeof BaseSelect.ItemText>,
): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseSelect.ItemText
      {...rest}
      className={
        typeof className === 'string' ? 'nui-SelectItemText ' + className : 'nui-SelectItemText'
      }
    />
  );
}

/**
 * The tick beside the chosen option, drawn by the stylesheet. Base UI only
 * mounts it on the selected item, unless `keepMounted` is set. Base UI would
 * fill an empty indicator with a `✔️` emoji, which some platforms draw in
 * fixed emoji colors whatever the palette, so the wrapper passes no children
 * instead.
 */
export function SelectItemIndicator(
  props: React.ComponentProps<typeof BaseSelect.ItemIndicator>,
): React.ReactElement {
  const { className, children = null, ...rest } = props;
  return (
    <BaseSelect.ItemIndicator
      {...rest}
      className={
        typeof className === 'string'
          ? 'nui-SelectItemIndicator ' + className
          : 'nui-SelectItemIndicator'
      }
    >
      {children}
    </BaseSelect.ItemIndicator>
  );
}
