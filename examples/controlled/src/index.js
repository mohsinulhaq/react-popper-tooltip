import * as React from 'react';
import ReactDOM from 'react-dom';
import { usePopperTooltip } from 'react-popper-tooltip';
import 'react-popper-tooltip/dist/styles.css';

function App() {
  return <Example />;
}

function Example() {
  const [controlledVisible, setControlledVisible] = React.useState(false);

  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({
    trigger: 'click',
    closeOnOutsideClick: false,
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

      <p>
        External state control - click the button below to show/hide the
        tooltip.
      </p>
      <button onClick={() => setControlledVisible(!controlledVisible)}>
        External control
      </button>

      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({ className: 'tooltip-container' })}
        >
          Tooltip element
          <div {...getArrowProps({ className: 'tooltip-arrow' })} />
        </div>
      )}
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
