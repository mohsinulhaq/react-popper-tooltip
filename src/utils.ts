import React from 'react';

export const TooltipContext = React.createContext({});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fn = (...args: any[]) => void;
type FnOrBool = undefined | Fn;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const callAll = (...fns: FnOrBool[]) => (...args: any[]) =>
  fns.forEach(fn => fn && fn(...args));

export const noop = () => {};

export const canUseDOM = () =>
  !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  );
