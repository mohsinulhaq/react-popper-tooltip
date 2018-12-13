import React from 'react';
import {render, fireEvent, cleanup} from 'react-testing-library';
import TooltipTrigger from '../src';

const Tooltip = ({getTooltipProps, getArrowProps, tooltipRef, arrowRef}) => (
  <div {...getTooltipProps({ref: tooltipRef})}>
    <div {...getArrowProps({ref: arrowRef})} />
    <div>Tooltip</div>
  </div>
);

const Trigger = ({getTriggerProps, triggerRef}) => (
  <span {...getTriggerProps({ref: triggerRef})}>Trigger</span>
);

window.MutationObserver = class {
  disconnect() {}
  observe() {}
};

jest.useFakeTimers();
afterEach(cleanup);

it('matches snapshot', () => {
  const {container} = render(
    <TooltipTrigger tooltip={Tooltip}>{Trigger}</TooltipTrigger>
  );
  expect(container.firstChild).toMatchSnapshot();
});

describe('hover trigger', () => {
  let container, queryByText;

  beforeEach(() => {
    ({container, queryByText} = render(
      <TooltipTrigger tooltip={Tooltip}>{Trigger}</TooltipTrigger>
    ));
    fireEvent.mouseEnter(container.firstChild);
    jest.runAllTimers();
  });

  it('opens tooltip on mouseEnter', () => {
    expect(queryByText('Tooltip')).toBeTruthy();
  });

  it('closes tooltip on mouseLeave', () => {
    fireEvent.mouseLeave(container.firstChild);
    jest.runAllTimers();
    expect(queryByText('Tooltip')).toBeFalsy();
  });
});

describe('click trigger', () => {
  let container, queryByText;

  beforeEach(() => {
    ({container, queryByText} = render(
      <TooltipTrigger trigger="click" tooltip={Tooltip}>
        {Trigger}
      </TooltipTrigger>
    ));
    fireEvent.click(container.firstChild);
    jest.runAllTimers();
  });

  it('opens tooltip on click', () => {
    expect(queryByText('Tooltip')).toBeTruthy();
  });

  it('closes tooltip on click', () => {
    fireEvent.click(container.firstChild);
    jest.runAllTimers();
    expect(queryByText('Tooltip')).toBeFalsy();
  });
});

describe('right-click trigger', () => {
  let container, queryByText;

  beforeEach(() => {
    ({container, queryByText} = render(
      <TooltipTrigger trigger="right-click" tooltip={Tooltip}>
        {Trigger}
      </TooltipTrigger>
    ));
    fireEvent.contextMenu(container.firstChild);
    jest.runAllTimers();
  });

  it('opens tooltip on rightClick', () => {
    expect(queryByText('Tooltip')).toBeTruthy();
  });

  it('closes tooltip on rightClick', () => {
    fireEvent.contextMenu(container.firstChild);
    jest.runAllTimers();
    expect(queryByText('Tooltip')).toBeFalsy();
  });

  it('closes tooltip on click', () => {
    fireEvent.click(container.firstChild);
    jest.runAllTimers();
    expect(queryByText('Tooltip')).toBeFalsy();
  });
});

describe('follow cursor', () => {
  let container, queryByText;

  beforeEach(() => {
    ({container, queryByText} = render(
      <TooltipTrigger followCursor tooltip={Tooltip}>
        {Trigger}
      </TooltipTrigger>
    ));
    fireEvent.mouseMove(container.firstChild);
    jest.runAllTimers();
  });

  it('opens tooltip on mouseMove', () => {
    expect(queryByText('Tooltip')).toBeTruthy();
  });

  it('closes tooltip on mouseLeave', () => {
    fireEvent.mouseLeave(container.firstChild);
    jest.runAllTimers();
    expect(queryByText('Tooltip')).toBeFalsy();
  });
});

it('closes on outside click', () => {
  const {container, queryByText} = render(
    <>
      <TooltipTrigger trigger="click" tooltip={Tooltip}>
        {Trigger}
      </TooltipTrigger>
      <div>Outside</div>
    </>
  );

  fireEvent.click(container.firstChild);
  jest.runAllTimers();

  fireEvent.click(queryByText('Outside'));
  jest.runAllTimers();

  expect(queryByText('Tooltip')).toBeFalsy();
});
