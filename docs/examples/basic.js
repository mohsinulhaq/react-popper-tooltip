import React from 'react';
import TooltipTrigger from '../../src/index';
import '../../src/styles.css';

const Tooltip = ({ tooltip, children, ...props }) => (
  <TooltipTrigger
    {...props}
    tooltip={({
      getTooltipProps,
      getArrowProps,
      tooltipRef,
      arrowRef,
      placement
    }) => (
      <div
        {...getTooltipProps({
          ref: tooltipRef,
          className: 'tooltip-container'
        })}
      >
        <div
          {...getArrowProps({
            ref: arrowRef,
            'data-placement': placement,
            className: 'tooltip-arrow'
          })}
        />
        {tooltip}
      </div>
    )}
  >
    {({ getTriggerProps, triggerRef }) => (
      <span
        {...getTriggerProps({
          ref: triggerRef
        })}
      >
        {children}
      </span>
    )}
  </TooltipTrigger>
);

export default Tooltip;
