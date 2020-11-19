import * as React from "react";
import "react-popper-tooltip/src/styles.css";
import { usePopperTooltip } from "react-popper-tooltip";

export function OutOfBoundariesExample() {
  const {
    getArrowProps,
    getTooltipProps,
    setArrowRef,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip(
    { trigger: 'click', closeOnReferenceHidden: true },
  );

  return (
    <div className="App">
      <h1>Out of boundaries</h1>
      <p>
        Close the tooltip if the reference element is out of the viewport.
        Scroll the page down.
      </p>

      <button type="button" ref={setTriggerRef}>
        Reference element
      </button>

      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({ className: "tooltip-container" })}
        >
          Popper element
          <div
            ref={setArrowRef}
            {...getArrowProps({ className: "tooltip-arrow" })}
          />
        </div>
      )}
    </div>
  );
}
