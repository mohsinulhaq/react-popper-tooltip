import * as React from 'react';
import ReactDOM from 'react-dom';
import { usePopperTooltip } from 'react-popper-tooltip';
import { animated, useTransition } from 'react-spring';
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
  } = usePopperTooltip({
    visible: controlledVisible,
    onVisibilityChange: setControlledVisible,
  });

  const transitions = useTransition(controlledVisible, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return (
    <div className="App">
      <h1>react-popper-tooltip</h1>
      <p>
        A show/hide animation example using{' '}
        <a href="https://www.react-spring.io/">react-spring</a> library.
      </p>

      <button type="button" ref={setTriggerRef}>
        Trigger element
      </button>

      {transitions.map(
        ({ item, key, props }) =>
          item && (
            <animated.div
              key={key}
              ref={setTooltipRef}
              {...getTooltipProps({
                className: 'tooltip-container',
                style: props,
              })}
            >
              Tooltip element
              <div {...getArrowProps({ className: 'tooltip-arrow' })} />
            </animated.div>
          )
      )}
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
