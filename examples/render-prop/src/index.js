import * as React from 'react';
import ReactDOM, { createPortal } from 'react-dom';
import { usePopperTooltip } from 'react-popper-tooltip';
import 'react-popper-tooltip/dist/styles.css';

function App() {
  return <Example />;
}

const canUseDOM = Boolean(
  typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
);

const mutationObserverDefaults = {
  childList: true,
  subtree: true,
};

function TooltipTrigger({
  children,
  // Some defaults changed in the hook implementation.
  // For backward compatibility we have to override them here.
  closeOnReferenceHidden = true,
  defaultTooltipShown,
  getTriggerRef,
  modifiers,
  mutationObserverOptions = mutationObserverDefaults,
  onVisibilityChange,
  placement = 'right',
  portalContainer = canUseDOM ? document.body : null,
  tooltip,
  tooltipShown,
  usePortal = canUseDOM,
  ...restProps
}) {
  const {
    triggerRef,
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
    state,
  } = usePopperTooltip(
    {
      // Some props renamed in the hook implementation.
      defaultVisible: defaultTooltipShown,
      onVisibleChange: onVisibilityChange,
      visible: tooltipShown,
      closeOnTriggerHidden: closeOnReferenceHidden,
      ...restProps,
    },
    {
      placement,
      modifiers,
    }
  );

  const reference = children({
    // No longer required, for backward compatibility.
    getTriggerProps: (props) => props,
    triggerRef: setTriggerRef,
  });

  const popper = tooltip({
    tooltipRef: setTooltipRef,
    getArrowProps,
    getTooltipProps,
    placement: state ? state.placement : undefined,
  });

  React.useEffect(() => {
    if (typeof getTriggerRef === 'function') getTriggerRef(triggerRef);
  }, [triggerRef, getTriggerRef]);

  return (
    <>
      {reference}
      {visible
        ? usePortal
          ? createPortal(popper, portalContainer)
          : popper
        : null}
    </>
  );
}

function Example() {
  return (
    <div className="App">
      <h1>react-popper-tooltip</h1>
      <p>Render prop example</p>

      <TooltipTrigger
        trigger="click"
        tooltip={({ tooltipRef, getArrowProps, getTooltipProps }) => (
          <div
            {...getTooltipProps({
              ref: tooltipRef,
              className: 'tooltip-container',
            })}
          >
            <div
              {...getArrowProps({
                className: 'tooltip-arrow',
              })}
            />
            Tooltip element
          </div>
        )}
      >
        {({ triggerRef }) => (
          <button ref={triggerRef} type="button">
            Trigger element
          </button>
        )}
      </TooltipTrigger>
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
