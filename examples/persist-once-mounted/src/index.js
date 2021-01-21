import * as React from 'react';
import ReactDOM from 'react-dom';
import { usePopperTooltip } from 'react-popper-tooltip';
import 'react-popper-tooltip/dist/styles.css';

function App() {
  return <Example />;
}

function HeavyCalculations() {
  const [counter, setCounter] = React.useState(0);
  return (
    <div>
      <p>
        Some heavy calculatins happens here when mounted. The component state
        preserved when tooltip shows/hides.
      </p>
      <p>
        <button onClick={() => setCounter((s) => s + 1)}>+</button>
        {counter}
      </p>
    </div>
  );
}

function Example() {
  const [mounted, setMounted] = React.useState(false);

  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({
    trigger: 'click',
    onVisibilityChange: setMountedOnceVisible,
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
        whenever tooltip is hidden or shown or when you want to preserve the
        tooltip content's state.
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
          <div
            {...getArrowProps({ className: 'tooltip-arrow' })}
          />
          <HeavyCalculations />
        </div>
      )}
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
