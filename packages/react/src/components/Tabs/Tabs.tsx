import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import type * as React from 'react';

/**
 * Thin styling wrappers over Base UI's Tabs parts. All keyboard behaviour,
 * arrow-key focus and panel association come from Base UI; this file only
 * attaches class names.
 *
 * The parts are re-exported individually rather than collapsed into one
 * convenience component, so consumers keep the composition Base UI provides.
 */
export function Tabs(props: React.ComponentProps<typeof BaseTabs.Root>): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseTabs.Root
      {...rest}
      className={typeof className === 'string' ? 'nui-Tabs ' + className : 'nui-Tabs'}
    />
  );
}

export function TabList(props: React.ComponentProps<typeof BaseTabs.List>): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseTabs.List
      {...rest}
      className={typeof className === 'string' ? 'nui-TabList ' + className : 'nui-TabList'}
    />
  );
}

export function Tab(props: React.ComponentProps<typeof BaseTabs.Tab>): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseTabs.Tab
      {...rest}
      className={typeof className === 'string' ? 'nui-Tab ' + className : 'nui-Tab'}
    />
  );
}

/**
 * Base UI's Indicator exposes the active tab's geometry as CSS variables
 * (--active-tab-left, --active-tab-width and so on), which lets an era decide
 * whether to animate it. Classic Windows has no transition, so it jumps.
 */
export function TabIndicator(
  props: React.ComponentProps<typeof BaseTabs.Indicator>,
): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseTabs.Indicator
      {...rest}
      className={
        typeof className === 'string' ? 'nui-TabIndicator ' + className : 'nui-TabIndicator'
      }
    />
  );
}

export function TabPanel(props: React.ComponentProps<typeof BaseTabs.Panel>): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <BaseTabs.Panel
      {...rest}
      className={typeof className === 'string' ? 'nui-TabPanel ' + className : 'nui-TabPanel'}
    />
  );
}
