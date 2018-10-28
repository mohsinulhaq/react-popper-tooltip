/**
 * @author Mohsin Ul Haq <mohsinulhaq01@gmail.com>
 */
import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import T from 'prop-types';
import { Manager, Reference, Popper } from 'react-popper';
import Tooltip from './Tooltip';
import { TooltipContext, callAll, noop, canUseDOM } from './utils';

const DEFAULT_MODIFIERS = {
  preventOverflow: {
    boundariesElement: 'viewport',
    padding: 0
  }
};

export default class TooltipTrigger extends Component {
  static propTypes = {
    /**
     * trigger
     */
    children: T.func.isRequired,
    /**
     * tooltip
     */
    tooltip: T.func.isRequired,
    /**
     * whether tooltip is shown by default
     */
    defaultTooltipShown: T.bool,
    /**
     * use to create controlled tooltip
     */
    tooltipShown: T.bool,
    /**
     * сalled when the visibility of the tooltip changes
     */
    onVisibilityChange: T.func,
    /**
     * delay in showing the tooltip
     */
    delayShow: T.number,
    /**
     * delay in hiding the tooltip
     */
    delayHide: T.number,
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
     * whether to use React.createPortal for creating tooltip
     */
    usePortal: T.bool,
    /**
     * element to be used as portal container
     */
    portalContainer: canUseDOM() ? T.instanceOf(HTMLElement) : T.object,
    /**
     * whether to make the tooltip spawn at cursor position
     * @default false
     */
    followCursor: T.bool,
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
    defaultTooltipShown: false,
    placement: 'right',
    trigger: 'hover',
    closeOnOutOfBoundaries: true,
    onVisibilityChange: noop,
    usePortal: canUseDOM(),
    portalContainer: canUseDOM() ? document.body : null,
    followCursor: false
  };

  static contextType = TooltipContext;

  state = {
    tooltipShown: this._isControlled() ? false : this.props.defaultTooltipShown,
    pageX: null,
    pageY: null
  };

  _isControlled() {
    return this.props.tooltipShown !== undefined;
  }

  _getState() {
    return this._isControlled()
      ? this.props.tooltipShown
      : this.state.tooltipShown;
  }

  _setTooltipState = state => {
    const cb = () => this.props.onVisibilityChange(state.tooltipShown);

    if (this._isControlled()) {
      cb();
    } else {
      this.setState(state, cb);
    }
  };

  _clearScheduled = () => {
    clearTimeout(this._hideTimeout);
    clearTimeout(this._showTimeout);
  };

  _showTooltip = ({ pageX, pageY }) => {
    this._clearScheduled();
    let state = { tooltipShown: true };
    if (this.props.followCursor) {
      state = {
        ...state,
        pageX,
        pageY
      };
    }
    this._showTimeout = setTimeout(
      () => this._setTooltipState(state),
      this.props.delayShow
    );
  };

  _hideTooltip = () => {
    this._clearScheduled();
    this._hideTimeout = setTimeout(
      () => this._setTooltipState({ tooltipShown: false }),
      this.props.delayHide
    );
  };

  _toggleTooltip = ({ pageX, pageY }) => {
    const action = this._getState() ? '_hideTooltip' : '_showTooltip';
    this[action]({ pageX, pageY });
  };

  _clickToggle = event => {
    const { pageX, pageY } = event;
    const action = this.props.followCursor ? '_showTooltip' : '_toggleTooltip';
    this[action]({ pageX, pageY });
  };

  _contextMenuToggle = event => {
    event.preventDefault();
    const { pageX, pageY } = event;
    const action = this.props.followCursor ? '_showTooltip' : '_toggleTooltip';
    this[action]({ pageX, pageY });
  };

  componentWillUnmount() {
    this._clearScheduled();
  }

  getTriggerProps = (props = {}) => {
    const isClickTriggered = this.props.trigger === 'click';
    const isHoverTriggered = this.props.trigger === 'hover';
    const isRightClickTriggered = this.props.trigger === 'right-click';

    return {
      ...props,
      onClick: callAll(isClickTriggered && this._clickToggle, props.onClick),
      onContextMenu: callAll(
        isRightClickTriggered && this._contextMenuToggle,
        props.onContextMenu
      ),
      onMouseEnter: callAll(
        isHoverTriggered && this._showTooltip,
        props.onMouseEnter
      ),
      onMouseLeave: callAll(
        isHoverTriggered && this._hideTooltip,
        props.onMouseLeave
      ),
      onMouseMove: callAll(
        isHoverTriggered && this.props.followCursor && this._showTooltip,
        props.onMouseMove
      )
    };
  };

  render() {
    const {
      children,
      tooltip,
      placement,
      trigger,
      modifiers,
      closeOnOutOfBoundaries,
      usePortal,
      portalContainer,
      followCursor
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
        placement={placement}
        modifiers={{ ...DEFAULT_MODIFIERS, ...modifiers }}
      >
        {({
          ref,
          style,
          placement,
          arrowProps,
          outOfBoundaries,
          scheduleUpdate
        }) => {
          if (followCursor) {
            const { pageX, pageY } = this.state;
            style.transform = `translate3d(${pageX}px, ${pageY}px, 0`;
          }
          return (
            <Tooltip
              {...{
                style,
                arrowProps,
                placement,
                trigger,
                closeOnOutOfBoundaries,
                tooltip,
                parentOutsideClickHandler,
                addParentOutsideClickHandler,
                removeParentOutsideClickHandler,
                parentOutsideRightClickHandler,
                addParentOutsideRightClickHandler,
                removeParentOutsideRightClickHandler,
                outOfBoundaries,
                scheduleUpdate
              }}
              innerRef={ref}
              hideTooltip={this._hideTooltip}
              clearScheduled={this._clearScheduled}
            />
          );
        }}
      </Popper>
    );

    return (
      <Manager>
        <Reference>
          {({ ref }) =>
            children({ getTriggerProps: this.getTriggerProps, triggerRef: ref })
          }
        </Reference>
        {this._getState() &&
          (usePortal ? createPortal(popper, portalContainer) : popper)}
      </Manager>
    );
  }
}
