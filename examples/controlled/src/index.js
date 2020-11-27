import * as React from 'react';
import ReactDOM from 'react-dom';
import 'react-popper-tooltip/src/styles.css';
import { usePopperTooltip } from 'react-popper-tooltip';

function App() {
  return <Example />;
}

export function Example() {
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
        Reference element
      </button>

      <p>External state control - click the button to show/hide</p>
      <button onClick={() => setControlledVisible((v) => !v)}>
        External control
      </button>

      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({ className: 'tooltip-container' })}
        >
          Popper element
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
