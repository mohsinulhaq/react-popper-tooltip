import React, { Component } from 'react';
import {
  GetArrowPropsArg,
  GetTooltipPropsArg,
  TooltipProps,
  TriggerTypes,
} from './types';
import { callAll, TooltipContext, setRef } from './utils';

class Tooltip extends Component<TooltipProps> {
  public static contextType = TooltipContext;

  private observer?: MutationObserver;
  private tooltipRef!: HTMLElement | null;

  public componentDidMount() {
    const observer = (this.observer = new MutationObserver(() => {
      this.props.update();
    }));
    observer.observe(this.tooltipRef!, this.props.mutationObserverOptions);

    if (
      this.isTriggeredBy('hover') ||
      this.isTriggeredBy('click') ||
      this.isTriggeredBy('right-click')
    ) {
      const {
        removeParentOutsideClickHandler,
        removeParentOutsideRightClickHandler,
      } = this.context;
      this.addOutsideClickHandler();
      this.addOutsideRightClickHandler();
      if (removeParentOutsideClickHandler) {
        removeParentOutsideClickHandler();
      }
      if (removeParentOutsideRightClickHandler) {
        removeParentOutsideRightClickHandler();
      }
    }
  }

  public componentDidUpdate() {
    if (this.props.closeOnReferenceHidden && this.props.isReferenceHidden) {
      this.props.hideTooltip();
    }
  }

  public componentWillUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }

    if (
      this.isTriggeredBy('hover') ||
      this.isTriggeredBy('click') ||
      this.isTriggeredBy('right-click')
    ) {
      const {
        isParentNoneTriggered,
        addParentOutsideClickHandler,
        addParentOutsideRightClickHandler,
      } = this.context;
      this.removeOutsideClickHandler();
      this.removeOutsideRightClickHandler();
      this.handleOutsideClick = undefined;
      this.handleOutsideRightClick = undefined;
      if (!isParentNoneTriggered && addParentOutsideClickHandler) {
        addParentOutsideClickHandler();
      }
      if (!isParentNoneTriggered && addParentOutsideRightClickHandler) {
        addParentOutsideRightClickHandler();
      }
    }
  }

  public render() {
    const { arrowProps, placement, tooltip } = this.props;

    return (
      <TooltipContext.Provider value={this.contextValue}>
        {tooltip({
          arrowRef: arrowProps.ref,
          getArrowProps: this.getArrowProps,
          getTooltipProps: this.getTooltipProps,
          placement,
          tooltipRef: this.getTooltipRef,
        })}
      </TooltipContext.Provider>
    );
  }

  private isTriggeredBy(event: TriggerTypes) {
    const { trigger } = this.props;
    return (
      trigger === event || (Array.isArray(trigger) && trigger.includes(event))
    );
  }

  private handleOutsideClick?: EventListener = (event) => {
    if (this.tooltipRef && !this.tooltipRef.contains(event.target as Node)) {
      const { parentOutsideClickHandler } = this.context;
      const { hideTooltip, clearScheduled } = this.props;

      clearScheduled();
      hideTooltip();
      if (parentOutsideClickHandler) {
        parentOutsideClickHandler(event);
      }
    }
  };

  private handleOutsideRightClick?: EventListener = (event) => {
    if (this.tooltipRef && !this.tooltipRef.contains(event.target as Node)) {
      const { parentOutsideRightClickHandler } = this.context;
      const { hideTooltip, clearScheduled } = this.props;

      clearScheduled();
      hideTooltip();
      if (parentOutsideRightClickHandler) {
        parentOutsideRightClickHandler(event);
      }
    }
  };

  private addOutsideClickHandler = () => {
    document.body.addEventListener('touchend', this.handleOutsideClick!);
    document.body.addEventListener('click', this.handleOutsideClick!);
  };

  private removeOutsideClickHandler = () => {
    document.body.removeEventListener('touchend', this.handleOutsideClick!);
    document.body.removeEventListener('click', this.handleOutsideClick!);
  };

  private addOutsideRightClickHandler = () =>
    document.body.addEventListener(
      'contextmenu',
      this.handleOutsideRightClick!
    );

  private removeOutsideRightClickHandler = () =>
    document.body.removeEventListener(
      'contextmenu',
      this.handleOutsideRightClick!
    );

  private getTooltipRef = (node: HTMLElement | null) => {
    this.tooltipRef = node;
    setRef(this.props.innerRef, node);
  };

  private getArrowProps = (props: GetArrowPropsArg = {}) => ({
    ...props,
    style: { ...props.style, ...this.props.arrowProps.style },
  });

  private getTooltipProps = (props: GetTooltipPropsArg = {}) => ({
    ...props,
    ...(this.isTriggeredBy('hover') && {
      onMouseEnter: callAll(this.props.clearScheduled, props.onMouseEnter),
      onMouseLeave: callAll(this.props.hideTooltip, props.onMouseLeave),
    }),
    style: { ...props.style, ...this.props.style },
  });

  private contextValue = {
    isParentNoneTriggered: this.props.trigger === 'none',
    addParentOutsideClickHandler: this.addOutsideClickHandler,
    addParentOutsideRightClickHandler: this.addOutsideRightClickHandler,
    parentOutsideClickHandler: this.handleOutsideClick,
    parentOutsideRightClickHandler: this.handleOutsideRightClick,
    removeParentOutsideClickHandler: this.removeOutsideClickHandler,
    removeParentOutsideRightClickHandler: this.removeOutsideRightClickHandler,
  };
}

export default Tooltip;
