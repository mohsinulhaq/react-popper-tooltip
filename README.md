# react-popper-tooltip

[![npm version](https://img.shields.io/npm/v/react-popper-tooltip.svg?style=flat-square)](https://www.npmjs.com/package/react-popper-tooltip)
[![npm downloads](https://img.shields.io/npm/dm/react-popper-tooltip.svg?style=flat-square)](https://www.npmjs.com/package/react-popper-tooltip)
[![codecov](https://codecov.io/gh/mohsinulhaq/react-popper-tooltip/branch/master/graph/badge.svg)](https://codecov.io/gh/mohsinulhaq/react-popper-tooltip)

A React hook to effortlessly build smart tooltips. Based on [react-popper](https://github.com/FezVrasta/react-popper)
and [popper.js](https://popper.js.org).

## NOTE

> - This is the documentation for 4.x which introduced the `usePopperTooltip` hook.
> - If you're looking for the render prop version,
see [3.x docs](https://github.com/mohsinulhaq/react-popper-tooltip/blob/v3/README.md).
> - If you're looking to upgrade from 3.x render prop to 4.x hook, please refer to our [migration guide](migrating.md).

## Examples

- Basic usage [Demo](https://codesandbox.io/s/github/mohsinulhaq/react-popper-tooltip/tree/master/examples/basic) ([Source](/examples/basic))
- Animating appearance with react-spring [Demo](https://codesandbox.io/s/github/mohsinulhaq/react-popper-tooltip/tree/master/examples/animation) ([Source](/examples/animation))
- Closing tooltip with Esc button [Demo](https://codesandbox.io/s/github/mohsinulhaq/react-popper-tooltip/tree/master/examples/close-on-esc) ([Source](/examples/close-on-esc))
- Using as a controlled component [Demo](https://codesandbox.io/s/github/mohsinulhaq/react-popper-tooltip/tree/master/examples/controlled) ([Source](/examples/controlled))
- Persist the tooltip in the DOM once it's mounted [Demo](https://codesandbox.io/s/github/mohsinulhaq/react-popper-tooltip/tree/master/examples/persist-once-mounted) ([Source](/examples/persist-once-mounted))
- Using with react portal [Demo](https://codesandbox.io/s/github/mohsinulhaq/react-popper-tooltip/tree/master/examples/portal) ([Source](/examples/portal))
- Implementing render prop (v3) API [Demo](https://codesandbox.io/s/github/mohsinulhaq/react-popper-tooltip/tree/master/examples/render-prop) ([Source](/examples/render-prop))


## Installation

You can install **react-popper-tooltip** with [npm](https://www.npmjs.com) or [yarn](https://yarnpkg.com).

```bash
npm i react-popper-tooltip
# or
yarn add react-popper-tooltip
```

## Quick start

This example illustrates how to create a minimal tooltip with default settings and using our default CSS file.

```jsx
import * as React from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import 'react-popper-tooltip/dist/styles.css';

function App() {
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip();

  return (
    <div className="App">
      <button type="button" ref={setTriggerRef}>
        Trigger
      </button>
      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({ className: 'tooltip-container' })}
        >
          <div {...getArrowProps({ className: 'tooltip-arrow' })} />
          Tooltip
        </div>
      )}
    </div>
  );
}

render(<App />, document.getElementById('root'));
```

## Styling

With **react-popper-tooltip**, you can use CSS, LESS, SASS, or any CSS-in-JS library you're already using in your
project. However, we do provide a minimal CSS-file file you can use for a quick start or as a reference to create your
own tooltip styles.

Import `react-popper-tooltip/dist/styles.css` to import it into your project. Add classes
`tooltip-container` and `tooltip-arrow` to the tooltip container and arrow element accordingly.

While the tooltip is being displayed, you have access to some attributes on the tooltip container. You can use them
in your CSS in specific scenarios.

- `data-popper-placement`: contains the current tooltip `placement`. You can use it to properly offset and display the
  arrow element (e.g., if the tooltip is displayed on the right, the arrow should point to the left and vice versa).

- `data-popper-reference-hidden`: set to true when the trigger element is fully clipped and hidden from view, which
  causes the tooltip to appear to be attached to nothing. Set to false otherwise.

- `data-popper-escaped`: set to true when the tooltip escapes the trigger element's boundary (and so it appears
  detached). Set to false otherwise.
  
- `data-popper-interactive`: contains the current `interactive` option value. 

## API reference

### usePopperTooltip

```jsx
const {
  getArrowProps,
  getTooltipProps,
  setTooltipRef,
  setTriggerRef,
  tooltipRef,
  triggerRef,
  visible,
  ...popperProps
} = usePopperTooltip(
  {
    closeOnOutsideClick,
    closeOnTriggerHidden,
    defaultVisible,
    delayHide,
    delayShow,
    followCursor,
    interactive,
    mutationObserverOptions,
    offset,
    onVisibleChange,
    placement,
    trigger,
    visible,
  },
  popperOptions
);
```

#### Options

- `closeOnOutsideClick: boolean`, defaults to `true`

If `true`, closes the tooltip when user clicks outside the trigger element.

- `closeOnTriggerHidden: boolean`, defaults to `false`

Whether to close the tooltip when its trigger is out of boundary.

- `delayHide: number`, defaults to `0`

Delay in hiding the tooltip (ms).

- `delayShow: number`, defaults to `0`

Delay in showing the tooltip (ms).

- `defaultVisible: boolean`, defaults to `false`

The initial visibility state of the tooltip when the hook is initialized.

- `followCursor: boolean`, defaults to `false`

If `true`, the tooltip will stick to the cursor position. You would probably want to use this option with hover trigger.

- `mutationObserverOptions: MutationObserverInit | null`, defaults
  to `{ attributes: true, childList: true, subtree: true }`

Options to [MutationObserver
](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver), used internally for updating tooltip position based on its DOM changes. When the tooltip is
visible and its content changes, it automatically repositions itself. In some cases
you may need to change which parameters to observe or opt-out of tracking the changes at all.

- `offset: [number, number]`, defaults to `[0, 6]`

This is a shorthand for `popperOptions.modifiers` offset modifier option. The default value means the tooltip will be
placed 6px away from the trigger element (to reserve enough space for the arrow element).

We use this default value to match the size of the arrow element from our default CSS file. Feel free to change it if you are using your
own styles.

See [offset modifier docs](https://popper.js.org/docs/v2/modifiers/offset).

`popperOptions` takes precedence over this option.

- `onVisibleChange: (state: boolean) => void`

Called with the tooltip state, when the visibility of the tooltip changes.

- `trigger: TriggerType | TriggerType[] | null`, where `TriggerType = 'click' | 'right-click' | 'hover' | 'focus'`,
  defaults to `hover`

Event or events that trigger the tooltip. Use `null` if you want to disable all events. It's useful in cases when
you control the state of the tooltip.

- `visible: boolean`

The visibility state of the tooltip. Use this prop if you want to control the state of the tooltip. Note that `delayShow` and `delayHide` are not used if the tooltip is controlled. You have to apply delay on your external state.

**react-popper-tooltip** manages its own state internally and calls `onVisibleChange` handler with any relevant changes.

However, if more control is needed, you can pass this prop, and the state becomes controlled. As soon as it's not
undefined, internally, **react-popper-tooltip** will determine its state based on your prop's value rather than its own
internal state.

- `placement: 'auto' | 'auto-start' | 'auto-end' | 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end';`

The preferred placement of the tooltip. This is an alias for `popperOptions.placement` option.

`popperOptions` takes precedence over this option.

- `interactive: boolean`, defaults to `false`

If `true`, hovering the tooltip will keep it open. Normally, if you trigger the tooltip on hover event, the tooltip
closes when the mouse cursor moves out of the trigger element. If it moves to the tooltip element, the tooltip stays
open. It's useful if you want to allow your users to interact with the tooltip's content (select and copy text, click a
link, etc.). In this case you might want to increase `delayHide` value to give the user more time to react.

- `popperOptions: { placement, modifiers, strategy, onFirstUpdate }`

These options passed directly to the underlying `usePopper` hook.
See [https://popper.js.org/docs/v2/constructors/#options](https://popper.js.org/docs/v2/constructors/#options).

Keep in mind, if you set `placement` or _any_ `modifiers` here, it replaces `offset` and `placement` options above. They
won't be merged into the final object. You have to add `offset` modifier along with others here to make it work.

#### Returns

- `triggerRef: HTMLElement | null`

The trigger DOM element ref.

- `tooltipRef: HTMLElement | null`

The tooltip DOM element ref.

- `setTooltipRef: (HTMLElement | null) => void | null`

A tooltip callback ref. Must be assigned to the tooltip's `ref` prop.

- `setTriggerRef: (HTMLElement | null) => void | null`

A trigger callback ref. Must be assigned to the trigger's `ref` prop.

- `visible: boolean`

The current visibility state of the tooltip. Use it to display or hide the tooltip.

- `getArrowProps: (props) => mergedProps`

This function merges your props and the internal props of the arrow element. We recommend passing all your props to that
function rather than applying them on the element directly to avoid your props being overridden or overriding the
internal props.

It returns the merged props that you need to pass to the arrow element.

- `getTooltipProps: (props) => mergedProps`

This function merges your props and the internal props of the tooltip element. We recommend passing all your props to
that function rather than applying them on the element directly to avoid your props being overridden or overriding the
internal props.

It returns the merged props that you need to pass to tooltip element.

- `popperProps: { update, forceUpdate, state }`

Some props returned by the underlying `usePopper` hook.
See [https://popper.js.org/react-popper/v2/hook](https://popper.js.org/react-popper/v2/hook).

This doesn't include `styles` and `attributes` props. They are included into `getArrowProps` and `getTooltipProps` prop
getters.
