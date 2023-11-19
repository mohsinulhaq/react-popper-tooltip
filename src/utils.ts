import {useRef, useCallback, useState} from 'react';

// kudos to @tannerlinsley https://twitter.com/tannerlinsley
export function useGetLatest<T>(val: T) {
  const ref = useRef<T>(val);
  ref.current = val;
  return useCallback(() => ref.current, []);
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
      'Either "value" or "initial" variable must be set. Now both are undefined',
    );
  }

  const [state, setState] = useState(initial);

  const getLatest = useGetLatest(state);

  const set = useCallback(
    (updater: T) => {
      const state = getLatest();

      const updatedState =
        typeof updater === 'function' ? updater(state) : updater;

      if (typeof updatedState.persist === 'function') updatedState.persist();

      setState(updatedState);
      if (typeof onChange === 'function') onChange(updatedState);
    },
    [getLatest, onChange],
  );

  const isControlled = value !== undefined;

  return [isControlled ? value! : state!, isControlled ? onChange : set];
}

export function generateBoundingClientRect(x = 0, y = 0): () => DOMRect {
  return () => ({
    width: 0,
    height: 0,
    top: y,
    right: x,
    bottom: y,
    left: x,
    x: 0,
    y: 0,
    toJSON: () => null,
  });
}
