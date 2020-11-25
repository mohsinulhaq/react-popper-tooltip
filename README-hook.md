React-popper-tooltip is a React tooltip component based on [react-popper](https://github.com/FezVrasta/react-popper), the React wrapper around [popper.js](https://popper.js.org) library.

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
        Reference element
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

render(<App />, document.getElementById('root'));
```

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
    closeOnReferenceHidden,
    delayHide,
    delayShow,
    initialVisible,
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

### Options

- `closeOnReferenceHidden: Boolean`, defaults to `true`

Whether to close the tooltip when its trigger is out of boundary.


- `delayHide: number`, defaults to `0`

Delay in hiding the tooltip (ms).


- `delayShow: number`, defaults to `0`

Delay in showing the tooltip (ms).


- `initialVisible: Boolean`, defaults to `false`

The initial visibility state of the tooltip. 


- `visible: Boolean`

The visibility state of the tooltip. Use this prop if you want to control the state of the tooltip.

`react-popper-tooltip` manages its own state internally and calls `onVisibleChange` handler with any relevant changes.

However, if more control is needed, you can pass this prop, and the state becomes controlled. As soon as it's not 
undefined, internally, `react-popper-tooltip` will determine its state based on your prop's value rather than its own 
internal state.


- `onVisibleChange: Function(state: Boolean) => void`

Called with the tooltip state, when the visibility of the tooltip changes.


- `trigger: TriggerType | TriggerType[]`, where `TriggerType = 'none' | 'click' | 'right-click' | 'hover' | 'focus'`, defaults to `hover`

Event or events that trigger the tooltip. 


- `mutationObserverOptions: MutationObserverInit`, defaults to `{ attributes: true, childList: true, subtree: true }`

Options to MutationObserver, used internally for updating tooltip position based on its DOM changes. See [MutationObserver
](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver).


- `offset: [number, number]`, defaults to `[0, 10]`

This is a shorthand for `Popper.js` offset modifier option. The default value means the tooltip will be placed a 10px 
away from the reference element (to reserve enough space for the arrow element).
                                                          
`popperOptions` takes precedence over this option. See [offset modifier docs](https://popper.js.org/docs/v2/modifiers/offset/).


- `placement: 'auto' | 'auto-start' | 'auto-end' | 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end';`

The preferred placement of the tooltip. This is an alias for `Popper.js` placement option. 

`popperOptions` takes precedence over this option.


- `popperOptions: { placement, modifiers, strategy, onFirstUpdate }`

These options passed directly to the underlying `usePopper` hook. See [https://popper.js.org/docs/v2/constructors/#options](https://popper.js.org/docs/v2/constructors/#options).

Keep in mind, if you set `placement` or any `modifiers` here, it replaces `offset` and `placement` options above. They won't be merged into
the final object.

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

The current visibility state of the tooltip. Use it to hide or display the tooltip.


- `getArrowProps: Function(props) => mergedProps`

This function merges your props and the internal props of the arrow element.
We recommend passing all your props to that function rather than applying them on the element directly
to avoid your props being overridden or overriding the internal props. 

It returns merged props you have to spread to the arrow element.


- `getTooltipProps: Function(props) => mergedProps`

This function merges your props and the internal props of the tooltip element.
We recommend passing all your props to that function rather than applying them on the element directly
to avoid your props being overridden or overriding the internal props. 

It returns merged props you have to spread to the tooltip element.

- `popperProps: { update, forceUpdate, state }`

Some props returned by the `usePopper` hook. See [https://popper.js.org/react-popper/v2/hook/](https://popper.js.org/react-popper/v2/hook/).

This doesn't include `styles` and `attributes` props. They are included into `getArrowProps` and `getTooltipProps` prop getters.
