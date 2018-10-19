import React from 'react';

export const TooltipContext = React.createContext({});

export const callAll = (...fns) => (...args) =>
  fns.forEach(fn => fn && fn(...args));

export const noop = () => {};

export const canUseDOM = () =>
  !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  );
