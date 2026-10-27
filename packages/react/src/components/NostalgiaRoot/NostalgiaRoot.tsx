import { clsx } from 'clsx';
import { createContext, useContext, useState } from 'react';
import type * as React from 'react';

/**
 * The element that carries data-era and data-palette, shared so that portalled
 * parts can be rendered back inside it.
 *
 * Base UI portals Dialog (and Popover, Menu, Tooltip) into document.body by
 * default. Because the tokens are scoped to attribute selectors on a wrapper,
 * anything portalled to the body escapes them entirely: the dialog rendered
 * with no surface, no border and no title bar, because neither the CSS
 * variables nor the [data-era] selectors reached it.
 *
 * Putting the attributes on <html> would also fix it, but would make the whole
 * document a single era and rule out showing two side by side, which the
 * milestone 4 timeline demo needs. Portalling into the themed element keeps
 * theming scoped.
 */
const ContainerContext = createContext<HTMLElement | null>(null);

export function useNostalgiaContainer(): HTMLElement | null {
  return useContext(ContainerContext);
}

export interface NostalgiaRootProps extends React.ComponentPropsWithoutRef<'div'> {
  /** Shape and feel. */
  readonly era: string;
  /** Color. */
  readonly palette: string;
}

/**
 * Wraps a region in one era and one palette.
 *
 * Switching either prop changes a single attribute. No component re-renders
 * differently and no markup changes: the entire visual difference is CSS
 * resolving a different set of custom properties.
 */
export function NostalgiaRoot(props: NostalgiaRootProps): React.ReactElement {
  const { era, palette, className, children, ...rest } = props;
  const [container, setContainer] = useState<HTMLElement | null>(null);

  return (
    <div
      {...rest}
      ref={setContainer}
      data-era={era}
      data-palette={palette}
      className={clsx('nui-root', className)}
    >
      <ContainerContext.Provider value={container}>{children}</ContainerContext.Provider>
    </div>
  );
}
