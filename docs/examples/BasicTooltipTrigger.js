import React, {memo} from 'react';
import TooltipTrigger from '../../src';
import '../../src/styles.css';

const Trigger = children => ({triggerRef, getTriggerProps}) => (
  <span
    {...getTriggerProps({
      ref: triggerRef
    })}
  >
    {children}
  </span>
);

const Tooltip = (tooltip, hideArrow) => ({
  arrowRef,
  tooltipRef,
  placement,
  getTooltipProps,
  getArrowProps
}) => (
  <div
    {...getTooltipProps({
      className: 'tooltip-container',
      ref: tooltipRef
    })}
  >
    {!hideArrow && (
      <div
        {...getArrowProps({
          className: 'tooltip-arrow',
          'data-placement': placement,
          ref: arrowRef
        })}
      />
    )}
    {tooltip}
  </div>
);

const BasicTooltipTrigger = memo(({tooltip, children, hideArrow, ...props}) => (
  <TooltipTrigger {...props} tooltip={Tooltip(tooltip, hideArrow)}>
    {Trigger(children)}
  </TooltipTrigger>
));

export default BasicTooltipTrigger;
