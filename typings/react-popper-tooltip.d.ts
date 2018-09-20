// Type definitions for react-popper-tooltip > v2.2.1
// Project: https://github.com/mohsinulhaq/react-popper-tooltip
// Definitions by Johan Brook <https://github.com/brookback>

declare module 'react-popper-tooltip' {
  import * as React from 'react';
  import Popper from 'popper.js';

  /**
   * TooltipTrigger is the only component exposed by the package. It's just a positioning
   * engine. What to render is left completely to the user, which can be provided using
   * render props. Your props should be passed through getTriggerProps, getTooltipProps
   * and getArrowProps.
   */
  export default class TooltipTrigger extends React.PureComponent<Props, {}> {}

  interface ChildProps {
    /** Returns the props you should apply to the trigger element you render. */
    getTriggerProps: (
      props?: {
        onClick?: (evt: React.SyntheticEvent) => void;
        onContextMenu?: (evt: React.SyntheticEvent) => void;
        onMouseEnter?: (evt: React.SyntheticEvent) => void;
        onMouseLeave?: (evt: React.SyntheticEvent) => void;
        [key: string]: any;
      }
    ) => {
      onClick: (evt: React.SyntheticEvent) => void;
      onContextMenu: (evt: React.SyntheticEvent) => void;
      onMouseEnter: (evt: React.SyntheticEvent) => void;
      onMouseLeave: (evt: React.SyntheticEvent) => void;
      [key: string]: any;
    };
    /** Returns the react ref you should apply to the trigger element. */
    triggerRef: React.RefObject<any>;
  }

  interface TooltipProps {
    /** Returns the props you should apply to the tooltip element you render. */
    getTooltipProps: (
      props?: {
        style?: React.CSSProperties;
        onMouseLeave?: (evt: React.SyntheticEvent) => void;
        onMouseEnter?: (evt: React.SyntheticEvent) => void;
        [key: string]: any;
      }
    ) => {
      style: React.CSSProperties;
      onMouseEnter: (evt: React.SyntheticEvent) => void;
      onMouseLeave: (evt: React.SyntheticEvent) => void;
      [key: string]: any;
    };
    /** Returns the react ref you should apply to the tooltip element. */
    tooltipRef: React.RefObject<any>;
    /** Returns the props you should apply to the tooltip arrow element. */
    getArrowProps: (props?: any) => {
      style: React.CSSProperties;
      [key: string]: any;
    };
    /** Returns the react ref you should apply to the tooltip arrow element. */
    arrowRef: React.RefObject<any>;
    /**
     * Returns the placement of the tooltip.
     *
     * @see https://popper.js.org/popper-documentation.html#Popper.placements
     */
    placement: Popper.Placement;
  }

  export interface Props {
    /** The tooltip child. */
    tooltip: (props: TooltipProps) => JSX.Element;
    /** The trigger child. */
    children: (props: ChildProps) => JSX.Element;
    /** The initial visibility state of the tooltip. */
    defaultTooltipShown?: boolean;
    /**
     * Use this prop if you want to control the visibility state of the tooltip.
     *
     * React-popper-tooltip manages its own state internally. You can use this prop to
     * pass the visibility state of the tooltip from the outside. You will be required to
     * keep this state up to date (this is where onVisibilityChange becomes useful), but
     * you can also control the state from anywhere, be that state from other components,
     * redux, react-router, or anywhere else. */
    tooltipShown?: boolean;
    /** Called when the visibility of the tooltip changes.
     * `tooltipShown` is a new state. */
    onVisibilityChange: (tooltipShown: boolean) => void;
    /** Delay in showing the tooltip (ms). Defaults to 0. */
    delayShow?: number;
    /** Delay in hiding the tooltip (ms). Defaults to 0. */
    delayHide?: number;
    /**
     * The event that triggers the tooltip. One of click, hover, right-click, none.
     * Defaults to hover.
     */
    trigger?: 'click' | 'hover' | 'right-click' | 'none';
    /** Whether to close the tooltip when it's trigger is out of the boundary.
     * Defaults to true.
     */
    closeOnOutOfBoundaries?: boolean;
    /**
     * Modifiers passed directly to the underlying popper.js instance. For more
     * information, refer to Popper.js’ [modifier docs](https://popper.js.org/popper-documentation.html#modifiers).
     *
     * Default modifiers:
     ```
     {
        preventOverflow: {
          boundariesElement: 'viewport',
          padding: 0
        }
      }
    ```
    */
    modifiers?: Popper.Modifiers;
    /**
     * The tooltip placement.
     *
     * @see https://popper.js.org/popper-documentation.html#Popper.placements
     */
    placement?: Popper.Placement;
  }
}
