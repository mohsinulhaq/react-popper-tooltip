import * as React from "react";
import "react-popper-tooltip/src/styles.css";
import { usePopperTooltip } from "react-popper-tooltip";

export function MutationObserverExample() {
  const [isObserverOn, setIsObserverOn] = React.useState(true);

  const {
    getArrowProps,
    getTooltipProps,
    setArrowRef,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip(
    {
      ...(!isObserverOn && { mutationObserverOptions: undefined }),
    },
    {
      placement: "right",
    }
  );

  return (
    <div className="App">
      <h1>Mutation observer</h1>
      <p>
        <label>
          <input
            type="checkbox"
            checked={isObserverOn}
            onChange={() => setIsObserverOn(!isObserverOn)}
          />
          Use mutation observer
        </label>
      </p>

      <button type="button" ref={setTriggerRef}>
        Reference element
      </button>

      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({ className: "tooltip-container" })}
        >
          <p> Resize the textarea.</p>
          <textarea />
          <div
            ref={setArrowRef}
            {...getArrowProps({ className: "tooltip-arrow" })}
          />
        </div>
      )}
    </div>
  );
}
