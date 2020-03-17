import React from 'react';
import { Ref } from './types';

export const TooltipContext = React.createContext({});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fn = ((...args: any[]) => void) | undefined;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const callAll = (...fns: Fn[]) => (...args: any[]) =>
  fns.forEach(fn => fn && fn(...args));

export const noop = () => {
  // do nothing
};

export const canUseDOM = () =>
  !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  );

export const setRef = (ref: Ref, node: HTMLElement | null) => {
  if (typeof ref === 'function') {
    return ref(node);
  } else if (ref != null) {
    ref.current = node;
  }
};
