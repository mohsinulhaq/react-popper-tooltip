import React from "react";

const noop = Object.freeze(function() {});

// kudos to @tannerlinsley https://twitter.com/tannerlinsley
export function useGetLatest(val) {
  const ref = React.useRef(val);
  ref.current = val;
  return React.useCallback(() => ref.current, []);
}

export function useControlledProp({ initial, value, onChange = noop }) {
  const [state, setState] = React.useState(initial);

  const getLatest = useGetLatest(state);

  const set = React.useCallback(
    updater => {
      const state = getLatest();
      const updatedState =
        typeof updater === "function" ? updater(state.current) : updater;

      if (typeof updatedState.persist === "function") updatedState.persist();

      setState(updatedState);
      onChange(updatedState);
    },
    [getLatest, onChange]
  );

  const isControlled = value !== undefined;

  return [
    isControlled ? value : state,
    isControlled ? onChange : set,
  ];
}
