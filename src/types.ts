import * as React from 'react';
import * as PopperJS from '@popperjs/core';

export type TriggerType = 'click' | 'right-click' | 'hover' | 'focus';

export type ConfigProps = {
  /**
   * Whether to close the tooltip when its trigger is out of boundary
   * @default false
   */
  closeOnTriggerHidden?: boolean;
  /**
   * Event or events that trigger the tooltip
   * @default hover
   */
  trigger?: TriggerType | TriggerType[] | null;
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
   * Whether to make the tooltip spawn at cursor position
   * @default false
   */
  followCursor?: boolean;
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
  defaultVisible?: boolean;
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
   * @default [0, 6]
   */
  offset?: [number, number];
};

export type PopperOptions = Partial<PopperJS.Options> & {
  createPopper?: typeof PopperJS.createPopper;
};

export type PropsGetterArgs = {
  style?: React.CSSProperties;
  [key: string]: any;
};

export type FollowCursorStore = {
  pageX: number;
  pageY: number;
  width: number;
  height: number;
};
