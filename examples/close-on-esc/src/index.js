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
    visible: controlledVisible,
    onVisibleChange: setControlledVisible,
  });

  React.useEffect(() => {
    const handleKeyDown = ({ key }) => {
      if (key === 'Escape') {
        setControlledVisible(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="App">
      <h1>react-popper-tooltip</h1>
      <p>
        This is an example of how to close the tooltip pressing the Esc button.
      </p>

      <button type="button" ref={setTriggerRef}>
        Trigger element
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
