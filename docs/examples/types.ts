import React from 'react';

export interface IBasicTooltipTriggerProps {
  tooltip: React.ReactNode;
  children: React.ReactNode;
  hideArrow?: boolean;
  [key: string]: any;
}

export interface IStateContainerProps {
  children: (
    {
      on,
      set,
      toggle
    }: {on: boolean; set: (on: boolean) => void; toggle: () => void}
  ) => React.ReactNode;
}

export interface IStateContainerState {
  on: boolean;
}
