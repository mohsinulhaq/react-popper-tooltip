import React from 'react';
import {render} from 'react-testing-library';
import TooltipTrigger from '../src';

const Tooltip = ({
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
    World
  </div>
);

const Trigger = ({getTriggerProps, triggerRef}) => (
  <span
    {...getTriggerProps({
      ref: triggerRef,
      className: 'trigger'
    })}
  >
    Hello
  </span>
);

it('matches snapshot', () => {
  const {container} = render(
    <TooltipTrigger tooltip={Tooltip}>{Trigger}</TooltipTrigger>
  );
  expect(container.firstChild).toMatchSnapshot();
});
