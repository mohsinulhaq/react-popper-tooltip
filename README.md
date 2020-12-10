# react-popper-tooltip

[![npm version](https://img.shields.io/npm/v/react-popper-tooltip.svg?style=flat-square)](https://www.npmjs.com/package/react-popper-tooltip)
[![npm downloads](https://img.shields.io/npm/dm/react-popper-tooltip.svg?style=flat-square)](https://www.npmjs.com/package/react-popper-tooltip)
[![codecov](https://codecov.io/gh/mohsinulhaq/react-popper-tooltip/branch/master/graph/badge.svg)](https://codecov.io/gh/mohsinulhaq/react-popper-tooltip)
[![Dependency Status](https://img.shields.io/david/mohsinulhaq/react-popper-tooltip.svg?style=flat-square)](https://david-dm.org/mohsinulhaq/react-popper-tooltip)

A primitive to build a React tooltip component. Based on [react-popper](https://github.com/FezVrasta/react-popper)
and [popper.js](https://popper.js.org) libraries.

## Solution

The library offers two solutions. The first solution, which is we recommend you to use, is a React hooks. The hook
provides the stateful logic needed to make the tooltip component functional.

The second solution is the TooltipTrigger component, which can also be used to create a tooltip, providing the logic in
the form of a render prop. This is a legacy API for compatibility with 3.x users moving to 4.x. It's not recommended for
the new users, and it doesn't support all the features that the hook does.

## Docs

This is the documentation for the version 4.x which introduced the `usePopperTooltip` hook.

Docs for the version 3.x are here [3.x docs](https://github.com//mohsinulhaq/react-popper-tooltip/v3/README.md)

## Examples

- Basic usage [Demo]() [Source](/examples/basic)
- Animating appearance with react-spring  [Demo]() [Source](/examples/animation)
- Closing tooltip with Esc button  [Demo]() [Source](/examples/close-on-esc)
- Close tooltip when trigger element is out of view  [Demo]() [Source](/examples/close-out-of-view)
- Using as a controlled component [Demo]() [Source](/examples/controlled)
- Tooltip follows a cursor  [Demo]() [Source](/examples/follow-cursor)
- Persist the tooltip in the DOM once it's shown [Demo]() [Source](/examples/persist-once-mounted)
- Usign with react portal [Demo]() [Source](/examples/portal)
- Using legacy render prop API [Demo]() [Source](/examples/basic-render-props)

## Installation

You can install react-popper-tooltip with [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/).

```bash
$ npm i react-popper-tooltip
# or
$ yarn add react-popper-tooltip
```

## Quick start

This example illustrates how to create a minimal tooltip with default settings and using a default CSS file.

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

## Styling

With react-popper-tooltip, you can use CSS, LESS, SASS, or any CSS-in-JS library you're already using in your project.
However, we supply a minimal CSS-file file you can use for a quick start or as a reference to create your styles.

Use `import 'react-popper-tooltip/src/styles.css';` to import it into your project. Add classes
`tooltip-container` and `tooltip-arrow` to the tooltip container and arrow element accordingly.

When the tooltip is displayed, react-popper-tooltip adds some attributes to the tooltip container. You can use them in
your CSS in specific scenatios.

- `data-popper-placement`: contains the current tooltip placement. You can use it to properly offset and display the
  arrow element (i.e., if the tooltip is displayed on the right, the arrow should point to the left and vice versa).

- `data-popper-reference-hidden`: set to true when the trigger element is fully clipped and hidden from view, which
  causes the tooltip to appear to be attached to nothing. Set to false otherwise.

- `data-popper-escaped`: set to true when the tooltip escapes the trigger element's boundary (and so it appears
  detached). Set to false otherwise.

## API reference

### usePopperTooltip

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
    delayHide,
    delayShow,
    initialVisible,
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

- `trigger: TriggerType | TriggerType[] | null`, where `TriggerType = 'click' | 'right-click' | 'hover' | 'focus'`,
  defaults to `hover`

Event or events that trigger the tooltip. Use `null` if you want to disable all events. It's usefull in some cases
when you controll the state of the tooltip from the outside of the component.

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

- `interactive: Boolean`, defaults to `false`

If `true`, hovering the tooltip will keep it open. Normally tooltip closes when the mouse cursor moves out of the
trigger element. If it moves to the tooltip element, the tooltip stays open. It's useful if you want to allow your users
to interact with the tooltip's content (select and copy text, click a link, etc.).

- `mutationObserverOptions: MutationObserverInit | null`, defaults
  to `{ attributes: true, childList: true, subtree: true }`

Options to MutationObserver, used internally for updating tooltip position based on its DOM changes. When the tooltip is
visible and its content changes, it automatically repositions itself. Internally we use [MutationObserver
](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) to track tooltip's content changes. In some cases
you might want to change which parameters to observe or opt-out of tracking the changes at all.

- `popperOptions: { placement, modifiers, strategy, onFirstUpdate }`

These options passed directly to the underlying `usePopper` hook.
See [https://popper.js.org/docs/v2/constructors/#options](https://popper.js.org/docs/v2/constructors/#options).

Keep in mind, if you set `placement` or any `modifiers` here, it replaces `offset` and `placement` options above. They
won't be merged into the final object.

#### Returns

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

Some props returned by the underlying `usePopper` hook.
See [https://popper.js.org/react-popper/v2/hook/](https://popper.js.org/react-popper/v2/hook/).

This doesn't include `styles` and `attributes` props. They are included into `getArrowProps` and `getTooltipProps` prop
getters.

### TooltipTrigger

See [3.x docs](https://github.com//mohsinulhaq/react-popper-tooltip/v3/README.md)



