import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import T from 'prop-types';
import { TooltipContext } from './TooltipTrigger';
import { callAll } from './utils';

const MUTATION_OBSERVER_CONFIG = {
  childList: true,
  subtree: true
};

/**
 * @private
 */
export default class Tooltip extends PureComponent {
  static propTypes = {
    innerRef: T.func,
    style: T.object,
    arrowProps: T.object,
    placement: T.string,
    trigger: T.string,
    clearScheduled: T.func,
    scheduleHide: T.func,
    tooltip: T.func,
    hideTooltip: T.func,
    parentOutsideClickHandler: T.func,
    scheduleUpdate: T.func,
    removeParentOutsideClickHandler: T.func,
    addParentOutsideClickHandler: T.func,
    closeOnOutOfBoundaries: T.bool,
    outOfBoundaries: T.bool
  };

  _handleOutsideClick = e => {
    if (!findDOMNode(this).contains(e.target)) {
      const {
        hideTooltip,
        clearScheduled,
        parentOutsideClickHandler
      } = this.props;

      clearScheduled();
      hideTooltip();
      parentOutsideClickHandler && parentOutsideClickHandler(e);
    }
  };

  _addOutsideClickHandler = () =>
    document.addEventListener('click', this._handleOutsideClick);

  _removeOutsideClickHandler = () =>
    document.removeEventListener('click', this._handleOutsideClick);

  componentDidMount() {
    const { trigger } = this.props;
    const observer = (this.observer = new MutationObserver(() => {
      this.props.scheduleUpdate();
    }));
    observer.observe(findDOMNode(this), MUTATION_OBSERVER_CONFIG);

    if (trigger === 'click' || trigger === 'right-click') {
      const { removeParentOutsideClickHandler } = this.props;
      document.addEventListener('click', this._handleOutsideClick);
      removeParentOutsideClickHandler && removeParentOutsideClickHandler();
    }
  }

  componentWillUnmount() {
    const { trigger } = this.props;
    this.observer.disconnect();

    if (trigger === 'click' || trigger === 'right-click') {
      const { addParentOutsideClickHandler } = this.props;
      document.removeEventListener('click', this._handleOutsideClick);
      this._handleOutsideClick = undefined;
      addParentOutsideClickHandler && addParentOutsideClickHandler();
    }
  }

  componentDidUpdate() {
    if (this.props.closeOnOutOfBoundaries && this.props.outOfBoundaries) {
      this.props.hideTooltip();
    }
  }

  getArrowProps = (props = {}) => ({
    ...props,
    style: { ...props.style, ...this.props.arrowProps.style }
  });

  getTooltipProps = (props = {}) => {
    const isHoverTriggered = this.props.trigger === 'hover';

    return {
      ...props,
      style: { ...props.style, ...this.props.style },
      onMouseEnter: callAll(
        isHoverTriggered && this.props.clearScheduled,
        props.onMouseEnter
      ),
      onMouseLeave: callAll(
        isHoverTriggered && this.props.scheduleHide,
        props.onMouseLeave
      )
    };
  };

  render() {
    const { arrowProps, placement, tooltip, innerRef } = this.props;

    return (
      <TooltipContext.Provider
        value={{
          addParentOutsideClickHandler: this._addOutsideClickHandler,
          removeParentOutsideClickHandler: this._removeOutsideClickHandler,
          parentOutsideClickHandler: this._handleOutsideClick
        }}
      >
        {tooltip({
          getTooltipProps: this.getTooltipProps,
          getArrowProps: this.getArrowProps,
          tooltipRef: innerRef,
          arrowRef: arrowProps.ref,
          placement
        })}
      </TooltipContext.Provider>
    );
  }
}
