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
  mutationObserverOptions?: MutationObserverInit;
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
   * Whether to close the tooltip when its trigger is out of boundary
   * @default true
   */
  closeOnReferenceHidden?: boolean;
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

export type PropsGetterArgs = { style?: React.CSSProperties };

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
  closeOnReferenceHidden: ConfigProps['closeOnReferenceHidden'];
  defaultTooltipShown: ConfigProps['initialVisible'];
  delayHide: ConfigProps['delayHide'];
  delayShow: ConfigProps['delayShow'];
  getTriggerRef?: Ref;
  modifiers: Modifier<any>[];
  mutationObserverOptions: ConfigProps['mutationObserverOptions'];
  onVisibilityChange: ConfigProps['onVisibleChange'];
  placement: ConfigProps['placement'];
  portalContainer: HTMLElement;
  tooltip(arg: TooltipArg): React.ReactNode;
  tooltipShown: ConfigProps['visible'];
  trigger: ConfigProps['trigger'];
  usePortal: Boolean;
};
