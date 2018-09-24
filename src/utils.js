import React from 'react';

export const TooltipContext = React.createContext({});

export const callAll = (...fns) => (...args) =>
  fns.forEach(fn => fn && fn(...args));

export const noop = () => {};
