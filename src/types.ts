import * as React from 'react';
import { Modifier } from 'react-popper';
import * as PopperJS from '@popperjs/core';

export type TriggerType = 'none' | 'click' | 'right-click' | 'hover' | 'focus';

export type ConfigProps = {
  /**
   * Event or events that trigger the tooltip
   * @default hover
   */
  trigger?: TriggerType | TriggerType[];
  /**
   * Delay in hiding the tooltip (ms)
   * @default 0
   */
  delayHide?: number;
  /**
   * Delay in showing the tooltip (ms)
   * @default 0
   */
  delayShow?: number;
  /**
   * Options to MutationObserver, used internally for updating
   * tooltip position based on its DOM changes
   * @default  { attributes: true, childList: true, subtree: true }
   */
  mutationObserverOptions?: MutationObserverInit | null;
  /**
   * Whether tooltip is shown by default
   * @default false
   */
  initialVisible?: boolean;
  /**
   * Used to create controlled tooltip
   */
  visible?: boolean;
  /**
   * Called when the visibility of the tooltip changes
   */
  onVisibleChange?: (state: boolean) => void;
  /**
   * If `true`, a click outside the trigger element closes the tooltip
   * @default true
   */
  closeOnClickOutside?: boolean;
  /**
   * If `true`, closes the tooltip when the trigger element goes out of viewport
   * @default true
   */
  closeOnTriggerHidden?: boolean;
  /**
   * If `true`, hovering the tooltip will keep it open. Normally tooltip closes when the mouse cursor moves out of
   * the trigger element. If it moves to the tooltip element, the tooltip stays open.
   * @default false
   */
  interactive?: boolean;
  /**
   * Alias for popper.js placement, see https://popper.js.org/docs/v2/constructors/#placement
   */
  placement?: PopperJS.Placement;
  /**
   * Shorthand for popper.js offset modifier, see https://popper.js.org/docs/v2/modifiers/offset/
   * @default [0, 10]
   */
  offset?: [number, number];
};

export type PopperOptions = Partial<PopperJS.Options> & {
  createPopper?: typeof PopperJS.createPopper;
};

// export type PropsGetterArgs = { style?: React.CSSProperties };

export type PropsGetterArgs = {
  style?: React.CSSProperties,
  [key: string]: any
}

type ChildrenArg = {
  triggerRef: Ref;
  getTriggerProps<T>(arg: T): T;
}

type TooltipArg = {
  arrowRef: Ref;
  tooltipRef: Ref;
  placement: ConfigProps['placement'];
  getArrowProps(arg: PropsGetterArgs): PropsGetterArgs;
  getTooltipProps(arg: PropsGetterArgs): PropsGetterArgs;
}

type Ref =
  | ((element: HTMLElement | null) => void)
  | { current: HTMLElement | null }
  | null;

export type TooltipTriggerProps = {
  children(arg: ChildrenArg): React.ReactNode;
  closeOnTriggerHidden?: ConfigProps['closeOnTriggerHidden'];
  delayHide?: ConfigProps['delayHide'];
  delayShow?: ConfigProps['delayShow'];
  getTriggerRef?: Ref;
  initialVisible?: ConfigProps['initialVisible'];
  modifiers?: Modifier<any>[];
  mutationObserverOptions?: ConfigProps['mutationObserverOptions'];
  onVisibleChange?: ConfigProps['onVisibleChange'];
  placement?: ConfigProps['placement'];
  portalContainer: HTMLElement;
  tooltip(arg: TooltipArg): React.ReactNode;
  trigger?: ConfigProps['trigger'];
  usePortal?: Boolean;
  visible?: ConfigProps['visible'];

  /* DEPRICATED */
  closeOnReferenceHidden?: ConfigProps['closeOnTriggerHidden'];
  defaultTooltipShown?: ConfigProps['initialVisible'];
  onVisibilityChange?: ConfigProps['onVisibleChange'];
  tooltipShown?: ConfigProps['visible'];
  followCursor?: any
};
