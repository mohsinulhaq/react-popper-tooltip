import * as React from "react";
import "react-popper-tooltip/src/styles.css";
import TooltipTrigger from "react-popper-tooltip";

const Tooltip = ({
  arrowRef,
  tooltipRef,
  getArrowProps,
  getTooltipProps,
  placement,
}) => (
  <div
    {...getTooltipProps({
      ref: tooltipRef,
      className: "tooltip-container",
      /* your props here */
    })}
  >
    <div
      {...getArrowProps({
        ref: arrowRef,
        className: "tooltip-arrow",
        "data-placement": placement,
        /* your props here */
      })}
    />
    Hello, World!
  </div>
);

const Trigger = ({ getTriggerProps, triggerRef }) => (
  <span
    {...getTriggerProps({
      ref: triggerRef,
      className: "trigger",
      /* your props here */
    })}
  >
    Click Me!
  </span>
);

export function RenderPropsExample() {
  return (
    <div className="App">
      <h1>Render prop example</h1>

      <TooltipTrigger
        placement="right"
        trigger="click"
        tooltip={Tooltip}
      >
        {Trigger}
      </TooltipTrigger>
    </div>
  );
}
