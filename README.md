# React Tooltip
[![npm version](https://img.shields.io/npm/v/react-popper-tooltip.svg)](https://www.npmjs.com/package/react-popper-tooltip)
[![npm downloads](https://img.shields.io/npm/dm/react-popper-tooltip.svg)](https://www.npmjs.com/package/react-popper-tooltip)
[![Dependency Status](https://david-dm.org/mohsinulhaq/react-popper-tooltip.svg)](https://david-dm.org/mohsinulhaq/react-popper-tooltip)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

React tooltip component based on react-popper

## Example
https://codesandbox.io/s/pykkz77z5j

### Usage

```
npm install react-popper-tooltip
```

```jsx
import React from 'react';
import { render } from 'react-dom';
import TooltipTrigger from 'react-popper-tooltip';

render(
  <TooltipTrigger
    tooltip={({ getTooltipProps, arrowProps, arrowPlacement }) => (
      <div className="tooltip" {...getTooltipProps()}>
        <div
          className="arrow"
          {...arrowProps}
          data-placement={arrowPlacement}
        />
        {tooltip}
      </div>
    )}
  >
    {({ getTriggerProps }) => <span {...getTriggerProps()}>{children}</span>}
  </TooltipTrigger>,
  document.getElementById('root')
);
```

`<TooltipTrigger />` is the only component exposed by the package. 
It doesn't render anything itself. It calls the render functions and renders that. 

Read more about [render prop](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce) pattern 
if you're not familiar with this approach. 

### Props

### children

> `function({})` | _required_

This is called with an object. Read more about the properties of this object in
the section "[Children and tooltip functions](#children-and-tooltip-functions)".

### tooltip

> `function({})` | _required_

This is called with an object. Read more about the properties of this object in
the section "[Children and tooltip functions](#children-and-tooltip-functions)".


### defaultTooltipShown

> `boolean` | defaults to `false`

This is the initial visibility state of the tooltip.

### tooltipShown

> `boolean` | **control prop**

Use this prop if you want to control the visibility state of the tooltip.

Package manages its own state internally. You can use this prop to pass the visibility state of the
tooltip from the outside.

### delayShow

> `number` | defaults to `0`

Delay in showing the tooltip (ms).

### delayHide

> `number` | defaults to `0`

Delay in hiding the tooltip (ms).

### placement

> `string` | defaults to `right`

The tooltip placement. Valid placements are:
- `auto`
- `top`
- `right`
- `bottom`
- `left`

Each placement can have a variation from this list:
- `-start`
- `-end`

### trigger

> `string` | defaults to `hover` 

The event that triggers the tooltip. One of `click`, `hover`, `right-click`, `none`.

### closeOnOutOfBoundaries

> `boolean` | defaults to `true` 

Whether to close the tooltip when it's trigger is out of the boundary.

### modifiers

> `object` 

Modifiers passed directly to the underlying popper.js instance. 
For more information, refer to Popper.js’ 
[modifier docs](https://popper.js.org/popper-documentation.html#modifiers)

Modifiers, applied by default:

```
{
  preventOverflow: {
    boundariesElement: 'viewport',
    padding: 0
  }
}
```

You also have the ability to attach ref to the `TooltipTrigger` component which exposes following methods for programmatic control of the tooltip:
- `showTooltip` (show immediately)
- `hideTooltip` (hide immediately)
- `toggleTooltip` (toggle immediately)
- `scheduleShow` (show respecting delayShow prop)
- `scheduleHide` (hide respecting delayHide prop)
- `scheduleToggle` (toggle respecting delayShow and delayHide props)

## Children and tooltip functions

This is where you render whatever you want. `react-popper-tooltip` uses two render props `children`
and `tooltip`. `Children` prop is used to trigger the appearance of the tooltip and `tooltip` 
displays the tooltip itself. 

You use it like so:

```
const tooltip = (
  <TooltipTrigger
    tooltip={tooltip => (<div>{/* more jsx here */}</div>)}
  >
    {trigger => (<div>{/* more jsx here */}</div>)}
  </TooltipTrigger>
)
```

### prop getters

> See [the blog post about prop getters](https://blog.kentcdodds.com/how-to-give-rendering-control-to-users-with-prop-getters-549eaef76acf)

These functions are used to apply props to the elements that you render. 
It's advisable to pass all your props to that function rather than applying them on the element 
yourself to avoid your props being overridden (or overriding the props returned). For example
`<button {...getTriggerProps({ onClick: event => console.log(event))}>Click me</button>`

### children function

|     property    |      type      |                              description                              |
|:---------------:|:--------------:|:---------------------------------------------------------------------:|
| getTriggerProps | `function({})` | returns the props you should apply to the trigger element you render. |
| triggerRef      | `node`         | returns the react ref you should apply to the trigger element.        |


### tooltip function

|     property    |      type      |                              description                              |
|:---------------:|:--------------:|:---------------------------------------------------------------------:|
| getTooltipProps | `function({})` | returns the props you should apply to the tooltip element you render. |
| tooltipRef      | `node`         | return the react ref you should apply to the tooltip element.         |
| arrowStyle      | `object`       | return the styles you should apply to the tooltip arrow style attr.   |
| arrowRef        | `node`         | return the react ref you should apply to the tooltip arrow you render.|
| placement       | `string`       | return the placement of the tooltip arrow element.                    |


## Quick start

The package itself doesn't provide any styles and doesn't render anything. To start using it you
have to provide some default styles and markup for the tooltip to be displayed. 
If you don't want to do that, you may use styles, included in the package,
 and layout from the code below.

### Tooltip.js

```js
import React from 'react';
import TooltipTrigger from "react-popper-tooltip";
import 'react-popper-tooltip/styles.css';

const Tooltip = ({ tooltip, children, ...props }) => (
  <TooltipTrigger
    {...props}   
    tooltip={({ getTooltipProps, tooltipRef, arrowStyle, arrowRef, arrowPlacement }) => (
      <div className="popperBox" ref={tooltipRef} {...getTooltipProps()}>
        <div
          className="popperArrow"
          ref={arrowRef}
          style={arrowStyle}
          data-placement={arrowPlacement}
        />
        {tooltip}
      </div>
    )}
  >
    {({ getTriggerProps, triggerRef }) => <span ref={triggerRef} {...getTriggerProps()}>{children}</span>}
  </TooltipTrigger>
);

export default Tooltip;
```

### Usage example

```jsx
<Tooltip tooltip="Hi there!" placement="top" trigger="click">Click me</Tooltip>
```

## Check out
https://popper.js.org

https://github.com/FezVrasta/react-popper

