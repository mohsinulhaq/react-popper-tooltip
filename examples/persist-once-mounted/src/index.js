import React from 'react';
import ReactDOM from 'react-dom';
import 'react-popper-tooltip/src/styles.css';
import { usePopperTooltip } from 'react-popper-tooltip';

function App() {
  return <Example />;
}

function Example() {
  const [mounted, setMounted] = React.useState(false);

  const {
    getArrowProps,
    getTooltipProps,
    setArrowRef,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({
    trigger: 'click',
    onVisibleChange: setMountedOnceVisible,
  });

  function setMountedOnceVisible(visible) {
    if (!mounted && visible) {
      setMounted(true);
    }
  }

  return (
    <div className="App">
      <h1>react-popper-tooltip</h1>
      <p>
        In this example, the tooltip stays in the DOM once mounted. It can be
        helpful for heavy components to avoid unnecessary mounting/dismounting
        whenever tooltip is hidden or shown.
      </p>
      <p>
        Mounted: {mounted ? 'yes' : 'no'}, visible: {visible ? 'yes' : 'no'}
      </p>

      <button type="button" ref={setTriggerRef}>
        Trigger element
      </button>

      {mounted && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({
            className: 'tooltip-container',
            style: visible
              ? { visibility: 'visible' }
              : { visibility: 'hidden', pointerEvents: 'none' },
          })}
        >
          Tooltip element, heavy calculatins happens here when mounted.
          <div
            ref={setArrowRef}
            {...getArrowProps({ className: 'tooltip-arrow' })}
          />
        </div>
      )}
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
