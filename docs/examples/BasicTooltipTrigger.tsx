import React, {memo} from 'react';
import TooltipTrigger from '../../src';
import '../../src/styles.css';
import {ChildrenArg, TooltipArg} from '../../src/types';
import {BasicTooltipTriggerProps} from './types';

const Trigger = (children: React.ReactNode) => ({
  triggerRef,
  getTriggerProps
}: ChildrenArg) => (
  <span
    {...getTriggerProps({
      ref: triggerRef
    })}
  >
    {children}
  </span>
);

const Tooltip = (tooltip: React.ReactNode, hideArrow?: boolean) => ({
  arrowRef,
  tooltipRef,
  getArrowProps,
  getTooltipProps,
  placement
}: TooltipArg) => (
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

const BasicTooltipTrigger = memo(
  ({tooltip, children, hideArrow, ...props}: BasicTooltipTriggerProps) => (
    <TooltipTrigger {...props} tooltip={Tooltip(tooltip, hideArrow)}>
      {Trigger(children)}
    </TooltipTrigger>
  )
);

export default BasicTooltipTrigger;
