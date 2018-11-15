/* eslint-disable react/no-find-dom-node */
import React, {useRef, useEffect} from 'react';
import T from 'prop-types';
import {TooltipContext} from './utils';
import {callAll} from './utils';

const MUTATION_OBSERVER_CONFIG = {
  childList: true,
  subtree: true
};

export default function Tooltip({
  style: popperStyle,
  arrowProps,
  placement,
  tooltip,
  innerRef,
  trigger,
  parentOutsideClickHandler,
  parentOutsideRightClickHandler,
  addParentOutsideClickHandler,
  addParentOutsideRightClickHandler,
  removeParentOutsideClickHandler,
  removeParentOutsideRightClickHandler,
  scheduleUpdate,
  clearScheduled,
  hideTooltip,
  closeOnOutOfBoundaries,
  outOfBoundaries
}) {
  function handleOutsideClick(event) {
    if (!tooltipRef.current.contains(event.target)) {
      clearScheduled();
      hideTooltip();
      parentOutsideClickHandler && parentOutsideClickHandler(event);
    }
  }

  function handleOutsideRightClick(event) {
    if (!tooltipRef.current.contains(event.target)) {
      clearScheduled();
      hideTooltip();
      parentOutsideRightClickHandler && parentOutsideRightClickHandler(event);
    }
  }

  const handleOutsideClickRef = useRef(handleOutsideClick);
  const handleOutsideRightClickRef = useRef(handleOutsideRightClick);

  function addOutsideClickHandler() {
    document.addEventListener('click', handleOutsideClickRef.current);
  }

  function removeOutsideClickHandler() {
    document.removeEventListener('click', handleOutsideClickRef.current);
  }

  function addOutsideRightClickHandler() {
    document.addEventListener(
      'contextmenu',
      handleOutsideRightClickRef.current
    );
  }

  function removeOutsideRightClickHandler() {
    document.removeEventListener(
      'contextmenu',
      handleOutsideRightClickRef.current
    );
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
      style: {...style, ...popperStyle},
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
      removeParentOutsideClickHandler && removeParentOutsideClickHandler();
      removeParentOutsideRightClickHandler &&
        removeParentOutsideRightClickHandler();
      addOutsideClickHandler();
      addOutsideRightClickHandler();
    }

    return () => {
      observer.disconnect();

      if (trigger === 'click' || trigger === 'right-click') {
        removeOutsideClickHandler();
        removeOutsideRightClickHandler();
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
        getTooltipProps,
        getArrowProps,
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
