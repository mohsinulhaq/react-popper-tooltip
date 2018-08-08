/**
 * @author Mohsin Ul Haq <mohsinulhaq01@gmail.com>
 */
import React, { PureComponent } from 'react';
import { createPortal } from 'react-dom';
import T from 'prop-types';
import cn from 'classnames';
import { Manager, Reference, Popper } from 'react-popper';
import { renderSlot } from './utils';

import Tooltip from './Tooltip';

const AVG_REACTION_TIME = 250;
const DEFAULT_MODIFIERS = {
  preventOverflow: {
    boundariesElement: 'viewport',
    padding: 0
  }
};

export const TooltipContext = React.createContext({});

export default class TooltipTrigger extends PureComponent {
  static propTypes = {
    /**
     * trigger
     */
    children: T.node.isRequired,
    /**
     * tooltip
     */
    tooltip: T.node.isRequired,
    /**
     * class to be applied to trigger container span
     */
    triggerClassName: T.string,
    /**
     * style to be applied on trigger container span
     */
    triggerStyle: T.object,
    /**
     * class to be applied to tooltip container span
     */
    tooltipClassName: T.string,
    /**
     * style to be applied on tooltip container span
     */
    tooltipStyle: T.object,
    /**
     * whether tooltip is shown by default
     */
    isTooltipShown: T.bool,
    /**
     * delay in showing the tooltip
     */
    delayShow: T.number,
    /**
     * delay in hiding the tooltip
     */
    delayHide: T.number,
    /**
     * whether to show arrow or not
     */
    showArrow: T.bool,
    /**
     * Popper’s placement. Valid placements are:
     *  - auto
     *  - top
     *  - right
     *  - bottom
     *  - left
     * Each placement can have a variation from this list:
     *  -start
     *  -end
     */
    placement: T.string,
    /**
     * the event that triggers the tooltip
     */
    trigger: T.oneOf(['click', 'hover', 'right-click', 'none']),
    /**
     * whether to close the tooltip when it's trigger is out of the boundary
     */
    closeOnOutOfBoundaries: T.bool,
    /**
     * modifiers passed directly to the underlying popper.js instance
     * For more information, refer to Popper.js’ modifier docs:
     * @link https://popper.js.org/popper-documentation.html#modifiers
     */
    modifiers: T.object
  };

  static defaultProps = {
    delayShow: 0,
    delayHide: 0,
    isOpen: false,
    showArrow: true,
    placement: 'right',
    trigger: 'hover',
    closeOnOutOfBoundaries: true
  };

  state = {
    tooltipShown: this.props.isOpen
  };

  showTooltip = () => this.setState({ tooltipShown: true });

  hideTooltip = () => this.setState({ tooltipShown: false });

  _getDelayHide = () => {
    const { trigger, delayHide } = this.props;
    if (trigger === 'hover' && delayHide < AVG_REACTION_TIME) {
      return AVG_REACTION_TIME;
    }
    return delayHide;
  };

  _clearScheduled = () => {
    clearTimeout(this._hideTimeout);
    clearTimeout(this._showTimeout);
  };

  _scheduleShow = event => {
    event.preventDefault();
    this._clearScheduled();

    this._showTimeout = setTimeout(this.showTooltip, this.props.delayShow);
  };

  _scheduleHide = event => {
    event.preventDefault();
    this._clearScheduled();

    this._hideTimeout = setTimeout(this.hideTooltip, this._getDelayHide());
  };

  _scheduleToggle = event => {
    if (this.state.tooltipShown) {
      this._scheduleHide(event);
    } else {
      this._scheduleShow(event);
    }
  };

  componentWillUnmount() {
    this._clearScheduled();
  }

  render() {
    const {
      children,
      tooltip,
      placement,
      showArrow,
      trigger,
      modifiers,
      triggerClassName,
      triggerStyle,
      tooltipClassName,
      tooltipStyle,
      closeOnOutOfBoundaries
    } = this.props;
    const isClickTriggered = trigger === 'click';
    const isHoverTriggered = trigger === 'hover';
    const isRightClickTriggered = trigger === 'right-click';

    const eventHandlers = {
      onClick: isClickTriggered ? this._scheduleToggle : undefined,
      onContextMenu: isRightClickTriggered ? this._scheduleToggle : undefined,
      onMouseEnter: isHoverTriggered ? this._scheduleShow : undefined,
      onMouseLeave: isHoverTriggered ? this._scheduleHide : undefined
    };

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <span
              ref={ref}
              className={cn('trigger', triggerClassName)}
              style={triggerStyle}
              {...eventHandlers}
            >
              {renderSlot(children)}
            </span>
          )}
        </Reference>
        {this.state.tooltipShown &&
          createPortal(
            <Popper
              placement={placement}
              modifiers={{ ...DEFAULT_MODIFIERS, ...modifiers }}
            >
              {({
                ref,
                style,
                placement,
                outOfBoundaries,
                scheduleUpdate,
                arrowProps
              }) => (
                <TooltipContext.Consumer>
                  {({
                    addParentOutsideClickHandler,
                    removeParentOutsideClickHandler,
                    parentOutsideClickHandler
                  }) => (
                    <Tooltip
                      {...{
                        style,
                        showArrow,
                        arrowProps,
                        placement,
                        trigger,
                        closeOnOutOfBoundaries,
                        tooltipClassName,
                        tooltipStyle,
                        tooltip,
                        addParentOutsideClickHandler,
                        removeParentOutsideClickHandler,
                        parentOutsideClickHandler,
                        outOfBoundaries,
                        scheduleUpdate
                      }}
                      innerRef={ref}
                      hideTooltip={this.hideTooltip}
                      clearScheduled={this._clearScheduled}
                      scheduleHide={this._scheduleHide}
                    />
                  )}
                </TooltipContext.Consumer>
              )}
            </Popper>,
            document.querySelector('body')
          )}
      </Manager>
    );
  }
}
