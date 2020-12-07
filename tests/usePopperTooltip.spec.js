import * as React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePopperTooltip } from '../src';

const TriggerText = 'Trigger element';
const TooltipText = 'Tooltip element';

function Tooltip({ options }) {
  const {
    getArrowProps,
    getTooltipProps,
    setArrowRef,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip(options);

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

describe('trigger option', () => {
  test('hover works', async () => {
    render(<Tooltip options={{ trigger: 'hover' }} />);

    // Initially there's no tooltip
    expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();

    // Show on hover
    userEvent.hover(screen.getByText(TriggerText));
    expect(await screen.findByText(TooltipText)).toBeInTheDocument();

    // Hide on unhover
    userEvent.unhover(screen.getByText(TriggerText));
    await waitFor(() => {
      expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();
    });
  });

  test('click works', async () => {
    render(<Tooltip options={{ trigger: 'click' }} />);

    // Initially there's no tooltip
    expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();

    // Show on click
    userEvent.click(screen.getByText(TriggerText));
    expect(await screen.findByText(TooltipText)).toBeInTheDocument();

    // Hide on click
    userEvent.click(screen.getByText(TriggerText));
    await waitFor(() => {
      expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();
    });
  });

  test('right-click works', async () => {
    render(<Tooltip options={{ trigger: 'right-click' }} />);

    // Initially there's no tooltip
    expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();

    // Show on right-click
    fireEvent.contextMenu(screen.getByText(TriggerText));
    expect(await screen.findByText(TooltipText)).toBeInTheDocument();

    // Hide on right-click
    fireEvent.contextMenu(screen.getByText(TriggerText));
    await waitFor(() => {
      expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();
    });
  });

  test('focus works', async () => {
    render(<Tooltip options={{ trigger: 'focus' }} />);

    // Initially there's no tooltip
    expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();

    // Show on focus
    fireEvent.focus(screen.getByText(TriggerText));
    expect(await screen.findByText(TooltipText)).toBeInTheDocument();

    // Hide on blur
    fireEvent.blur(screen.getByText(TriggerText));
    await waitFor(() => {
      expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();
    });
  });

  test('none works', async () => {
    jest.useFakeTimers();

    render(<Tooltip options={{ trigger: 'none' }} />);

    // Initially there's no tooltip
    expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();

    // Nothing after hover
    userEvent.hover(screen.getByText(TriggerText));
    jest.runAllTimers();
    expect(await screen.queryByText(TooltipText)).not.toBeInTheDocument();

    // Nothing after click
    userEvent.click(screen.getByText(TriggerText));
    jest.runAllTimers();
    expect(await screen.queryByText(TooltipText)).not.toBeInTheDocument();

    // Nothing after right-click
    fireEvent.contextMenu(screen.getByText(TriggerText));
    jest.runAllTimers();
    expect(await screen.queryByText(TooltipText)).not.toBeInTheDocument();

    // Nothing after focus
    fireEvent.focus(screen.getByText(TriggerText));
    jest.runAllTimers();
    expect(await screen.queryByText(TooltipText)).not.toBeInTheDocument();

    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
});
