import React from 'react';

export const TooltipContext = React.createContext({});

type Fn = (...args: any[]) => void;
type FnOrBool = undefined | Fn;

export const callAll = (...fns: FnOrBool[]) => (...args: any[]) =>
  fns.forEach(fn => fn && fn(...args));

export const noop = () => {};

export const canUseDOM = () =>
  !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  );
