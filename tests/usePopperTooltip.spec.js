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
    expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();

    // Nothing after click
    userEvent.click(screen.getByText(TriggerText));
    jest.runAllTimers();
    expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();

    // Nothing after right-click
    fireEvent.contextMenu(screen.getByText(TriggerText));
    jest.runAllTimers();
    expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();

    // Nothing after focus
    fireEvent.focus(screen.getByText(TriggerText));
    jest.runAllTimers();
    expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();

    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('array of triggers works', async () => {
    render(<Tooltip options={{ trigger: ['click', 'hover'] }} />);
    // Initially there's no tooltip
    expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();

    // Show on hover
    userEvent.hover(screen.getByText(TriggerText));
    expect(await screen.findByText(TooltipText)).toBeInTheDocument();

    // Hide on click
    userEvent.click(screen.getByText(TriggerText));
    await waitFor(() => {
      expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();
    });
  });
});

test('closeOnClickOutside option works', async () => {
  render(<Tooltip options={{ closeOnClickOutside: true, trigger: 'click' }} />);

  // Show on click
  userEvent.click(screen.getByText(TriggerText));
  expect(await screen.findByText(TooltipText)).toBeInTheDocument();

  // Hide on body click
  userEvent.click(document.body);
  await waitFor(() => {
    expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();
  });
});

test('initialVisible option works', async () => {
  render(<Tooltip options={{ initialVisible: false }} />);
  expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();

  render(<Tooltip options={{ initialVisible: true }} />);
  expect(await screen.findByText(TooltipText)).toBeInTheDocument();
});

test('delayShow option works', async () => {
  jest.useFakeTimers();
  render(<Tooltip options={{ delayShow: 5000 }} />);

  userEvent.hover(screen.getByText(TriggerText));
  // Nothing after a 2000ms
  jest.advanceTimersByTime(2000);
  expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();

  // It shows up somewhen after. Here RTL uses fake timers to await as well, so
  // it awaits for the element infinitely, advancing jest fake timer by 50ms
  // in an endless loop. And this is why the test passes even if delayShow set
  // a way bigger than default timeout of 1000ms would allow.
  expect(await screen.findByText(TooltipText)).toBeInTheDocument();

  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});
