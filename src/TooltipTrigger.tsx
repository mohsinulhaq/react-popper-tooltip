import React from 'react';
import { createPortal } from 'react-dom';
import { usePopperTooltip } from './usePopperTooltip';
import { TooltipTriggerProps } from './types';
import { canUseDOM, removeWarning, renameWarning } from './utils';

let getTriggerPropsWarningShown = false;

export function TooltipTrigger({
  children,
  delayHide,
  delayShow,
  getTriggerRef,
  defaultVisible,
  modifiers,
  mutationObserverOptions,
  onVisibleChange,
  placement = 'right',
  portalContainer = canUseDOM ? document.body : null,
  tooltip,
  trigger,
  usePortal = canUseDOM,
  visible: controlledVisible,
  followCursor: DEPRECATED_followCursor,
  closeOnReferenceHidden: DEPRECATED_closeOnReferenceHidden,
  defaultTooltipShown: DEPRECATED_defaultTooltipShown,
  onVisibilityChange: DEPRECATED_onVisibilityChange,
  tooltipShown: DEPRECATED_tooltipShown,
}: TooltipTriggerProps) {
  removeWarning(DEPRECATED_followCursor, 'followCursor');
  removeWarning(DEPRECATED_closeOnReferenceHidden, 'closeOnReferenceHidden');
  renameWarning(
    DEPRECATED_defaultTooltipShown,
    'defaultTooltipShown',
    'defaultVisible'
  );
  renameWarning(
    DEPRECATED_onVisibilityChange,
    'onVisibilityChange',
    'onVisibleChange'
  );
  renameWarning(DEPRECATED_tooltipShown, 'tooltipShown', 'visible');

  const {
    triggerRef,
    getArrowProps,
    getTooltipProps,
    setArrowRef,
    setTooltipRef,
    setTriggerRef,
    visible,
    state,
  } = usePopperTooltip(
    {
      trigger,
      delayHide,
      delayShow,
      defaultVisible: defaultVisible || DEPRECATED_defaultTooltipShown,
      onVisibleChange: onVisibleChange || DEPRECATED_onVisibilityChange,
      visible: controlledVisible || DEPRECATED_tooltipShown,
      mutationObserverOptions,
    },
    {
      placement,
      modifiers,
    }
  );

  function getTriggerPropsWithWarning<T>(props: T): T {
    if (process.env.NODE_ENV !== 'production' && !getTriggerPropsWarningShown) {
      console.warn(
        'react-popper-tooltip: Using "getTriggerProps" is no longer required and will be removed in the next major version. Apply your props directly to the trigger element.'
      );
      getTriggerPropsWarningShown = true;
    }
    return props;
  }

  const reference = children({
    getTriggerProps: getTriggerPropsWithWarning,
    triggerRef: setTriggerRef,
  });

  const popper = tooltip({
    arrowRef: setArrowRef,
    tooltipRef: setTooltipRef,
    getArrowProps,
    getTooltipProps,
    placement: state ? state.placement : undefined,
  });

  React.useEffect(() => {
    if (typeof getTriggerRef === 'function') getTriggerRef(triggerRef);
  }, [triggerRef, getTriggerRef]);

  return (
    <>
      {reference}
      {visible
        ? usePortal
          ? createPortal(popper, portalContainer!)
          : popper
        : null}
    </>
  );
}
