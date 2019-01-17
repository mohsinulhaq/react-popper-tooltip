/**
 * @author Mohsin Ul Haq <mohsinulhaq01@gmail.com>
 */
import PopperJS from 'popper.js';
import * as React from 'react';
import {createPortal} from 'react-dom';
import {Manager, Popper, Reference} from 'react-popper';
import Tooltip from './Tooltip';
import {
  IGetTriggerPropsArg,
  ITooltipTriggerProps,
  ITooltipTriggerState
} from './types';
import {callAll, canUseDOM, noop, TooltipContext} from './utils';

const DEFAULT_MODIFIERS: PopperJS.Modifiers = {
  preventOverflow: {
    boundariesElement: 'viewport'
  }
};

class TooltipTrigger extends React.Component<
  ITooltipTriggerProps,
  ITooltipTriggerState
> {
  public static defaultProps = {
    closeOnOutOfBoundaries: true,
    defaultTooltipShown: false,
    delayHide: 0,
    delayShow: 0,
    followCursor: false,
    onVisibilityChange: noop,
    placement: 'right',
    portalContainer: canUseDOM() ? document.body : null,
    trigger: 'hover',
    usePortal: canUseDOM()
  };

  public static contextType = TooltipContext;

  public state: ITooltipTriggerState = {
    tooltipShown: this.props.defaultTooltipShown
  };

  private hideTimeout?: number;
  private showTimeout?: number;

  public componentWillUnmount() {
    this.clearScheduled();
  }

  public render() {
    const {
      children,
      tooltip,
      placement,
      trigger,
      getTriggerRef,
      modifiers,
      closeOnOutOfBoundaries,
      usePortal,
      portalContainer,
      followCursor,
      getTooltipRef
    } = this.props;

    const {
      parentOutsideClickHandler,
      addParentOutsideClickHandler,
      removeParentOutsideClickHandler,
      parentOutsideRightClickHandler,
      addParentOutsideRightClickHandler,
      removeParentOutsideRightClickHandler
    } = this.context;

    const popper = (
      <Popper
        innerRef={getTooltipRef}
        placement={placement}
        modifiers={{...DEFAULT_MODIFIERS, ...modifiers}}
      >
        {({
          ref,
          style,
          // tslint:disable-next-line
          placement,
          arrowProps,
          outOfBoundaries,
          scheduleUpdate
        }) => {
          if (followCursor) {
            const {pageX, pageY} = this.state;
            style.transform = `translate3d(${pageX}px, ${pageY}px, 0`;
          }

          return (
            <Tooltip
              {...{
                addParentOutsideClickHandler,
                addParentOutsideRightClickHandler,
                arrowProps,
                closeOnOutOfBoundaries,
                outOfBoundaries,
                parentOutsideClickHandler,
                parentOutsideRightClickHandler,
                placement,
                removeParentOutsideClickHandler,
                removeParentOutsideRightClickHandler,
                scheduleUpdate,
                style,
                tooltip,
                trigger
              }}
              clearScheduled={this.clearScheduled}
              hideTooltip={this.hideTooltip}
              innerRef={ref}
            />
          );
        }}
      </Popper>
    );

    return (
      <Manager>
        <Reference innerRef={getTriggerRef}>
          {({ref}) =>
            children({getTriggerProps: this.getTriggerProps, triggerRef: ref})
          }
        </Reference>
        {this.getState() &&
          (usePortal ? createPortal(popper, portalContainer) : popper)}
      </Manager>
    );
  }

  private isControlled() {
    return this.props.tooltipShown !== undefined;
  }

  private getState() {
    return this.isControlled()
      ? this.props.tooltipShown
      : this.state.tooltipShown;
  }

  private setTooltipState = (state: ITooltipTriggerState) => {
    const cb = () => this.props.onVisibilityChange(state.tooltipShown);
    this.isControlled() ? cb() : this.setState(state, cb);
  };

  private clearScheduled = () => {
    clearTimeout(this.hideTimeout);
    clearTimeout(this.showTimeout);
  };

  private showTooltip = ({pageX, pageY}: {pageX: number; pageY: number}) => {
    this.clearScheduled();
    let state: ITooltipTriggerState = {
      tooltipShown: true
    };
    if (this.props.followCursor) {
      state = {
        ...state,
        pageX,
        pageY
      };
    }
    this.showTimeout = window.setTimeout(
      () => this.setTooltipState(state),
      this.props.delayShow
    );
  };

  private hideTooltip = () => {
    this.clearScheduled();
    this.hideTimeout = window.setTimeout(
      () => this.setTooltipState({tooltipShown: false}),
      this.props.delayHide
    );
  };

  private toggleTooltip = ({pageX, pageY}: {pageX: number; pageY: number}) => {
    const action = this.getState() ? 'hideTooltip' : 'showTooltip';
    this[action]({pageX, pageY});
  };

  private clickToggle: React.MouseEventHandler = ({pageX, pageY}) => {
    const action = this.props.followCursor ? 'showTooltip' : 'toggleTooltip';
    this[action]({pageX, pageY});
  };

  private contextMenuToggle: React.MouseEventHandler = event => {
    event.preventDefault();
    const {pageX, pageY} = event;
    const action = this.props.followCursor ? 'showTooltip' : 'toggleTooltip';
    this[action]({pageX, pageY});
  };

  private getTriggerProps = (props: IGetTriggerPropsArg = {}) => {
    const {trigger, followCursor} = this.props;
    const isClickTriggered = trigger === 'click';
    const isHoverTriggered = trigger === 'hover';
    const isRightClickTriggered = trigger === 'right-click';
    const isTouchEnabled = canUseDOM() && 'ontouchend' in window;

    return {
      ...props,
      ...(isClickTriggered &&
        isTouchEnabled && {
          onTouchEnd: callAll(this.clickToggle, props.onTouchEnd)
        }),
      ...(isClickTriggered &&
        !isTouchEnabled && {
          onClick: callAll(this.clickToggle, props.onClick)
        }),
      ...(isRightClickTriggered && {
        onContextMenu: callAll(this.contextMenuToggle, props.onContextMenu)
      }),
      ...(isHoverTriggered && {
        onMouseEnter: callAll(this.showTooltip, props.onMouseEnter)
      }),
      ...(isHoverTriggered && {
        onMouseLeave: callAll(this.hideTooltip, props.onMouseLeave)
      }),
      ...(isHoverTriggered &&
        followCursor && {
          onMouseMove: callAll(this.showTooltip, props.onMouseMove)
        })
    };
  };
}

export default TooltipTrigger;
