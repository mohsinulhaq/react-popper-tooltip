/**
 * @author Mohsin Ul Haq <mohsinulhaq01@gmail.com>
 */
import PopperJS from 'popper.js';
import React, {Component} from 'react';
import {createPortal} from 'react-dom';
import {Manager, Popper, Reference} from 'react-popper';
import Tooltip from './Tooltip';
import {
  GetTriggerPropsArg,
  TooltipTriggerProps,
  TooltipTriggerState
} from './types';
import {callAll, canUseDOM, noop} from './utils';

const DEFAULT_MODIFIERS: PopperJS.Modifiers = {
  preventOverflow: {
    boundariesElement: 'viewport'
  }
};

class TooltipTrigger extends Component<
  TooltipTriggerProps,
  TooltipTriggerState
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

  public state: TooltipTriggerState = {
    tooltipShown: this.props.defaultTooltipShown
  };

  private hideTimeout?: number;
  private showTimeout?: number;
  private popperOffset?: PopperJS.Offset;

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

    const popper = (
      <Popper
        innerRef={getTooltipRef}
        placement={placement}
        modifiers={{
          ...DEFAULT_MODIFIERS,
          ...(followCursor && {
            followCursorModifier: {
              enabled: true,
              fn: data => {
                this.popperOffset = data.offsets.popper;
                return data;
              },
              order: 1000
            }
          }),
          ...modifiers
        }}
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
          if (followCursor && this.popperOffset) {
            const {pageX, pageY} = this.state;
            const {width, height} = this.popperOffset;
            const x =
              pageX! + width > window.scrollX + document.body.offsetWidth
                ? pageX! - width
                : pageX;
            const y =
              pageY! + height > window.scrollY + document.body.offsetHeight
                ? pageY! - height
                : pageY;
            style.transform = `translate3d(${x}px, ${y}px, 0`;
          }

          return (
            <Tooltip
              {...{
                arrowProps,
                closeOnOutOfBoundaries,
                outOfBoundaries,
                placement,
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

  private setTooltipState = (state: TooltipTriggerState) => {
    const cb = () => this.props.onVisibilityChange(state.tooltipShown);
    this.isControlled() ? cb() : this.setState(state, cb);
  };

  private clearScheduled = () => {
    clearTimeout(this.hideTimeout);
    clearTimeout(this.showTimeout);
  };

  private showTooltip = ({pageX, pageY}: {pageX: number; pageY: number}) => {
    this.clearScheduled();
    let state: TooltipTriggerState = {
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

  private clickToggle: React.MouseEventHandler = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const {pageX, pageY} = event;
    const action = this.props.followCursor ? 'showTooltip' : 'toggleTooltip';
    this[action]({pageX, pageY});
  };

  private contextMenuToggle: React.MouseEventHandler = event => {
    event.preventDefault();
    const {pageX, pageY} = event;
    const action = this.props.followCursor ? 'showTooltip' : 'toggleTooltip';
    this[action]({pageX, pageY});
  };

  private getTriggerProps = (props: GetTriggerPropsArg = {}) => {
    const {trigger, followCursor} = this.props;
    const isClickTriggered = trigger === 'click';
    const isHoverTriggered = trigger === 'hover';
    const isRightClickTriggered = trigger === 'right-click';

    return {
      ...props,
      ...(isClickTriggered && {
        onClick: callAll(this.clickToggle, props.onClick),
        onTouchEnd: callAll(this.clickToggle, props.onTouchEnd)
      }),
      ...(isRightClickTriggered && {
        onContextMenu: callAll(this.contextMenuToggle, props.onContextMenu)
      }),
      ...(isHoverTriggered && {
        onMouseEnter: callAll(this.showTooltip, props.onMouseEnter),
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
