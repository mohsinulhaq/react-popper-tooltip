/**
 * @author Mohsin Ul Haq <mohsinulhaq01@gmail.com>
 */
import React, { PureComponent } from 'react';
import { createPortal } from 'react-dom';
import T from 'prop-types';
import { Manager, Reference, Popper } from 'react-popper';
import { callAll } from './utils';
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
     * modifiers passed directly to the underlying popper.js instance
     * For more information, refer to Popper.js’ modifier docs:
     * @link https://popper.js.org/popper-documentation.html#modifiers
     */
    modifiers: T.object
  };

  static defaultProps = {
    delayShow: 0,
    delayHide: AVG_REACTION_TIME,
    defaultTooltipShown: false,
    placement: 'right',
    trigger: 'hover',
    closeOnOutOfBoundaries: true
  };

  state = {
    tooltipShown: this.props.defaultTooltipShown
  };

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

  showTooltip = () => {
    this._clearScheduled();
    this.setState({ tooltipShown: true });
  };

  hideTooltip = () => {
    this._clearScheduled();
    this.setState({ tooltipShown: false });
  };

  toggleTooltip = () => {
    this._clearScheduled();
    this.setState(prevState => ({
      tooltipShown: !prevState.tooltipShown
    }));
  };

  scheduleShow = event => {
    event.preventDefault();
    this._clearScheduled();

    this._showTimeout = setTimeout(this.showTooltip, this.props.delayShow);
  };

  scheduleHide = event => {
    event.preventDefault();
    this._clearScheduled();

    this._hideTimeout = setTimeout(this.hideTooltip, this._getDelayHide());
  };

  scheduleToggle = event => {
    const action = this.state.tooltipShown ? 'scheduleHide' : 'scheduleShow';
    this[action](event);
  };

  static getDerivedStateFromProps(props) {
    const { tooltipShown } = props;
    return tooltipShown != null ? { tooltipShown } : null;
  }

  componentWillUnmount() {
    this._clearScheduled();
  }

  getTriggerProps = ref => (props = {}) => {
    const isClickTriggered = this.props.trigger === 'click';
    const isHoverTriggered = this.props.trigger === 'hover';
    const isRightClickTriggered = this.props.trigger === 'right-click';

    return {
      ...props,
      ref,
      onClick: callAll(isClickTriggered && this.scheduleToggle, props.onClick),
      onContextMenu: callAll(
        isRightClickTriggered && this.scheduleToggle,
        props.onContextMenu
      ),
      onMouseEnter: callAll(
        isHoverTriggered && this.scheduleShow,
        props.onMouseEnter
      ),
      onMouseLeave: callAll(
        isHoverTriggered && this.scheduleHide,
        props.onMouseLeave
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
      closeOnOutOfBoundaries
    } = this.props;

    return (
      <Manager>
        <Reference>
          {({ ref }) =>
            children({ getTriggerProps: this.getTriggerProps(ref) })
          }
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
                        arrowProps,
                        placement,
                        trigger,
                        closeOnOutOfBoundaries,
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
                      scheduleHide={this.scheduleHide}
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
