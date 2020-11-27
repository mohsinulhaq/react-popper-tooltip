import * as React from 'react';
import ReactDOM from 'react-dom';
import 'react-popper-tooltip/src/styles.css';
import { usePopperTooltip } from 'react-popper-tooltip';

function App() {
  return <Example />;
}

function Example() {
  const store = React.useRef();

  const {
    triggerRef,
    tooltipRef,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
    update,
  } = usePopperTooltip();

  React.useEffect(() => {
    if (triggerRef == null) return;

    const tooltipRect = tooltipRef?.getBoundingClientRect() || {};

    function storeMousePosition({ pageX, pageY }) {
      store.current = { pageX, pageY, ...tooltipRect };
      if (update !== null) update();
    }

    triggerRef.addEventListener('mousemove', storeMousePosition);
    return () =>
      triggerRef.removeEventListener('mousemove', storeMousePosition);
    // eslint-disable-next-line
  }, [triggerRef, update]);

  function getTransform() {
    if (tooltipRef && store.current) {
      const { pageX, pageY, width, height } = store.current;

      const x =
        pageX + width > window.pageXOffset + document.body.offsetWidth
          ? pageX - width
          : pageX;
      const y =
        pageY + height > window.pageYOffset + document.body.offsetHeight
          ? pageY - height
          : pageY;
      return `translate3d(${x + 10}px, ${y + 10}px, 0`;
    }
  }

  return (
    <div className="App">
      <h1>react-popper-tooltip</h1>
      <p>Tooltip follows a cursor</p>

      <button
        type="button"
        ref={setTriggerRef}
        style={{ width: '200px', height: '200px' }}
      >
        Reference element
      </button>

      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({
            className: 'tooltip-container',
            style: { transform: getTransform() },
          })}
        >
          Popper element
        </div>
      )}
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
