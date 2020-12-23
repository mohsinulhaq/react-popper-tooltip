import * as React from 'react';

// kudos to @tannerlinsley https://twitter.com/tannerlinsley
export function useGetLatest<T>(val: T) {
  const ref = React.useRef<T>(val);
  ref.current = val;
  return React.useCallback(() => ref.current, []);
}

export const noop = () => {
  // do nothing
};

export const canUseDOM = Boolean(
  typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
);

export function useControlledProp<T>({
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
export function renameWarning<T>(
  prop: T,
  oldName: string,
  newName: string
): void {
  if (process.env.NODE_ENV !== 'production' && prop !== undefined) {
    console.warn(
      `react-popper-tooltip: "${oldName}" prop was renamed and will be removed in the next major version. Use "${newName}" instead.`
    );
  }
}

export function removeWarning<T>(prop: T, name: string): void {
  if (process.env.NODE_ENV !== 'production' && prop !== undefined) {
    console.error(
      `react-popper-tooltip: "${name}" prop is no longer supported. See the migration guide on https://github.com/mohsinulhaq/react-popper-tooltip`
    );
  }
}
