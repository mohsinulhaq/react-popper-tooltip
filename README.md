# React tooltip component based on react-popper

### Usage
1. `npm install react-popper-tooltip`
2. `import TooltipTrigger from 'react-popper-tooltip'`
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
    isTooltipShown: T.bool,
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

## Example
https://codesandbox.io/s/pykkz77z5j

## Check out
https://popper.js.org
