import React, {memo} from 'react';
import TooltipTrigger from '../../src';
import '../../src/styles.css';

const BasicTooltipTrigger = memo(({tooltip, children, hideArrow, ...props}) => (
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
        {!hideArrow && (
          <div
            {...getArrowProps({
              ref: arrowRef,
              'data-placement': placement,
              className: 'tooltip-arrow'
            })}
          />
        )}
        {tooltip}
      </div>
    )}
  >
    {({getTriggerProps, triggerRef}) => (
      <span
        {...getTriggerProps({
          ref: triggerRef
        })}
      >
        {children}
      </span>
    )}
  </TooltipTrigger>
));

export default BasicTooltipTrigger;
