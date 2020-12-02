import * as React from 'react';
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
        placement="bottom"
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
            Hello, World!
          </div>
        )}
      >
        {({ triggerRef }) => (
          <span ref={triggerRef} className="trigger">
            Click Me!
          </span>
        )}
      </TooltipTrigger>
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
