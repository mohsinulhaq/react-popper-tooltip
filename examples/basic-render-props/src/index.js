import React from 'react';
import ReactDOM from 'react-dom';
import 'react-popper-tooltip/src/styles.css';
import { TooltipTrigger } from 'react-popper-tooltip';

function App() {
  return <Example />;
}

function Example() {
  return (
    <div className="App">
      <h1>react-popper-tooltip</h1>
      <p>Render prop example</p>

      <TooltipTrigger
        trigger="click"
        tooltip={({ arrowRef, tooltipRef, getArrowProps, getTooltipProps }) => (
          <div
            {...getTooltipProps({
              ref: tooltipRef,
              className: 'tooltip-container',
            })}
          >
            <div
              {...getArrowProps({
                ref: arrowRef,
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
