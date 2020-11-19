import * as React from "react";
import { createPortal } from "react-dom";
import "react-popper-tooltip/src/styles.css";
import { usePopperTooltip } from "react-popper-tooltip";

export function PortalExample() {
  const {
    getArrowProps,
    getTooltipProps,
    setArrowRef,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip();

  return (
    <div className="App">
      <h1>React portal example</h1>

      <button type="button" ref={setTriggerRef}>
        Reference element
      </button>

      {visible &&
        createPortal(
          <div
            ref={setTooltipRef}
            {...getTooltipProps({ className: "tooltip-container" })}
          >
            Popper element
            <div
              ref={setArrowRef}
              {...getArrowProps({ className: "tooltip-arrow" })}
            />
          </div>,
          document.body
        )}
    </div>
  );
}
