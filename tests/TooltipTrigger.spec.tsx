import React from 'react';
import {fireEvent, render} from '@testing-library/react';
import TooltipTrigger from '../src';

interface BasicTooltipTriggerProps {
  tooltip: React.ReactNode;
  children: React.ReactNode;
  hideArrow?: boolean;
  [key: string]: any;
}

const BasicTooltipTrigger = ({
  tooltip,
  children,
  hideArrow,
  ...props
}: BasicTooltipTriggerProps) => (
  <TooltipTrigger
    {...props}
    tooltip={({
      arrowRef,
      tooltipRef,
      getArrowProps,
      getTooltipProps,
      placement
    }) => (
      <div
        {...getTooltipProps({ref: tooltipRef, className: 'tooltip-container'})}
      >
        {!hideArrow && (
          <div
            {...getArrowProps({
              className: 'tooltip-arrow',
              'data-placement': placement,
              ref: arrowRef
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
const Outside = 'Outside';

window.MutationObserver = class {
  public disconnect() {}
  public observe() {}
};

jest.useFakeTimers();

it('matches snapshot', () => {
  render(
    <BasicTooltipTrigger defaultTooltipShown tooltip={Tooltip}>
      {Trigger}
    </BasicTooltipTrigger>
  );
  expect(document.body).toMatchSnapshot();
});

describe('hover trigger', () => {
  let container: HTMLElement;
  let queryByText: any;

  beforeEach(() => {
    ({container, queryByText} = render(
      <BasicTooltipTrigger tooltip={Tooltip}>{Trigger}</BasicTooltipTrigger>
    ));
    fireEvent.mouseEnter(container.firstChild as HTMLElement);
    jest.runAllTimers();
  });

  it('opens tooltip on mouseEnter', () => {
    expect(queryByText(Tooltip)).toBeTruthy();
  });

  it('closes tooltip on mouseLeave', () => {
    fireEvent.mouseLeave(container.firstChild as HTMLElement);
    jest.runAllTimers();
    expect(queryByText(Tooltip)).toBeFalsy();
  });

  it('retains tooltip after hovering into it', () => {
    fireEvent.mouseLeave(container.firstChild as HTMLElement);
    fireEvent.mouseEnter(queryByText(Tooltip));
    jest.runAllTimers();
    expect(queryByText(Tooltip)).toBeTruthy();
  });
});

describe('click trigger', () => {
  let container: HTMLElement;
  let queryByText: any;

  beforeEach(() => {
    ({container, queryByText} = render(
      <BasicTooltipTrigger trigger="click" tooltip={Tooltip}>
        {Trigger}
      </BasicTooltipTrigger>
    ));
    fireEvent.click(container.firstChild as HTMLElement);
    jest.runAllTimers();
  });

  it('opens tooltip on click', () => {
    expect(queryByText(Tooltip)).toBeTruthy();
  });

  it('closes tooltip on click', () => {
    fireEvent.click(container.firstChild as HTMLElement);
    jest.runAllTimers();
    expect(queryByText(Tooltip)).toBeFalsy();
  });
});

describe('right-click trigger', () => {
  let container: HTMLElement;
  let queryByText: any;

  beforeEach(() => {
    ({container, queryByText} = render(
      <BasicTooltipTrigger trigger="right-click" tooltip={Tooltip}>
        {Trigger}
      </BasicTooltipTrigger>
    ));
    fireEvent.contextMenu(container.firstChild as HTMLElement);
    jest.runAllTimers();
  });

  it('opens tooltip on rightClick', () => {
    expect(queryByText(Tooltip)).toBeTruthy();
  });

  it('closes tooltip on rightClick', () => {
    fireEvent.contextMenu(container.firstChild as HTMLElement);
    jest.runAllTimers();
    expect(queryByText(Tooltip)).toBeFalsy();
  });

  it('closes tooltip on click', () => {
    fireEvent.click(container.firstChild as HTMLElement);
    jest.runAllTimers();
    expect(queryByText(Tooltip)).toBeFalsy();
  });
});

describe('follow cursor', () => {
  let container: HTMLElement;
  let queryByText: any;

  beforeEach(() => {
    ({container, queryByText} = render(
      <BasicTooltipTrigger followCursor tooltip={Tooltip}>
        {Trigger}
      </BasicTooltipTrigger>
    ));
    fireEvent.mouseMove(container.firstChild as HTMLElement);
    jest.runAllTimers();
  });

  it('opens tooltip on mouseMove', () => {
    expect(queryByText(Tooltip)).toBeTruthy();
  });

  it('closes tooltip on mouseLeave', () => {
    fireEvent.mouseLeave(container.firstChild as HTMLElement);
    jest.runAllTimers();
    expect(queryByText(Tooltip)).toBeFalsy();
  });
});

describe('focus trigger', () => {
  let container: HTMLElement;
  let queryByText: any;

  beforeEach(() => {
    ({container, queryByText} = render(
      <BasicTooltipTrigger trigger="focus" tooltip={Tooltip}>
        {Trigger}
      </BasicTooltipTrigger>
    ));
    fireEvent.focus(container.firstChild as HTMLElement);
    jest.runAllTimers();
  });

  it('opens tooltip on focus', () => {
    expect(queryByText(Tooltip)).toBeTruthy();
  });

  it('closes tooltip on blur', () => {
    fireEvent.blur(container.firstChild as HTMLElement);
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
      <div>{Outside}</div>
    </>
  );

  fireEvent.click(container.firstChild as HTMLElement);
  jest.runAllTimers();

  fireEvent.click(queryByText(Outside)!);
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
      fireEvent.click(queryByText(Trigger)!);
      jest.runAllTimers();
      fireEvent.click(queryByText(Trigger2)!);
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
      fireEvent.mouseEnter(queryByText(Trigger)!);
      jest.runAllTimers();
      fireEvent.mouseEnter(queryByText(Trigger2)!);
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
      fireEvent.click(queryByText(Trigger)!);
      jest.runAllTimers();
      fireEvent.click(queryByText(Trigger2)!);
      jest.runAllTimers();
      fireEvent.click(queryByText(Trigger2)!);
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
      fireEvent.mouseEnter(queryByText(Trigger)!);
      jest.runAllTimers();
      fireEvent.mouseEnter(queryByText(Trigger2)!);
      jest.runAllTimers();
      fireEvent.mouseLeave(queryByText(Trigger2)!);
      fireEvent.mouseEnter(queryByText(Trigger)!);
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
          <div>{Outside}</div>
        </>
      );
      fireEvent.click(queryByText(Trigger)!);
      jest.runAllTimers();
      fireEvent.click(queryByText(Trigger2)!);
      jest.runAllTimers();
      fireEvent.click(queryByText(Outside)!);
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
      fireEvent.mouseEnter(queryByText(Trigger)!);
      jest.runAllTimers();
      fireEvent.mouseEnter(queryByText(Trigger2)!);
      jest.runAllTimers();
      fireEvent.mouseOut(queryByText(Trigger)!);
      jest.runAllTimers();
      expect(queryByText(Tooltip)).toBeFalsy();
      expect(queryByText(Trigger2)).toBeFalsy();
    });
  });
});
