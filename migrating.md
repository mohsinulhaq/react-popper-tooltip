# Migrating from `TooltipTrigger` to `usePopperTooltip`

Version 4.x introduced the `usePopperTooltip` hook and dropped the support of the `TooltipTrigger` component utilizing
render prop pattern.

This guide will provide you with the information to help you upgrade to 4.x hooks.

Here's an example of using the `TooltipTrigger` component using some common options.

```jsx
<TooltipTrigger
  trigger="click"
  delayShow={1000}
  tooltip={({ tooltipRef, getArrowProps, getTooltipProps }) => (
    <div
      {...getTooltipProps({
        ref: tooltipRef,
        className: 'tooltip-container',
      })}
    >
      <div
        {...getArrowProps({
          className: 'tooltip-arrow',
        })}
      />
      Tooltip element
    </div>
  )}
>
  {({ triggerRef }) => (
    <button ref={triggerRef} type="button">
      Trigger element
    </button>
  )}
</TooltipTrigger>
```

Here's the same component rewritten using the hook:

```js
const {
  getArrowProps,
  getTooltipProps,
  setTooltipRef,
  setTriggerRef,
  visible,
} = usePopperTooltip({ trigger: 'click', delayHide: 1000 });

return (
  <>
    <button type="button" ref={setTriggerRef}>
      Trigger element
    </button>

    {visible && (
      <div
        ref={setTooltipRef}
        {...getTooltipProps({ className: 'tooltip-container' })}
      >
        Tooltip element
        <div {...getArrowProps({ className: 'tooltip-arrow' })} />
      </div>
    )}
  </>
);
```

When you use the hook, all props that you previously passed to the `TooltipTrigger` component now are arguments of the
hook itself. Please note, that some props have been renamed, so in some cases you can't just copy-paste them from your
render prop component to the hook. See the [release notes to 4.x](release-notes.md).

The hook returns an object containing set of properties. `setTooltipRef` and `setTriggerRef` are ref callbacks and have
to be assigned to the tooltip and trigger elements accordingly in order to let the hook have access to the underlying
DOM elements.

Previously, they called `triggerRef` and `tooltipRef`, and had the same meaning of the ref callbacks. Now the hook
returns properties with these names as well but in the hook version they actually contain the corresponding DOM
elements. You don't need to use `getTriggerRef` to get a ref of the trigger element anymore.

The `tooltip` and `children` props have now been removed. Now you completely responsible for the composition of your
tooltip. If you, for example, want to have your tooltip rendered through React portal, you have to import react-dom and
use `createPortal` in your code.

Use `visible` property to show or hide the tooltip.

If you still have questions, see [examples section](README.md#examples) for more code examples using the hook.
