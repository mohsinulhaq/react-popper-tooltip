# react-popper-tooltip

[![npm version](https://img.shields.io/npm/v/react-popper-tooltip.svg?style=flat-square)](https://www.npmjs.com/package/react-popper-tooltip)
[![npm downloads](https://img.shields.io/npm/dm/react-popper-tooltip.svg?style=flat-square)](https://www.npmjs.com/package/react-popper-tooltip)
[![codecov](https://codecov.io/gh/mohsinulhaq/react-popper-tooltip/branch/master/graph/badge.svg)](https://codecov.io/gh/mohsinulhaq/react-popper-tooltip)
[![Dependency Status](https://img.shields.io/david/mohsinulhaq/react-popper-tooltip.svg?style=flat-square)](https://david-dm.org/mohsinulhaq/react-popper-tooltip)

A React tooltip component based on [react-popper](https://github.com/FezVrasta/react-popper), a React wrapper
around [popper.js](https://popper.js.org) library.

## Docs

[Migrating from 3.x to 4.x](/migrating.md)

[3.x docs]()

## Examples

## Installation

You can install react-popper-tooltip with [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/).

```bash
$ npm i react-popper-tooltip
# or
$ yarn add react-popper-tooltip
```

## Quick start

This example illustrates how to create a minimal tooltip with default settings and using a default css file.

```jsx
import * as React from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import 'react-popper-tooltip/dist/styles.css';

function App() {
  const {
    getArrowProps,
    getTooltipProps,
    setArrowRef,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip();

  return (
    <div className="App">
      <button type="button" ref={setTriggerRef}>
        Trigger element
      </button>
      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({ className: 'tooltip-container' })}
        >
          Tooltip text goes here.
          <div
            ref={setArrowRef}
            {...getArrowProps({ className: 'tooltip-arrow' })}
          />
        </div>
      )}
    </div>
  );
}

render(<App/>, document.getElementById('root'));
```

## Important Defaults

Out of the box, react-popper-tooltip is configured with default options that work for most of the use-cases, and
usually, you won't need to change anything. We worked with react-popper-tooltip with flexibility in mind, providing a
configurable parameter to every internal decision we made. You can turn parts of the functionality on and off based on
your requirements.

- If you use `click` to trigger the tooltip, it seems reasonable to close the tooltip when you click anywhere outside
  the tooltip.

> To change this functionality, use the option `closeOnClickOutside`.

- If you use `click` or `focus` to trigger the tooltip, so it stays open when you scroll the page, the tooltip will be
  closed when the trigger element is no longer visible.

> To change this functionality, use the option `closeOnTriggerHidden`.

- If you use `hover` to trigger the tooltip, the tooltip closes when you move the cursor out of the trigger element. But
  if the cursor moves to the tooltip element, the tooltip stays open. It may be useful if you want to allow the user to
  interact with the tooltip's content (select and copy text, click a link, etc.)

> To change this functionality, use the option `persistTooltipOnHover`.

- When the tooltip is visible and its content changes, it automatically repositions itself. Internally we
  use [MutationObserver
  ](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) to track tooltip's content changes. In some cases
  you might want to change this behaviour or opt-out of tracking changes at all.

> To change this functionality, use the option `mutationObserverOptions`.

## Render props

This is a legacy API for compatibility with 3.x users moving to 4.x. We recommend using the `usePopperTooltip` hook.

There are some breaking changes, for more information see [Migrating from 3.x to 4.x]().

## API reference

```jsx
const {
  arrowRef,
  getArrowProps,
  getTooltipProps,
  setArrowRef,
  setTooltipRef,
  setTriggerRef,
  tooltipRef,
  triggerRef,
  visible,
  ...popperProps
} = usePopperTooltip(
  {
    closeOnClickOutside,
    closeOnTriggerHidden,
    delayHide,
    delayShow,
    initialVisible,
    mutationObserverOptions,
    offset,
    onVisibleChange,
    persistTooltipOnHover,
    placement,
    trigger,
    visible: visible,
  },
  popperOptions
);
```

### Options

- `delayHide: number`, defaults to `0`

Delay in hiding the tooltip (ms).

- `delayShow: number`, defaults to `0`

Delay in showing the tooltip (ms).

- `initialVisible: Boolean`, defaults to `false`

The initial visibility state of the tooltip when the hook is initialized.

- `visible: Boolean`

The visibility state of the tooltip. Use this prop if you want to control the state of the tooltip.

`react-popper-tooltip` manages its own state internally and calls `onVisibleChange` handler with any relevant changes.

However, if more control is needed, you can pass this prop, and the state becomes controlled. As soon as it's not
undefined, internally, `react-popper-tooltip` will determine its state based on your prop's value rather than its own
internal state.

- `onVisibleChange: Function(state: Boolean) => void`

Called with the tooltip state, when the visibility of the tooltip changes.

- `trigger: TriggerType | TriggerType[]`, where `TriggerType = 'none' | 'click' | 'right-click' | 'hover' | 'focus'`,
  defaults to `hover`

Event or events that trigger the tooltip.

- `offset: [number, number]`, defaults to `[0, 10]`

This is a shorthand for `popperOptions.modifiers` offset modifier option. The default value means the tooltip will be
placed a 10px away from the trigger element (to reserve enough space for the arrow element).

`popperOptions` takes precedence over this option.
See [offset modifier docs](https://popper.js.org/docs/v2/modifiers/offset/).

- `placement: 'auto' | 'auto-start' | 'auto-end' | 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end';`

The preferred placement of the tooltip. This is an alias for `popperOptions.placement` option.

`popperOptions` takes precedence over this option.

- `closeOnClickOutside: Boolean`, defaults to `true`

If `true`, closes the tooltip when user clicks outside the trigger element.

- `closeOnTriggerHidden: Boolean`, defaults to `true`

If `true`, closes the tooltip when the trigger element goes out of the viewport.

- `persistTooltipOnHover: Boolean`, defaults to `true`

If `true`, hovering the tooltip will keep it open. Normally tooltip closes when the mouse cursor moves out of the
trigger element. If it moves to the tooltip element, the tooltip stays open.

- `mutationObserverOptions: MutationObserverInit | null`, defaults
  to `{ attributes: true, childList: true, subtree: true }`

Options to MutationObserver, used internally for updating tooltip position based on its DOM changes.
See [MutationObserver
](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver).

- `popperOptions: { placement, modifiers, strategy, onFirstUpdate }`

These options passed directly to the underlying `usePopper` hook.
See [https://popper.js.org/docs/v2/constructors/#options](https://popper.js.org/docs/v2/constructors/#options).

Keep in mind, if you set `placement` or any `modifiers` here, it replaces `offset` and `placement` options above. They
won't be merged into the final object.

### Returns

- `arrowRef: HTMLElement | null`

An arrow DOM element.

- `tooltipRef: HTMLElement | null`

A tooltip DOM element.

- `triggerRef: HTMLElement | null`

A trigger DOM element.

- `setArrowRef: HTMLElement | null`

An arrow callback ref. Must be assigned to the arrow's `ref` prop.

- `setTooltipRef: HTMLElement | null`

A tooltop callback ref. Must be assigned to the tooltip's `ref` prop.

- `setTriggerRef: HTMLElement | null`

A trigger callback ref. Must be assigned to the trigger's `ref` prop.

- `visible: Boolean`

The current visibility state of the tooltip. Use it to display or hide the tooltip.

- `getArrowProps: Function(props) => mergedProps`

This function merges your props and the internal props of the arrow element. We recommend passing all your props to that
function rather than applying them on the element directly to avoid your props being overridden or overriding the
internal props.

It returns merged props you have to spread to the arrow element.

- `getTooltipProps: Function(props) => mergedProps`

This function merges your props and the internal props of the tooltip element. We recommend passing all your props to
that function rather than applying them on the element directly to avoid your props being overridden or overriding the
internal props.

It returns merged props you have to spread to the tooltip element.

- `popperProps: { update, forceUpdate, state }`

Some props returned by the `usePopper` hook.
See [https://popper.js.org/react-popper/v2/hook/](https://popper.js.org/react-popper/v2/hook/).

This doesn't include `styles` and `attributes` props. They are included into `getArrowProps` and `getTooltipProps` prop
getters.
