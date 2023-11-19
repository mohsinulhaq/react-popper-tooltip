import '@testing-library/jest-dom/vitest';
import {beforeEach, afterEach, describe, test, vi, expect} from 'vitest';
import {render, screen, waitFor, fireEvent} from '@testing-library/react';
import {userEvent} from '@testing-library/user-event';
import {usePopperTooltip, Config} from '../src/main.js';

const TriggerText = 'Trigger';
const TooltipText = 'Tooltip';

function Tooltip({options}: {options: Config}) {
  const {
    setTriggerRef,
    setTooltipRef,
    getArrowProps,
    getTooltipProps,
    visible,
  } = usePopperTooltip(options);

  return (
    <>
      <button ref={setTriggerRef}>{TriggerText}</button>

      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps()}
        >
          <div {...getArrowProps()} />
          {TooltipText}
        </div>
      )}
    </>
  );
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(async () => {
  await vi.runOnlyPendingTimersAsync();
  vi.useRealTimers();
});

const user = userEvent.setup({
  advanceTimers: vi.advanceTimersByTime,
});

describe('trigger option', () => {
  test('hover trigger', async () => {
    render(<Tooltip options={{trigger: 'hover'}} />);

    // tooltip not visible initially
    expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();

    // tooltip shown on hover in
    user.hover(screen.getByText(TriggerText));
    expect(await screen.findByText(TooltipText)).toBeInTheDocument();

    // tooltip hidden on hover out
    user.unhover(screen.getByText(TriggerText));
    await waitFor(() => {
      expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();
    });
  });

  test('click trigger', async () => {
    render(<Tooltip options={{trigger: 'click'}} />);

    // tooltip not visible initially
    expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();

    // tooltip shown on click
    user.click(screen.getByText(TriggerText));
    expect(await screen.findByText(TooltipText)).toBeInTheDocument();

    // tooltip hidden on click
    user.click(screen.getByText(TriggerText));
    await waitFor(() => {
      expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();
    });
  });

  test('right-click trigger', async () => {
    render(<Tooltip options={{trigger: 'right-click'}} />);

    // tooltip not visible initially
    expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();

    // tooltip shown on right-click
    user.pointer({
      keys: '[MouseRight>]',
      target: screen.getByText(TriggerText),
    });
    expect(await screen.findByText(TooltipText)).toBeInTheDocument();

    // tooltip hidden on right-click
    user.pointer({
      keys: '[MouseRight>]',
      target: screen.getByText(TriggerText),
    });
    await waitFor(() => {
      expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();
    });
  });

  test('focus trigger', async () => {
    render(<Tooltip options={{trigger: 'focus'}} />);

    // tooltip not visible initially
    expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();

    // tooltip shown on focus
    user.tab();
    expect(await screen.findByText(TooltipText)).toBeInTheDocument();

    // tooltip hidden on blur
    user.tab();
    await waitFor(() => {
      expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();
    });
  });

  test('trigger array', async () => {
    render(<Tooltip options={{trigger: ['click', 'hover']}} />);

    // tooltip not visible initially
    expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();

    // tooltip shown on hover
    user.hover(screen.getByText(TriggerText));
    expect(await screen.findByText(TooltipText)).toBeInTheDocument();

    // tooltip hidden on click
    user.click(screen.getByText(TriggerText));
    await waitFor(() => {
      expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();
    });
  });

  test('null trigger', async () => {
    render(<Tooltip options={{trigger: null}} />);

    // tooltip not visible initially
    expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();

    // Nothing after hover
    user.hover(screen.getByText(TriggerText));
    vi.runAllTimers();
    expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();

    // Nothing after click
    user.click(screen.getByText(TriggerText));
    vi.runAllTimers();
    expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();

    // Nothing after right-click
    fireEvent.contextMenu(screen.getByText(TriggerText));
    vi.runAllTimers();
    expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();

    // Nothing after focus
    fireEvent.focus(screen.getByText(TriggerText));
    vi.runAllTimers();
    expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();
  });
});

test('closeOnOutsideClick removes tooltip on document.body click', async () => {
  render(<Tooltip options={{trigger: 'click'}} />);

  // Show on click
  user.click(screen.getByText(TriggerText));
  expect(await screen.findByText(TooltipText)).toBeInTheDocument();

  // Hide on body click
  user.click(document.body);
  await waitFor(() => {
    expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();
  });
});

test("closeOnOutsideClick doesn't remove tooltip on tooltip click", async () => {
  render(<Tooltip options={{trigger: 'click'}} />);

  // Show on click
  user.click(screen.getByText(TriggerText));
  expect(await screen.findByText(TooltipText)).toBeInTheDocument();

  user.click(screen.getByText(TooltipText));
  await waitFor(() => {
    expect(screen.queryByText(TooltipText)).toBeInTheDocument();
  });
});

test('delayShow option renders tooltip after specified delay', async () => {
  render(<Tooltip options={{delayShow: 5000}} />);

  user.hover(screen.getByText(TriggerText));
  // Nothing after a 2000ms
  await vi.advanceTimersByTimeAsync(2000);
  expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();

  await vi.runAllTimersAsync();
  screen.debug();
  // It shows up sometime later. Here RTL uses fake timers to await as well, so
  // it awaits for the element infinitely, advancing jest fake timer by 50ms
  // in an endless loop. And this is why the test passes even if delayShow set
  // a way bigger than a default timeout of 1000ms would allow.
  expect(await screen.findByText(TooltipText)).toBeInTheDocument();
});

test('delayHide option removes tooltip after specified delay', async () => {
  render(<Tooltip options={{delayHide: 5000}} />);

  user.hover(screen.getByText(TriggerText));
  await vi.runAllTimersAsync();
  expect(await screen.findByText(TooltipText)).toBeInTheDocument();

  user.unhover(screen.getByText(TriggerText));
  // Still present after 2000ms
  await vi.advanceTimersByTimeAsync(2000);
  expect(screen.getByText(TooltipText)).toBeInTheDocument();
  await vi.runAllTimersAsync();
  // Removed some time later
  expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();
});

describe('defaultVisible option', () => {
  test('with false value renders nothing', async () => {
    render(<Tooltip options={{defaultVisible: false}} />);
    expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();
  });

  test('with true value renders tooltip', async () => {
    render(<Tooltip options={{defaultVisible: true}} />);
    expect(await screen.findByText(TooltipText)).toBeInTheDocument();
  });
});

test('onVisibleChange option called when state changes', async () => {
  const onVisibleChange = vi.fn();
  render(<Tooltip options={{onVisibleChange}} />);

  // By default not visible, change visible to true when first time hover
  user.hover(screen.getByText(TriggerText));
  expect(await screen.findByText(TooltipText)).toBeInTheDocument();
  expect(onVisibleChange).toHaveBeenLastCalledWith(true);

  // Now visible, change visible to false when unhover
  user.unhover(screen.getByText(TriggerText));
  await waitFor(() => {
    expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();
  });
  expect(onVisibleChange).toHaveBeenLastCalledWith(false);
  expect(onVisibleChange).toHaveBeenCalledTimes(2);
});

describe('visible option controls the state and', () => {
  test('with false value renders nothing', async () => {
    render(<Tooltip options={{visible: false, trigger: 'click'}} />);
    expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();

    // The state is controlled, click doesn't change it
    user.click(screen.getByText(TriggerText));
    vi.runAllTimers();
    expect(screen.queryByText(TooltipText)).not.toBeInTheDocument();
  });

  test('with true value renders tooltip', async () => {
    render(<Tooltip options={{visible: true, trigger: 'click'}} />);
    expect(await screen.findByText(TooltipText)).toBeInTheDocument();

    // The state is controlled, click doesn't change it
    user.click(screen.getByText(TriggerText));
    vi.runAllTimers();
    expect(await screen.findByText(TooltipText)).toBeInTheDocument();
  });
});
