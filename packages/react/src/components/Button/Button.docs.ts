import type { ComponentDoc } from '../../docs/schema.js';

import type { ButtonProps } from './Button.js';

export const buttonDoc = {
  name: 'Button',
  summary:
    'A native `button` styled by the era and palette, in four variants. Reach for it for any action on the page; for navigation, render it as a link.',
  anatomy: [
    {
      name: 'Button',
      className: 'nui-Button',
      description: 'The button itself, plus a `nui-Button--<variant>` modifier class.',
    },
  ],
  props: {
    variant: {
      description:
        "Visual weight: `solid`, `outline`, `ghost` or `danger`. `danger` reads the palette's danger color and its matching text color.",
      whenToUse:
        'One `solid` button per group for the primary action, `outline` or `ghost` for the rest, and `danger` only for destructive actions.',
    },
    type: {
      description:
        'Defaults to `"button"`, not the browser default of `"submit"`, so a Button in a form never submits by accident.',
      whenToUse: 'Pass `type="submit"` for the button that submits a form.',
    },
    disabled: {
      description:
        'Each era draws its own disabled state; the native attribute is what makes it unfocusable.',
    },
    render: {
      description:
        "Replaces the rendered element while keeping the styling, following Base UI's composition contract.",
      whenToUse: 'Use `render={<a href="..." />}` for a link that should look like a button.',
    },
  },
  patterns: [
    {
      title: 'Primary action',
      description: 'The solid variant carries the accent fill.',
      story: 'Solid',
    },
    {
      title: 'Secondary actions',
      description: 'Outline and ghost sit beside a solid button without competing with it.',
      story: 'Outline',
    },
    {
      title: 'Destructive action',
      description: 'The danger variant, for actions that delete or discard.',
      story: 'Danger',
    },
    {
      title: 'Link styled as a button',
      description: '`render` swaps the element for an anchor and keeps the styling.',
      story: 'AsLink',
    },
  ],
  variants: ['Ghost', 'Disabled'],
  doAndDont: [
    {
      do: {
        story: 'AsLink',
        description: 'Render navigation as a link through `render`.',
      },
      dont: {
        story: 'DontButtonForNavigation',
        description: 'Navigate from a click handler on a button.',
      },
      why: 'A link is announced as a link, can be opened in a new tab and shows its destination; a button that navigates does none of that.',
    },
  ],
  accessibility: [
    'Keyboard behavior is the native `button`: Tab to focus, Enter or Space to activate.',
    'The focus ring comes from the era: an outline in most eras, and a dotted rectangle drawn inside the button in Classic Windows.',
    'Text on the solid and danger variants uses the palette text color paired with that fill, which the semantic layer corrects to WCAG AA.',
  ],
  extensibility: {
    render:
      'Accepts any element through `render`, for example an anchor or a router link component.',
    className: 'Added to `nui-Button` and the variant class, never instead of them.',
    cssVariables: [
      {
        name: '--nui-color-accent',
        description:
          'The solid fill. Override it together with `--nui-color-text-on-accent` to keep the label readable.',
      },
      {
        name: '--nui-radius-md',
        description: 'The corner radius in eras that round their buttons.',
      },
    ],
    extendVsOverride:
      'Wrap Button to add behavior such as a loading state, and pass styling through `className`. To change how a variant looks in every era, change the stylesheet rather than overriding per instance.',
  },
  eraNotes: {
    'classic-windows':
      'A two-tone bevel that inverts on press, and a dotted focus rectangle inside the button.',
    'frutiger-aero': 'A gloss band across the top half, drawn with pseudo-elements.',
    'flat-metro': 'No shadow and no gradient; hover and press shift the fill instead.',
  },
  notes: [
    'Variants are solid, outline, ghost and danger; that is the whole set for Button.',
    'To put an era-styled Button into a Base UI slot such as DialogTrigger, DialogClose or Tab, pass `render={<Button variant="..." />}` to the slot.',
  ],
} as const satisfies ComponentDoc<ButtonProps>;
