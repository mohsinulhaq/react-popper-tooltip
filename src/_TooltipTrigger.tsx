/**
 * @author Mohsin Ul Haq <mohsinulhaq01@gmail.com>
 */
import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import { Rect } from '@popperjs/core';
import { Manager, Popper, Reference } from 'react-popper';
import Tooltip from './Tooltip';
import { callAll, canUseDOM, noop } from './utils';
import {
  GetTriggerPropsArg,
  TooltipTriggerProps,
  TooltipTriggerState,
  TriggerTypes,
} from './types';

const DEFAULT_MUTATION_OBSERVER_CONFIG: MutationObserverInit = {
  childList: true,
  subtree: true,
};

class TooltipTrigger extends Component<
  TooltipTriggerProps,
  TooltipTriggerState
> {
  public static defaultProps = {
    closeOnReferenceHidden: true,
    defaultTooltipShown: false,
    delayHide: 0,
    delayShow: 0,
    followCursor: false,
    onVisibilityChange: noop,
    placement: 'right',
    portalContainer: canUseDOM() ? document.body : null,
    trigger: 'hover',
    usePortal: canUseDOM(),
    mutationObserverOptions: DEFAULT_MUTATION_OBSERVER_CONFIG,
    modifiers: [],
  };

  public state: TooltipTriggerState = {
    tooltipShown: this.props.defaultTooltipShown,
  };

  private hideTimeout?: number;
  private showTimeout?: number;
  private popperOffset?: Rect;

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
      closeOnReferenceHidden,
      usePortal,
      portalContainer,
      followCursor,
      getTooltipRef,
      mutationObserverOptions,
      ...restProps
    } = this.props;

    const popper = (
      <Popper
        innerRef={getTooltipRef}
        placement={placement}
        modifiers={[
          {
            name: 'followCursor',
            enabled: followCursor,
            phase: 'main',
            fn: (data) => {
              this.popperOffset = data.state.rects.popper;
            },
          },
          ...modifiers,
        ]}
        {...restProps}
      >
        {({ ref, style, placement, arrowProps, isReferenceHidden, update }) => {
          if (followCursor && this.popperOffset) {
            const { pageX, pageY } = this.state;
            const { width, height } = this.popperOffset;
            const x =
              pageX! + width > window.pageXOffset + document.body.offsetWidth
                ? pageX! - width
                : pageX;
            const y =
              pageY! + height > window.pageYOffset + document.body.offsetHeight
                ? pageY! - height
                : pageY;
            style.transform = `translate3d(${x}px, ${y}px, 0`;
          }

          return (
            <Tooltip
              {...{
                arrowProps,
                closeOnReferenceHidden,
                isReferenceHidden,
                placement,
                update,
                style,
                tooltip,
                trigger,
                mutationObserverOptions,
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
          {({ ref }) =>
            children({ getTriggerProps: this.getTriggerProps, triggerRef: ref })
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

  private showTooltip = ({
    pageX,
    pageY,
  }: {
    pageX: number;
    pageY: number;
  }) => {
    this.clearScheduled();
    let state: TooltipTriggerState = {
      tooltipShown: true,
    };
    if (this.props.followCursor) {
      state = {
        ...state,
        pageX,
        pageY,
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
      () => this.setTooltipState({ tooltipShown: false }),
      this.props.delayHide
    );
  };

  private toggleTooltip = ({
    pageX,
    pageY,
  }: {
    pageX: number;
    pageY: number;
  }) => {
    const action = this.getState() ? 'hideTooltip' : 'showTooltip';
    this[action]({ pageX, pageY });
  };

  private clickToggle: React.MouseEventHandler = (event: React.MouseEvent) => {
    event.preventDefault();
    const { pageX, pageY } = event;
    const action = this.props.followCursor ? 'showTooltip' : 'toggleTooltip';
    this[action]({ pageX, pageY });
  };

  private contextMenuToggle: React.MouseEventHandler = (event) => {
    event.preventDefault();
    const { pageX, pageY } = event;
    const action = this.props.followCursor ? 'showTooltip' : 'toggleTooltip';
    this[action]({ pageX, pageY });
  };

  private isTriggeredBy(event: TriggerTypes) {
    const { trigger } = this.props;
    return (
      trigger === event || (Array.isArray(trigger) && trigger.includes(event))
    );
  }

  private getTriggerProps = (props: GetTriggerPropsArg = {}) => {
    return {
      ...props,
      ...(this.isTriggeredBy('click') && {
        onClick: callAll(this.clickToggle, props.onClick),
        onTouchEnd: callAll(this.clickToggle, props.onTouchEnd),
      }),
      ...(this.isTriggeredBy('right-click') && {
        onContextMenu: callAll(this.contextMenuToggle, props.onContextMenu),
      }),
      ...(this.isTriggeredBy('hover') && {
        onMouseEnter: callAll(this.showTooltip, props.onMouseEnter),
        onMouseLeave: callAll(this.hideTooltip, props.onMouseLeave),
        ...(this.props.followCursor && {
          onMouseMove: callAll(this.showTooltip, props.onMouseMove),
        }),
      }),
      ...(this.isTriggeredBy('focus') && {
        onFocus: callAll(this.showTooltip, props.onFocus),
        onBlur: callAll(this.hideTooltip, props.onBlur),
      }),
    };
  };
}

export default TooltipTrigger;
