# Release notes

With **react-popper**, used under the hood of **react-popper-tooltip**, introducing the `usePopper` hook in the last
major update, we're now releasing the hook version of our own library as well - `usePopperTooltip`. The hook provides many new features and flexibility
and allows for implementations not possible before.

## Breaking changes

This release onwards, the hook is the only way of creating tooltips. This version drops the support of
the `TooltipTrigger` render prop component. If you want to upgrade and still keep using render prop API,
refer to our example section to implement the legacy API with our new hook.

We wrote this version from scratch. Although thoroughly tested, it can still possibly contain some regressions. Please,
report any problems using the [issues link](https://github.com/mohsinulhaq/react-popper-tooltip/issues).

## Changes

For the sake of consistency, we made some changes to the props names.

- `defaultTooltipShown` is renamed to `defaultVisible`
- `tooltipShown` is renamed to `visible`
- `onVisibilityChange` is renamed to `onVisibleChange`
- `closeOnReferenceHidden` is renamed to `closeOnTriggerHidden` and the default value changed from `true` to `false`

The string value `"none"` for the prop `trigger` is replaced with `null`.

Previously, when a user hovered the tooltip, it stayed open to allow the user to interact with the tooltip's content.
Now the tooltip closes as soon as the cursor leaves the trigger element. The new option `interactive` has been added to
configure this behavior.

`getTriggerProps` and `arrowRef` are no longer needed.
