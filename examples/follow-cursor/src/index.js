import * as React from 'react';
import ReactDOM from 'react-dom';
import 'react-popper-tooltip/src/styles.css';
import { usePopperTooltip } from 'react-popper-tooltip';

function App() {
  return <Example />;
}

function Example() {

  const {
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({ followCursor: true });

  return (
    <div className="App">
      <h1>react-popper-tooltip</h1>
      <p>Tooltip follows a cursor</p>

      <button
        type="button"
        ref={setTriggerRef}
        style={{ width: '200px', height: '200px' }}
      >
        Trigger element
      </button>

      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({
            className: 'tooltip-container',
          })}
        >
          Tooltip element
        </div>
      )}
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
