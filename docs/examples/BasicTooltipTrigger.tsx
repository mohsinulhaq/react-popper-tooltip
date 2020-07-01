import React, { memo } from 'react';
import TooltipTrigger from '../../src';
import { ChildrenArg, TooltipArg } from '../../src';
import { BasicTooltipTriggerProps } from './types';
import styles from './styles.module.css';

const modifiers = [
  {
    name: 'offset',
    enabled: true,
    options: {
      offset: [0, 4],
    },
  },
];

const Trigger = (children: React.ReactNode) => ({
  triggerRef,
  getTriggerProps,
}: ChildrenArg) => (
  <span
    {...getTriggerProps({
      ref: triggerRef,
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
  placement,
}: TooltipArg) => (
  <div
    {...getTooltipProps({
      className: styles.tooltipContainer,
      ref: tooltipRef,
    })}
  >
    {!hideArrow && (
      <div
        {...getArrowProps({
          className: styles.tooltipArrow,
          'data-placement': placement,
          ref: arrowRef,
        })}
      />
    )}
    {tooltip}
  </div>
);

const BasicTooltipTrigger = memo(
  ({ tooltip, children, hideArrow, ...props }: BasicTooltipTriggerProps) => (
    <TooltipTrigger
      {...props}
      modifiers={modifiers}
      tooltip={Tooltip(tooltip, hideArrow)}
    >
      {Trigger(children)}
    </TooltipTrigger>
  )
);

BasicTooltipTrigger.displayName = 'BasicTooltipTrigger';

export default BasicTooltipTrigger;
