import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import {IGetArrowPropsArg, IGetTooltipPropsArg, ITooltipProps} from './types';
import {callAll, TooltipContext} from './utils';

const MUTATION_OBSERVER_CONFIG: MutationObserverInit = {
  childList: true,
  subtree: true
};

class Tooltip extends Component<ITooltipProps> {
  private observer?: MutationObserver;

  public componentDidMount() {
    const {trigger} = this.props;
    const observer = (this.observer = new MutationObserver(() => {
      this.props.scheduleUpdate();
    }));
    observer.observe(findDOMNode(this)!, MUTATION_OBSERVER_CONFIG);

    if (trigger === 'click' || trigger === 'right-click') {
      const {
        removeParentOutsideClickHandler,
        removeParentOutsideRightClickHandler
      } = this.props;
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

    if (trigger === 'click' || trigger === 'right-click') {
      const {
        addParentOutsideClickHandler,
        addParentOutsideRightClickHandler
      } = this.props;
      this.removeOutsideClickHandler();
      this.removeOutsideRightClickHandler();
      this.handleOutsideClick = undefined;
      this.handleOutsideRightClick = undefined;
      if (addParentOutsideClickHandler) {
        addParentOutsideClickHandler();
      }
      if (addParentOutsideRightClickHandler) {
        addParentOutsideRightClickHandler();
      }
    }
  }

  public render() {
    const {arrowProps, placement, tooltip, innerRef} = this.props;

    return (
      <TooltipContext.Provider
        value={{
          addParentOutsideClickHandler: this.addOutsideClickHandler,
          addParentOutsideRightClickHandler: this.addOutsideRightClickHandler,
          parentOutsideClickHandler: this.handleOutsideClick,
          parentOutsideRightClickHandler: this.handleOutsideRightClick,
          removeParentOutsideClickHandler: this.removeOutsideClickHandler,
          removeParentOutsideRightClickHandler: this
            .removeOutsideRightClickHandler
        }}
      >
        {tooltip({
          arrowRef: arrowProps.ref,
          getArrowProps: this.getArrowProps,
          getTooltipProps: this.getTooltipProps,
          placement,
          tooltipRef: innerRef
        })}
      </TooltipContext.Provider>
    );
  }

  private handleOutsideClick?: EventListener = event => {
    event.stopPropagation();
    event.preventDefault();
    if (!findDOMNode(this)!.contains(event.target as Node)) {
      const {
        hideTooltip,
        clearScheduled,
        parentOutsideClickHandler
      } = this.props;

      clearScheduled();
      hideTooltip();
      if (parentOutsideClickHandler) {
        parentOutsideClickHandler(event);
      }
    }
  };

  private handleOutsideRightClick?: EventListener = event => {
    if (!findDOMNode(this)!.contains(event.target as Node)) {
      const {
        hideTooltip,
        clearScheduled,
        parentOutsideRightClickHandler
      } = this.props;

      clearScheduled();
      hideTooltip();
      if (parentOutsideRightClickHandler) {
        parentOutsideRightClickHandler(event);
      }
    }
  };

  private addOutsideClickHandler = () => {
    document.addEventListener('touchend', this.handleOutsideClick!);
    document.addEventListener('click', this.handleOutsideClick!);
  };

  private removeOutsideClickHandler = () => {
    document.removeEventListener('touchend', this.handleOutsideClick!);
    document.removeEventListener('click', this.handleOutsideClick!);
  };

  private addOutsideRightClickHandler = () =>
    document.addEventListener('contextmenu', this.handleOutsideRightClick!);

  private removeOutsideRightClickHandler = () =>
    document.removeEventListener('contextmenu', this.handleOutsideRightClick!);

  private getArrowProps = (props: IGetArrowPropsArg = {}) => ({
    ...props,
    style: {...props.style, ...this.props.arrowProps.style}
  });

  private getTooltipProps = (props: IGetTooltipPropsArg = {}) => {
    const isHoverTriggered = this.props.trigger === 'hover';

    return {
      ...props,
      ...(isHoverTriggered && {
        onMouseEnter: callAll(this.props.clearScheduled, props.onMouseEnter)
      }),
      ...(isHoverTriggered && {
        onMouseLeave: callAll(this.props.hideTooltip, props.onMouseLeave)
      }),
      style: {...props.style, ...this.props.style}
    };
  };
}

export default Tooltip;
