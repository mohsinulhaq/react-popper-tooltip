import React, {memo} from 'react';
import TooltipTrigger from '../../src';
import '../../src/styles.css';
import {IChildrenArg, ITooltipArg} from '../../src/types';
import {IBasicTooltipTriggerProps} from './types';

const Trigger = (children: React.ReactNode) => ({
  triggerRef,
  getTriggerProps
}: IChildrenArg) => (
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
}: ITooltipArg) => (
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
  ({tooltip, children, hideArrow, ...props}: IBasicTooltipTriggerProps) => (
    <TooltipTrigger {...props} tooltip={Tooltip(tooltip, hideArrow)}>
      {Trigger(children)}
    </TooltipTrigger>
  )
);

export default BasicTooltipTrigger;
