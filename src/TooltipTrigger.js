/**
 * @author Mohsin Ul Haq <mohsinulhaq01@gmail.com>
 */
import React, {useRef, useContext, useState, useEffect} from 'react';
import {createPortal} from 'react-dom';
import T from 'prop-types';
import {Manager, Reference, Popper} from 'react-popper';
import Tooltip from './Tooltip';
import {TooltipContext, callAll, noop, canUseDOM} from './utils';

const DEFAULT_MODIFIERS = {
  preventOverflow: {
    boundariesElement: 'viewport',
    padding: 0
  }
};

export default function TooltipTrigger(props) {
  const context = useContext(TooltipContext);

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
    onVisibilityChange,
    delayShow,
    delayHide,
    defaultTooltipShown
  } = props;

  const {
    parentOutsideClickHandler,
    addParentOutsideClickHandler,
    removeParentOutsideClickHandler,
    parentOutsideRightClickHandler,
    addParentOutsideRightClickHandler,
    removeParentOutsideRightClickHandler
  } = context;

  const [tooltipShown, setTooltipShown] = useState(
    isControlled() ? props.tooltipShown : defaultTooltipShown
  );
  const [coordinates, setCoordinates] = useState({
    pageX: null,
    pageY: null
  });
  const [showTimeout, hideTimeout] = [useRef(), useRef()];

  function isControlled() {
    return props.tooltipShown !== undefined;
  }

  function getState() {
    return isControlled() ? props.tooltipShown : tooltipShown;
  }

  function clearScheduled() {
    clearTimeout(hideTimeout.current);
    clearTimeout(showTimeout.current);
  }

  function setTooltipState(tooltipShown, {pageX, pageY} = {}) {
    if (isControlled()) {
      onVisibilityChange(tooltipShown);
    } else {
      setTooltipShown(tooltipShown);
      setCoordinates({pageX, pageY});
    }
  }

  function showTooltip({pageX, pageY}) {
    clearScheduled();
    showTimeout.current = setTimeout(
      () => setTooltipState(true, {pageX, pageY}),
      delayShow
    );
  }

  function hideTooltip() {
    clearScheduled();
    hideTimeout.current = setTimeout(() => setTooltipState(false), delayHide);
  }

  function toggleTooltip({pageX, pageY}) {
    getState() ? hideTooltip({pageX, pageY}) : showTooltip({pageX, pageY});
  }

  function clickToggle({pageX, pageY}) {
    followCursor ? showTooltip({pageX, pageY}) : toggleTooltip({pageX, pageY});
  }

  function contextMenuToggle(event) {
    event.preventDefault();
    const {pageX, pageY} = event;
    followCursor ? showTooltip({pageX, pageY}) : toggleTooltip({pageX, pageY});
  }

  function getTriggerProps({
    onClick,
    onContextMenu,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
    ...rest
  }) {
    const isClickTriggered = trigger === 'click';
    const isHoverTriggered = trigger === 'hover';
    const isRightClickTriggered = trigger === 'right-click';

    return {
      ...rest,
      onClick: callAll(isClickTriggered && clickToggle, onClick),
      onContextMenu: callAll(
        isRightClickTriggered && contextMenuToggle,
        onContextMenu
      ),
      onMouseEnter: callAll(isHoverTriggered && showTooltip, onMouseEnter),
      onMouseLeave: callAll(isHoverTriggered && hideTooltip, onMouseLeave),
      onMouseMove: callAll(
        isHoverTriggered && followCursor && showTooltip,
        onMouseMove
      )
    };
  }

  useEffect(() => clearScheduled);

  const popper = (
    <Popper
      placement={placement}
      modifiers={{...DEFAULT_MODIFIERS, ...modifiers}}
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
          const {pageX, pageY} = coordinates;
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
            hideTooltip={hideTooltip}
            clearScheduled={clearScheduled}
          />
        );
      }}
    </Popper>
  );

  return (
    <Manager>
      <Reference innerRef={getTriggerRef}>
        {({ref}) => children({getTriggerProps, triggerRef: ref})}
      </Reference>
      {getState() &&
        (usePortal ? createPortal(popper, portalContainer) : popper)}
    </Manager>
  );
}

TooltipTrigger.propTypes = {
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
   * function that can be used to obtain a trigger element reference
   */
  getTriggerRef: T.func,
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

TooltipTrigger.defaultProps = {
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
