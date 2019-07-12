import React, {Component} from 'react';
import {GetArrowPropsArg, GetTooltipPropsArg, TooltipProps} from './types';
import {callAll, TooltipContext} from './utils';

const MUTATION_OBSERVER_CONFIG: MutationObserverInit = {
  childList: true,
  subtree: true
};

class Tooltip extends Component<TooltipProps> {
  public static contextType = TooltipContext;

  private observer?: MutationObserver;
  private tooltipRef!: HTMLElement | null;

  public componentDidMount() {
    const {trigger} = this.props;
    const observer = (this.observer = new MutationObserver(() => {
      this.props.scheduleUpdate();
    }));
    observer.observe(this.tooltipRef!, MUTATION_OBSERVER_CONFIG);

    if (trigger !== 'none') {
      const {
        removeParentOutsideClickHandler,
        removeParentOutsideRightClickHandler
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
    if (this.props.closeOnOutOfBoundaries && this.props.outOfBoundaries) {
      this.props.hideTooltip();
    }
  }

  public componentWillUnmount() {
    const {trigger} = this.props;
    if (this.observer) {
      this.observer.disconnect();
    }

    if (trigger !== 'none') {
      const {
        isParentNoneTriggered,
        addParentOutsideClickHandler,
        addParentOutsideRightClickHandler
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
    const {arrowProps, placement, tooltip} = this.props;

    return (
      <TooltipContext.Provider value={this.contextValue}>
        {tooltip({
          arrowRef: arrowProps.ref,
          getArrowProps: this.getArrowProps,
          getTooltipProps: this.getTooltipProps,
          placement,
          tooltipRef: this.getTooltipRef
        })}
      </TooltipContext.Provider>
    );
  }

  private handleOutsideClick?: EventListener = event => {
    if (this.tooltipRef && !this.tooltipRef.contains(event.target as Node)) {
      const {parentOutsideClickHandler} = this.context;
      const {hideTooltip, clearScheduled} = this.props;

      clearScheduled();
      hideTooltip();
      if (parentOutsideClickHandler) {
        parentOutsideClickHandler(event);
      }
    }
  };

  private handleOutsideRightClick?: EventListener = event => {
    if (this.tooltipRef && !this.tooltipRef.contains(event.target as Node)) {
      const {parentOutsideRightClickHandler} = this.context;
      const {hideTooltip, clearScheduled} = this.props;

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

  private getTooltipRef = (ref: HTMLElement | null) => {
    this.tooltipRef = ref;
    this.props.innerRef(ref);
  };

  private getArrowProps = (props: GetArrowPropsArg = {}) => ({
    ...props,
    style: {...props.style, ...this.props.arrowProps.style}
  });

  private getTooltipProps = (props: GetTooltipPropsArg = {}) => {
    const isHoverTriggered = this.props.trigger === 'hover';

    return {
      ...props,
      ...(isHoverTriggered && {
        onMouseEnter: callAll(this.props.clearScheduled, props.onMouseEnter),
        onMouseLeave: callAll(this.props.hideTooltip, props.onMouseLeave)
      }),
      style: {...props.style, ...this.props.style}
    };
  };

  private contextValue = {
    isParentNoneTriggered: this.props.trigger === 'none',
    addParentOutsideClickHandler: this.addOutsideClickHandler,
    addParentOutsideRightClickHandler: this.addOutsideRightClickHandler,
    parentOutsideClickHandler: this.handleOutsideClick,
    parentOutsideRightClickHandler: this.handleOutsideRightClick,
    removeParentOutsideClickHandler: this.removeOutsideClickHandler,
    removeParentOutsideRightClickHandler: this.removeOutsideRightClickHandler
  };
}

export default Tooltip;
