import React from 'react';
import ReactDOM from 'react-dom';
import 'react-popper-tooltip/src/styles.css';
import { usePopperTooltip } from 'react-popper-tooltip';

function App() {
  return <Example />;
}

function Example() {
  const [controlledVisible, setControlledVisible] = React.useState(false);

  const {
    getArrowProps,
    getTooltipProps,
    setArrowRef,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({
    trigger: 'click',
    closeOnClickOutside: false,
    visible: controlledVisible,
    onVisibleChange: setControlledVisible,
  });

  return (
    <div className="App">
      <h1>react-popper-tooltip</h1>
      <p>
        This is an example of using react-popper-tooltip as a controlled
        component.
      </p>

      <button type="button" ref={setTriggerRef}>
        Trigger element
      </button>

      <p>External state control - click the button below to show/hide the tooltip.</p>
      <button onClick={() => setControlledVisible(!controlledVisible)}>
        External control
      </button>

      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({ className: 'tooltip-container' })}
        >
          Tooltip element
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
