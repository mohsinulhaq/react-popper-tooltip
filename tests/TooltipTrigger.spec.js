import React from 'react';
import {cleanup, fireEvent, render} from 'react-testing-library';
import TooltipTrigger from '../src';

const BasicTooltipTrigger = ({tooltip, children, hideArrow, ...props}) => (
  <TooltipTrigger
    {...props}
    tooltip={({
      getArrowProps,
      getTooltipProps,
      arrowRef,
      tooltipRef,
      placement
    }) => (
      <div
        {...getTooltipProps({ref: tooltipRef, className: 'tooltip-container'})}
      >
        {!hideArrow && (
          <div
            {...getArrowProps({
              ref: arrowRef,
              className: 'tooltip-arrow',
              'data-placement': placement
            })}
          />
        )}
        {tooltip}
      </div>
    )}
  >
    {({getTriggerProps, triggerRef}) => (
      <span {...getTriggerProps({ref: triggerRef})}>{children}</span>
    )}
  </TooltipTrigger>
);

const Tooltip = 'Tooltip';
const Trigger = 'Trigger';
const Trigger2 = 'Trigger2';

window.MutationObserver = class {
  disconnect() {}
  observe() {}
};

jest.useFakeTimers();
afterEach(cleanup);

it('matches snapshot', () => {
  render(
    <BasicTooltipTrigger defaultTooltipShown tooltip={Tooltip}>
      {Trigger}
    </BasicTooltipTrigger>
  );
  expect(document.body).toMatchSnapshot();
});

describe('hover trigger', () => {
  let container, queryByText;

  beforeEach(() => {
    ({container, queryByText} = render(
      <BasicTooltipTrigger tooltip={Tooltip}>{Trigger}</BasicTooltipTrigger>
    ));
    fireEvent.mouseEnter(container.firstChild);
    jest.runAllTimers();
  });

  it('opens tooltip on mouseEnter', () => {
    expect(queryByText(Tooltip)).toBeTruthy();
  });

  it('closes tooltip on mouseLeave', () => {
    fireEvent.mouseLeave(container.firstChild);
    jest.runAllTimers();
    expect(queryByText(Tooltip)).toBeFalsy();
  });

  it('retains tooltip after hovering into it', () => {
    fireEvent.mouseLeave(container.firstChild);
    fireEvent.mouseEnter(queryByText(Tooltip));
    jest.runAllTimers();
    expect(queryByText(Tooltip)).toBeTruthy();
  });
});

describe('click trigger', () => {
  let container, queryByText;

  beforeEach(() => {
    ({container, queryByText} = render(
      <BasicTooltipTrigger trigger="click" tooltip={Tooltip}>
        {Trigger}
      </BasicTooltipTrigger>
    ));
    fireEvent.click(container.firstChild);
    jest.runAllTimers();
  });

  it('opens tooltip on click', () => {
    expect(queryByText(Tooltip)).toBeTruthy();
  });

  it('closes tooltip on click', () => {
    fireEvent.click(container.firstChild);
    jest.runAllTimers();
    expect(queryByText(Tooltip)).toBeFalsy();
  });
});

describe('right-click trigger', () => {
  let container, queryByText;

  beforeEach(() => {
    ({container, queryByText} = render(
      <BasicTooltipTrigger trigger="right-click" tooltip={Tooltip}>
        {Trigger}
      </BasicTooltipTrigger>
    ));
    fireEvent.contextMenu(container.firstChild);
    jest.runAllTimers();
  });

  it('opens tooltip on rightClick', () => {
    expect(queryByText(Tooltip)).toBeTruthy();
  });

  it('closes tooltip on rightClick', () => {
    fireEvent.contextMenu(container.firstChild);
    jest.runAllTimers();
    expect(queryByText(Tooltip)).toBeFalsy();
  });

  it('closes tooltip on click', () => {
    fireEvent.click(container.firstChild);
    jest.runAllTimers();
    expect(queryByText(Tooltip)).toBeFalsy();
  });
});

describe('follow cursor', () => {
  let container, queryByText;

  beforeEach(() => {
    ({container, queryByText} = render(
      <BasicTooltipTrigger followCursor tooltip={Tooltip}>
        {Trigger}
      </BasicTooltipTrigger>
    ));
    fireEvent.mouseMove(container.firstChild);
    jest.runAllTimers();
  });

  it('opens tooltip on mouseMove', () => {
    expect(queryByText(Tooltip)).toBeTruthy();
  });

  it('closes tooltip on mouseLeave', () => {
    fireEvent.mouseLeave(container.firstChild);
    jest.runAllTimers();
    expect(queryByText(Tooltip)).toBeFalsy();
  });
});

it('closes on outside click', () => {
  const {container, queryByText} = render(
    <>
      <BasicTooltipTrigger trigger="click" tooltip={Tooltip}>
        {Trigger}
      </BasicTooltipTrigger>
      <div>Outside</div>
    </>
  );

  fireEvent.click(container.firstChild);
  jest.runAllTimers();

  fireEvent.click(queryByText('Outside'));
  jest.runAllTimers();

  expect(queryByText(Tooltip)).toBeFalsy();
});

describe('nested tooltips', () => {
  describe('correct opening', () => {
    it('works for click trigger', () => {
      const {queryByText} = render(
        <BasicTooltipTrigger
          trigger="click"
          tooltip={
            <BasicTooltipTrigger trigger="click" tooltip={Tooltip}>
              {Trigger2}
            </BasicTooltipTrigger>
          }
        >
          {Trigger}
        </BasicTooltipTrigger>
      );
      fireEvent.click(queryByText(Trigger));
      jest.runAllTimers();
      fireEvent.click(queryByText(Trigger2));
      jest.runAllTimers();
      expect(queryByText(Tooltip)).toBeTruthy();
    });

    it('works for hover trigger', () => {
      const {queryByText} = render(
        <BasicTooltipTrigger
          tooltip={
            <BasicTooltipTrigger tooltip={Tooltip}>
              {Trigger2}
            </BasicTooltipTrigger>
          }
        >
          {Trigger}
        </BasicTooltipTrigger>
      );
      fireEvent.mouseEnter(queryByText(Trigger));
      jest.runAllTimers();
      fireEvent.mouseEnter(queryByText(Trigger2));
      jest.runAllTimers();
      expect(queryByText(Tooltip)).toBeTruthy();
    });
  });

  describe('partial closure of nested tooltips', () => {
    it('works for click trigger', () => {
      const {queryByText} = render(
        <BasicTooltipTrigger
          trigger="click"
          tooltip={
            <BasicTooltipTrigger trigger="click" tooltip={Tooltip}>
              {Trigger2}
            </BasicTooltipTrigger>
          }
        >
          {Trigger}
        </BasicTooltipTrigger>
      );
      fireEvent.click(queryByText(Trigger));
      jest.runAllTimers();
      fireEvent.click(queryByText(Trigger2));
      jest.runAllTimers();
      fireEvent.click(queryByText(Trigger2));
      jest.runAllTimers();
      expect(queryByText(Tooltip)).toBeFalsy();
      expect(queryByText(Trigger2)).toBeTruthy();
    });

    it('works for hover trigger', () => {
      const {queryByText} = render(
        <BasicTooltipTrigger
          tooltip={
            <BasicTooltipTrigger tooltip={Tooltip}>
              {Trigger2}
            </BasicTooltipTrigger>
          }
        >
          {Trigger}
        </BasicTooltipTrigger>
      );
      fireEvent.mouseEnter(queryByText(Trigger));
      jest.runAllTimers();
      fireEvent.mouseEnter(queryByText(Trigger2));
      jest.runAllTimers();
      fireEvent.mouseLeave(queryByText(Trigger2));
      fireEvent.mouseEnter(queryByText(Trigger));
      jest.runAllTimers();
      expect(queryByText(Tooltip)).toBeFalsy();
      expect(queryByText(Trigger2)).toBeTruthy();
    });
  });

  describe('complete closure of nested tooltips', () => {
    it('works for click trigger', () => {
      const {queryByText} = render(
        <>
          <BasicTooltipTrigger
            trigger="click"
            tooltip={
              <BasicTooltipTrigger trigger="click" tooltip={Tooltip}>
                {Trigger2}
              </BasicTooltipTrigger>
            }
          >
            {Trigger}
          </BasicTooltipTrigger>
          <div>Outside</div>
        </>
      );
      fireEvent.click(queryByText(Trigger));
      jest.runAllTimers();
      fireEvent.click(queryByText(Trigger2));
      jest.runAllTimers();
      fireEvent.click(queryByText('Outside'));
      jest.runAllTimers();
      expect(queryByText(Tooltip)).toBeFalsy();
      expect(queryByText(Trigger2)).toBeFalsy();
    });

    it('works for hover trigger', () => {
      const {queryByText} = render(
        <>
          <BasicTooltipTrigger
            tooltip={
              <BasicTooltipTrigger tooltip={Tooltip}>
                {Trigger2}
              </BasicTooltipTrigger>
            }
          >
            {Trigger}
          </BasicTooltipTrigger>
        </>
      );
      fireEvent.mouseEnter(queryByText(Trigger));
      jest.runAllTimers();
      fireEvent.mouseEnter(queryByText(Trigger2));
      jest.runAllTimers();
      fireEvent.mouseOut(queryByText(Trigger));
      jest.runAllTimers();
      expect(queryByText(Tooltip)).toBeFalsy();
      expect(queryByText(Trigger2)).toBeFalsy();
    });
  });
});
