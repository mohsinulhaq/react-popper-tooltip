/* eslint-disable react/no-find-dom-node */
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import T from 'prop-types';
import { TooltipContext } from './utils';
import { callAll } from './utils';

const MUTATION_OBSERVER_CONFIG = {
  childList: true,
  subtree: true
};

/**
 * @private
 */
export default class Tooltip extends Component {
  static propTypes = {
    innerRef: T.func,
    style: T.object,
    arrowProps: T.object,
    placement: T.string,
    trigger: T.string,
    clearScheduled: T.func,
    tooltip: T.func,
    hideTooltip: T.func,
    scheduleUpdate: T.func,
    parentOutsideClickHandler: T.func,
    removeParentOutsideClickHandler: T.func,
    addParentOutsideClickHandler: T.func,
    parentOutsideRightClickHandler: T.func,
    removeParentOutsideRightClickHandler: T.func,
    addParentOutsideRightClickHandler: T.func,
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

  _handleOutsideRightClick = e => {
    if (!findDOMNode(this).contains(e.target)) {
      const {
        hideTooltip,
        clearScheduled,
        parentOutsideRightClickHandler
      } = this.props;

      clearScheduled();
      hideTooltip();
      parentOutsideRightClickHandler && parentOutsideRightClickHandler(e);
    }
  };

  _addOutsideClickHandler = () =>
    document.addEventListener('click', this._handleOutsideClick);

  _removeOutsideClickHandler = () =>
    document.removeEventListener('click', this._handleOutsideClick);

  _addOutsideRightClickHandler = () =>
    document.addEventListener('contextmenu', this._handleOutsideRightClick);

  _removeOutsideRightClickHandler = () =>
    document.removeEventListener('contextmenu', this._handleOutsideRightClick);

  componentDidMount() {
    const { trigger } = this.props;
    const observer = (this.observer = new MutationObserver(() => {
      this.props.scheduleUpdate();
    }));
    observer.observe(findDOMNode(this), MUTATION_OBSERVER_CONFIG);

    if (trigger === 'click' || trigger === 'right-click') {
      const {
        removeParentOutsideClickHandler,
        removeParentOutsideRightClickHandler
      } = this.props;
      document.addEventListener('click', this._handleOutsideClick);
      document.addEventListener('contextmenu', this._handleOutsideRightClick);
      removeParentOutsideClickHandler && removeParentOutsideClickHandler();
      removeParentOutsideRightClickHandler &&
        removeParentOutsideRightClickHandler();
    }
  }

  componentWillUnmount() {
    const { trigger } = this.props;
    this.observer.disconnect();

    if (trigger === 'click' || trigger === 'right-click') {
      const {
        addParentOutsideClickHandler,
        addParentOutsideRightClickHandler
      } = this.props;
      document.removeEventListener('click', this._handleOutsideClick);
      document.removeEventListener(
        'contextmenu',
        this._handleOutsideRightClick
      );
      this._handleOutsideClick = undefined;
      this._handleOutsideRightClick = undefined;
      addParentOutsideClickHandler && addParentOutsideClickHandler();
      addParentOutsideRightClickHandler && addParentOutsideRightClickHandler();
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
        isHoverTriggered && this.props.hideTooltip,
        props.onMouseLeave
      )
    };
  };

  render() {
    const { arrowProps, placement, tooltip, innerRef } = this.props;

    return (
      <TooltipContext.Provider
        value={{
          parentOutsideClickHandler: this._handleOutsideClick,
          addParentOutsideClickHandler: this._addOutsideClickHandler,
          removeParentOutsideClickHandler: this._removeOutsideClickHandler,
          parentOutsideRightClickHandler: this._handleOutsideRightClick,
          addParentOutsideRightClickHandler: this._addOutsideRightClickHandler,
          removeParentOutsideRightClickHandler: this
            ._removeOutsideRightClickHandler
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
