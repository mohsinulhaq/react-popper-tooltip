/* eslint-disable react/no-find-dom-node */
import React, {useRef, useEffect} from 'react';
import T from 'prop-types';
import {TooltipContext} from './utils';
import {callAll} from './utils';

const MUTATION_OBSERVER_CONFIG = {
  childList: true,
  subtree: true
};

export default function Tooltip(props) {
  const {
    arrowProps,
    placement,
    tooltip,
    innerRef,
    trigger,
    addParentOutsideClickHandler,
    addParentOutsideRightClickHandler,
    removeParentOutsideClickHandler,
    removeParentOutsideRightClickHandler,
    scheduleUpdate,
    clearScheduled,
    hideTooltip,
    closeOnOutOfBoundaries,
    outOfBoundaries
  } = props;

  function handleOutsideClick(event) {
    if (!tooltipRef.current.contains(event.target)) {
      const {hideTooltip, clearScheduled, parentOutsideClickHandler} = props;

      clearScheduled();
      hideTooltip();
      parentOutsideClickHandler && parentOutsideClickHandler(event);
    }
  }

  function handleOutsideRightClick(event) {
    if (!tooltipRef.current.contains(event.target)) {
      const {hideTooltip, clearScheduled, parentOutsideClickHandler} = props;

      clearScheduled();
      hideTooltip();
      parentOutsideClickHandler && parentOutsideClickHandler(event);
    }
  }

  function addOutsideClickHandler() {
    document.addEventListener('click', handleOutsideClick);
  }

  function removeOutsideClickHandler() {
    document.removeEventListener('click', handleOutsideClick);
  }

  function addOutsideRightClickHandler() {
    document.addEventListener('contextmenu', handleOutsideRightClick);
  }

  function removeOutsideRightClickHandler() {
    document.removeEventListener('contextmenu', handleOutsideRightClick);
  }

  function getArrowProps({style, ...rest}) {
    return {
      ...rest,
      style: {...style, ...arrowProps.style}
    };
  }

  function getTooltipProps({style, onMouseEnter, onMouseLeave, ...rest}) {
    const isHoverTriggered = trigger === 'hover';

    return {
      ...rest,
      style: {...style, ...props.style},
      onMouseEnter: callAll(isHoverTriggered && clearScheduled, onMouseEnter),
      onMouseLeave: callAll(isHoverTriggered && hideTooltip, onMouseLeave)
    };
  }

  const tooltipRef = useRef();

  function setRef(ref) {
    innerRef(ref);
    tooltipRef.current = ref;
  }

  useEffect(() => {
    const observer = new MutationObserver(scheduleUpdate);
    observer.observe(tooltipRef.current, MUTATION_OBSERVER_CONFIG);

    if (trigger === 'click' || trigger === 'right-click') {
      document.addEventListener('click', handleOutsideClick);
      document.addEventListener('contextmenu', handleOutsideRightClick);
      removeParentOutsideClickHandler && removeParentOutsideClickHandler();
      removeParentOutsideRightClickHandler &&
        removeParentOutsideRightClickHandler();
    }

    return () => {
      observer.disconnect();

      if (trigger === 'click' || trigger === 'right-click') {
        document.removeEventListener('click', handleOutsideClick);
        document.removeEventListener('contextmenu', handleOutsideRightClick);
        addParentOutsideClickHandler && addParentOutsideClickHandler();
        addParentOutsideRightClickHandler &&
          addParentOutsideRightClickHandler();
      }
    };
  }, []);

  useEffect(() => closeOnOutOfBoundaries && outOfBoundaries && hideTooltip(), [
    outOfBoundaries
  ]);

  return (
    <TooltipContext.Provider
      value={{
        parentOutsideClickHandler: handleOutsideClick,
        addParentOutsideClickHandler: addOutsideClickHandler,
        removeParentOutsideClickHandler: removeOutsideClickHandler,
        parentOutsideRightClickHandler: handleOutsideRightClick,
        addParentOutsideRightClickHandler: addOutsideRightClickHandler,
        removeParentOutsideRightClickHandler: removeOutsideRightClickHandler
      }}
    >
      {tooltip({
        getTooltipProps: getTooltipProps,
        getArrowProps: getArrowProps,
        tooltipRef: setRef,
        arrowRef: arrowProps.ref,
        placement
      })}
    </TooltipContext.Provider>
  );
}

Tooltip.propTypes = {
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
