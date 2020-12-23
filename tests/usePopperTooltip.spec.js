import * as React from 'react';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePopperTooltip } from '../src';

const TriggerText = 'Trigger';
const TooltipText = 'Tooltip';

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
          <div
            ref={setArrowRef}
            {...getArrowProps({ className: 'tooltip-arrow' })}
          />
          {TooltipText}
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

    render(<Tooltip options={{ trigger: null }} />);

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

test('closeOnClickOutside removes tooltip on document.body click', async () => {
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

test('delayShow option renders tooltip after specified delay', async () => {
  jest.useFakeTimers();
  render(<Tooltip options={{ delayShow: 5000 }} />);

  userEvent.hover(screen.getByText(TriggerText));
  // Nothing after a 2000ms
  jest.advanceTimersByTime(2000);
  expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();

  // It shows up somewhen after. Here RTL uses fake timers to await as well, so
  // it awaits for the element infinitely, advancing jest fake timer by 50ms
  // in an endless loop. And this is why the test passes even if delayShow set
  // a way bigger than a default timeout of 1000ms would allow.
  expect(await screen.findByText(TooltipText)).toBeInTheDocument();

  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test('delayHide option removes tooltip after specified delay', async () => {
  jest.useFakeTimers();
  render(<Tooltip options={{ delayHide: 5000 }} />);

  userEvent.hover(screen.getByText(TriggerText));
  act(() => jest.runAllTimers());
  expect(await screen.findByText(TooltipText)).toBeInTheDocument();

  userEvent.unhover(screen.getByText(TriggerText));
  // Still present after 2000ms
  act(() => jest.advanceTimersByTime(2000));
  expect(screen.getByText(TooltipText)).toBeInTheDocument();

  // Removed somewhen after
  await waitFor(() => {
    expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();
  });

  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe('defaultVisible option', () => {
  test('with false value renders nothing', async () => {
    render(<Tooltip options={{ defaultVisible: false }} />);
    expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();
  });

  test('with true value renders tooltip', async () => {
    render(<Tooltip options={{ defaultVisible: true }} />);
    expect(await screen.findByText(TooltipText)).toBeInTheDocument();
  });
});

test('onVisibleChange option called when state changes', async () => {
  const onVisibleChange = jest.fn();
  render(<Tooltip options={{ onVisibleChange }} />);

  // By default not visible, change visible to true when first time hover
  userEvent.hover(screen.getByText(TriggerText));
  expect(await screen.findByText(TooltipText)).toBeInTheDocument();
  expect(onVisibleChange).toHaveBeenLastCalledWith(true);

  // Now visible, change visible to false when unhover
  userEvent.unhover(screen.getByText(TriggerText));
  await waitFor(() => {
    expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();
  });
  expect(onVisibleChange).toHaveBeenLastCalledWith(false);
  expect(onVisibleChange).toHaveBeenCalledTimes(2);
});

describe('visible option controls the state and', () => {
  test('with false value renders nothing', async () => {
    jest.useFakeTimers();
    render(<Tooltip options={{ visible: false, trigger: 'click' }} />);
    expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();

    // The state is controlled, click doesn't change it
    userEvent.click(screen.getByText(TriggerText));
    act(() => jest.runAllTimers());
    expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();

    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('with true value renders tooltip', async () => {
    jest.useFakeTimers();

    render(<Tooltip options={{ visible: true, trigger: 'click' }} />);
    expect(await screen.findByText(TooltipText)).toBeInTheDocument();

    // The state is controlled, click doesn't change it
    userEvent.click(screen.getByText(TriggerText));
    act(() => jest.runAllTimers());
    expect(await screen.findByText(TooltipText)).toBeInTheDocument();

    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
});
