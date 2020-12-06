import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePopperTooltip } from '../src';

const TriggerText = 'Trigger element';
const TooltipText = 'Tooltip element';

function Tooltip() {
  const {
    getArrowProps,
    getTooltipProps,
    setArrowRef,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip();

  return (
    <>
      <button type="button" ref={setTriggerRef}>
        {TriggerText}
      </button>

      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({ className: 'tooltip-container' })}
        >
          {TooltipText}
          <div
            ref={setArrowRef}
            {...getArrowProps({ className: 'tooltip-arrow' })}
          />
        </div>
      )}
    </>
  );
}
//
// beforeEach(() => {
//   jest.useFakeTimers()
// })
//
// afterEach(() => {
//   jest.runOnlyPendingTimers()
//   jest.useRealTimers()
// })

test('Renders tooltip', async () => {
  render(<Tooltip />);

  //const submitButton = screen.queryByText(TooltipText)
  //expect(submitButton).not.toBeInTheDocument()
  expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();
  userEvent.hover(screen.getByText(TriggerText));

  expect(await screen.findByText(TooltipText)).toBeInTheDocument();
  //userEvent.unhover(screen.getByText(TriggerText));
  //expect(await screen.findByText(TooltipText)).not.toBeInTheDocument();
});
