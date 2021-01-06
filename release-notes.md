# Release notes

After **react-popper**, used under the hood of **react-popper-tooltip**, introduced the `usePopper` hook in the last
major update, we're also releasing the hook version of our library - `usePopperTooltip`. The hook provides new features
and allows implementing scenarios not possible before.

## Breaking changes

Since this release, the hook is the only tool for creating tooltip components. This version drops support of
the `TooltipTrigger` component utilizing render prop pattern. If you want to upgrade and keep using render prop API,
reference our example section to implement legacy API with the hook.

We wrote this version from scratch. Although thoroughly tested, it can still possibly contain some regressions. Please,
report any problems using the [issues link](https://github.com/mohsinulhaq/react-popper-tooltip/issues).

## Changes

For the sake of consistency, we made some changes to the props names.

- `defaultTooltipShown` was renamed to `defaultVisible`
- `tooltipShown` was renamed to `visible`
- `onVisibilityChange` was renamed to `onVisibleChange`
- `closeOnReferenceHidden` was renamed to `closeOnTriggerHidden` and the default value changed from `true` to `false`

A string value `"none"` of the prop `trigger` replace with `null`.

Previously, when the user hovered the tooltip, it stayed open to allow the user to interact with the tooltip's content.
Now the tooltip closes as soon as the cursor leaves the trigger element. The new option `interactive` was added to
configure this behavior.
