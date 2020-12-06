# Migrating from 3.x to 4.x

After react-popper, which is used under the hood of react-popper-tooltip, introduced the `usePopper` hook in the last
major update, we're also releasing the hook version of the library - `usePopperTooltip`.

It's going to be the primary tool for creating tooltip components. This version still supports the `TooltipTrigger`
component utilizing render prop with some breaking changes (see below). This is a legacy API for compatibility with 3.x
users moving to 4.x, and it doesn't support all the features that the hook does. We recommend you to switch your code to
the hook.

## BREAKING CHANGES

- `closeOnReferenceHidden` has been removed.

Instead, additional attributes `data-popper-reference-hidden` and `data-popper-escaped` were added to the tooltip
container. They set to true if the trigger element, or the tooltip element gets out of boundaries. You can use them in
your CSS to hide the tooltip, or the trigger when necessary.

More information and usage examples [here](https://popper.js.org/docs/v2/modifiers/hide/).

- `followCursor` has been removed.

If you still need the removed functionality, check out our examples section on how you can implement it on your own
using the hook.

## Changes

Some properties were renamed. You can still use the old names, but you'll get a warning message. These props will be
removed in the next major version.

- `defaultTooltipShown` was renamed to `initialVisible`
- `tooltipShown` was renamed to `visible`
- `onVisibilityChange` was renamed to `onVisibleChange`

If you imported `TooltipTrigger` component as a default import, use named import insted. Default import still works but
will be removed in the next major version.

```diff
-import TooltipTrigger from 'react-popper-tooltip';
+import { TooltipTrigger } from 'react-popper-tooltip';
```

Previously, when the user hovered the tooltip, it stayed open to allow the user to interact with the tooltip's content.
Now the tooltip closes as soon as the cursor leaves the trigger element. The new option `interactive` was added to
configure this behavior.

