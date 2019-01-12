import PopperJS from 'popper.js';
import React from 'react';
import ReactPopper from 'react-popper';

export interface IGetTriggerPropsArg {
  onTouchEnd?(event: React.SyntheticEvent): void;
  onClick?(event: React.SyntheticEvent): void;
  onContextMenu?(event: React.SyntheticEvent): void;
  onMouseEnter?(event: React.SyntheticEvent): void;
  onMouseLeave?(event: React.SyntheticEvent): void;
  onMouseMove?(event: React.SyntheticEvent): void;
  [key: string]: any;
}

export interface IGetTooltipPropsArg {
  style?: React.CSSProperties;
  onMouseEnter?: (event: React.SyntheticEvent) => void;
  onMouseLeave?: (event: React.SyntheticEvent) => void;
  [key: string]: any;
}

export interface IGetArrowPropsArg {
  style?: React.CSSProperties;
  [key: string]: any;
}

export interface IChildrenArg {
  triggerRef: ReactPopper.RefHandler;
  getTriggerProps(arg?: IGetTriggerPropsArg): any;
}

export interface ITooltipArg {
  arrowRef: ReactPopper.RefHandler;
  tooltipRef: ReactPopper.RefHandler;
  placement: PopperJS.Placement;
  getArrowProps(arg?: IGetArrowPropsArg): IGetArrowPropsArg;
  getTooltipProps(arg?: IGetTooltipPropsArg): IGetTooltipPropsArg;
}

export interface ITooltipTriggerProps {
  /**
   * whether to close the tooltip when it's trigger is out of the boundary
   * @default true
   */
  closeOnOutOfBoundaries: boolean;
  /**
   * whether tooltip is shown by default
   * @default false
   */
  defaultTooltipShown: boolean;
  /**
   * delay in hiding the tooltip
   * @default 0
   */
  delayHide: number;
  /**
   * delay in showing the tooltip
   * @default 0
   */
  delayShow: number;
  /**
   * whether to make the tooltip spawn at cursor position
   * @default false
   */
  followCursor: boolean;
  /**
   * function that can be used to obtain a tooltip element reference
   */
  getTooltipRef?: ReactPopper.RefHandler;
  /**
   * function that can be used to obtain a trigger element reference
   */
  getTriggerRef?: ReactPopper.RefHandler;
  /**
   * modifiers passed directly to the underlying popper.js instance
   * For more information, refer to Popper.js’ modifier docs:
   * @link https://popper.js.org/popper-documentation.html#modifiers
   */
  modifiers?: PopperJS.Modifiers;
  /**
   * Popper’s placement. Valid placements are:
   *  - auto
   *  - top
   *  - right
   *  - bottom
   *  - left
   * Each placement can have a variation from this list:
   *  -start
   *  -end
   *  @default right
   */
  placement: PopperJS.Placement;
  /**
   * element to be used as portal container
   * @default document.body
   */
  portalContainer: HTMLElement;
  /**
   * use to create controlled tooltip
   */
  tooltipShown?: boolean;
  /**
   * the event that triggers the tooltip
   * @default hover
   */
  trigger: 'none' | 'click' | 'right-click' | 'hover';
  /**
   * whether to use React.createPortal for creating tooltip
   */
  usePortal: boolean;
  /**
   * trigger
   */
  children(arg: IChildrenArg): React.ReactNode;
  /**
   * сalled when the visibility of the tooltip changes
   * @default noop
   */
  onVisibilityChange(tooltipShown: boolean): void;
  /**
   * tooltip
   */
  tooltip(arg: ITooltipArg): React.ReactNode;
}

export interface ITooltipTriggerState {
  pageX?: number;
  pageY?: number;
  tooltipShown: boolean;
}

export interface ITooltipProps {
  arrowProps: ReactPopper.PopperArrowProps;
  closeOnOutOfBoundaries: boolean;
  innerRef: ReactPopper.RefHandler;
  outOfBoundaries: boolean | null;
  placement: PopperJS.Placement;
  style: React.CSSProperties;
  trigger: 'none' | 'click' | 'right-click' | 'hover';
  addParentOutsideClickHandler(): void;
  addParentOutsideRightClickHandler(): void;
  clearScheduled(): void;
  hideTooltip(): void;
  parentOutsideClickHandler(arg: Event): void;
  parentOutsideRightClickHandler(arg: Event): void;
  removeParentOutsideRightClickHandler(): void;
  removeParentOutsideClickHandler(): void;
  tooltip(arg: ITooltipArg): React.ReactNode;
  scheduleUpdate(): void;
}
