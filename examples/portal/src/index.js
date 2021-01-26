import * as React from 'react';
import ReactDOM from 'react-dom';
import { usePopperTooltip } from 'react-popper-tooltip';
import 'react-popper-tooltip/src/styles.css';

function App() {
  return <Example />;
}

function Example() {
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip();

  return (
    <div className="App">
      <h1>react-popper-tooltip</h1>
      <p>Using a react portal to render a tooltip.</p>

      <button type="button" ref={setTriggerRef}>
        Trigger element
      </button>

      {visible &&
        ReactDOM.createPortal(
          <div
            ref={setTooltipRef}
            {...getTooltipProps({ className: 'tooltip-container' })}
          >
            Tooltip element
            <div {...getArrowProps({ className: 'tooltip-arrow' })} />
          </div>,
          document.body
        )}
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
