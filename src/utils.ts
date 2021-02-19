import * as React from 'react';

// kudos to @tannerlinsley https://twitter.com/tannerlinsley
export function useGetLatest<T>(val: T) {
  const ref = React.useRef<T>(val);
  ref.current = val;
  return React.useCallback(() => ref.current, []);
}

const noop = () => {
  // do nothing
};

export function useControlledState<T>({
  initial,
  value,
  onChange = noop,
}: {
  initial?: T;
  value?: T;
  onChange?: (state: T) => void;
}): [T, (state: T) => void] {
  if (initial === undefined && value === undefined) {
    throw new TypeError(
      'Either "value" or "initial" variable must be set. Now both are undefined'
    );
  }

  const [state, setState] = React.useState(initial);

  const getLatest = useGetLatest(state);

  const set = React.useCallback(
    (updater: T) => {
      const state = getLatest();

      const updatedState =
        typeof updater === 'function' ? updater(state) : updater;

      if (typeof updatedState.persist === 'function') updatedState.persist();

      setState(updatedState);
      if (typeof onChange === 'function') onChange(updatedState);
    },
    [getLatest, onChange]
  );

  const isControlled = value !== undefined;

  return [isControlled ? value! : state!, isControlled ? onChange : set];
}

export function generateBoundingClientRect(x = 0, y = 0) {
  return () => ({
    width: 0,
    height: 0,
    top: y,
    right: x,
    bottom: y,
    left: x,
  });
}

// pageX cannot be supplied in the tests, so we fallback to clientX
// @see https://github.com/testing-library/dom-testing-library/issues/144
const mouseOutsideRect = (
  { clientX, clientY }: MouseEvent,
  { bottom, left, right, top }: DOMRect
) =>
  // DOMRect contains fractional pixel values but MouseEvent reports integers,
  // so we round DOMRect boundaries to make DOMRect slightly bigger
  clientX < Math.floor(left) ||
  clientX > Math.ceil(right) ||
  clientY < Math.floor(top) ||
  clientY > Math.ceil(bottom);

/**
 * Checks if mouseevent is triggered outside triggerRef and tooltipRef.
 * Counts with potential offset between them.
 * @param {MouseEvent} mouseEvent
 * @param {HTMLElement} triggerRef
 * @param {HTMLElement} tooltipRef - provide only when prop `interactive` is on
 */
export function isMouseOutside(
  mouseEvent: MouseEvent,
  triggerRef: HTMLElement,
  tooltipRef?: HTMLElement | false | null
): boolean {
  const triggerRect = triggerRef.getBoundingClientRect();
  if (!tooltipRef) return mouseOutsideRect(mouseEvent, triggerRect);
  const tooltipRect = tooltipRef.getBoundingClientRect();
  // triggerRect extended to the tooltipRect boundary, thus will contain cursor
  // moving from triggerRect to tooltipRect over some non zero offset.
  const triggerRectExtendedToTooltip = {
    bottom: Math.max(triggerRect.bottom, tooltipRect.top),
    left: Math.min(triggerRect.left, tooltipRect.right),
    right: Math.max(triggerRect.right, tooltipRect.left),
    top: Math.min(triggerRect.top, tooltipRect.bottom),
  };
  return (
    mouseOutsideRect(mouseEvent, triggerRectExtendedToTooltip as DOMRect) &&
    mouseOutsideRect(mouseEvent, tooltipRect)
  );
}
