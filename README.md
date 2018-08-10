# React Tooltip
[![npm version](https://img.shields.io/npm/v/react-popper-tooltip.svg)](https://www.npmjs.com/package/react-popper-tooltip)
[![npm downloads](https://img.shields.io/npm/dm/react-popper-tooltip.svg)](https://www.npmjs.com/package/react-popper-tooltip)
[![Dependency Status](https://david-dm.org/mohsinulhaq/react-popper-tooltip.svg)](https://david-dm.org/mohsinulhaq/react-popper-tooltip)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

React tooltip component based on react-popper

### Usage
- `npm install react-popper-tooltip`
- `import TooltipTrigger from 'react-popper-tooltip'`
~~~~
  <TooltipTrigger
    tooltip={<TooltipComponent />}
  >
    <TriggerComponent />
  </TooltipTrigger>
~~~~

### Props
```javascript
{
    /**
     * trigger
     */
    children: T.node.isRequired,
    /**
     * tooltip
     */
    tooltip: T.node.isRequired,
    /**
     * class to be applied to trigger container span
     */
    triggerClassName: T.string,
    /**
     * style to be applied on trigger container span
     */
    triggerStyle: T.object,
    /**
     * class to be applied to tooltip container span
     */
    tooltipClassName: T.string,
    /**
     * style to be applied on tooltip container span
     */
    tooltipStyle: T.object,
    /**
     * whether tooltip is shown by default
     */
    defaultTooltipShown: T.bool,
    /**
     * use to create controlled tooltip
     */
    tooltipShown: T.bool,
    /**
     * delay in showing the tooltip
     */
    delayShow: T.number,
    /**
     * delay in hiding the tooltip
     */
    delayHide: T.number,
    /**
     * whether to show arrow or not
     */
    showArrow: T.bool,
    /**
     * Popper’s placement. Valid placements are:
     *  - auto
     *  - top
     *  - right
     *  - bottom
     *  - left
     * Each placement can have a variation from this list:
     *  -start
     *  -end
     */
    placement: T.string,
    /**
     * the event that triggers the tooltip
     */
    trigger: T.oneOf(['click', 'hover', 'right-click', 'none']),
    /**
     * whether to close the tooltip when it's trigger is out of the boundary
     */
    closeOnOutOfBoundaries: T.bool,
    /**
     * modifiers passed directly to the underlying popper.js instance
     * For more information, refer to Popper.js’ modifier docs:
     * @link https://popper.js.org/popper-documentation.html#modifiers
     */
    modifiers: T.object
}
```
You also have the ability to attach ref to the `TooltipTrigger` component which exposes following methods for programmatic control of the tooltip:
- `showTooltip` (show immediately)
- `hideTooltip` (hide immediately)
- `toggleTooltip` (toggle immediately)
- `scheduleShow` (show respecting delayShow prop)
- `scheduleHide` (hide respecting delayHide prop)
- `scheduleToggle` (toggle respecting delayShow and delayHide props)

## Example
https://codesandbox.io/s/pykkz77z5j

## Check out
https://popper.js.org

https://github.com/FezVrasta/react-popper
