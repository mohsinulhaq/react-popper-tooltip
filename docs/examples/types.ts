import React from 'react';

export interface BasicTooltipTriggerProps {
  tooltip: React.ReactNode;
  children: React.ReactNode;
  hideArrow?: boolean;
  [key: string]: any;
}

export interface StateContainerProps {
  children: ({
    on,
    set,
    toggle
  }: {
    on: boolean;
    set: (on: boolean) => void;
    toggle: () => void;
  }) => React.ReactNode;
}

export interface StateContainerState {
  on: boolean;
}
