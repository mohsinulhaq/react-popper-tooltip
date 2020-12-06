import * as React from 'react';
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
    state,
  } = usePopperTooltip({
    trigger: 'click',
    visible: controlledVisible,
    onVisibleChange: setControlledVisible,
  });

  const isReferenceHidden = state?.modifiersData?.hide?.isReferenceHidden;

  React.useEffect(() => {
    if (isReferenceHidden) setControlledVisible(false);
  }, [setControlledVisible, isReferenceHidden]);

  return (
    <div className="App" style={{ height: '150vh' }}>
      <h1>react-popper-tooltip</h1>
      <p>
        Open the tooltip, then scroll the page down. The tooltip is closed and dismounted from the DOM when the
        trigger element gets out of the viewport.
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
