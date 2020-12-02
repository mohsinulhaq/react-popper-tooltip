import * as React from 'react';
import { createPortal } from 'react-dom';
import { usePopperTooltip } from './usePopperTooltip';
import { TooltipTriggerProps } from './types';

const canUseDOM = Boolean(
  typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
);

const defaultProps = {
  placement: 'right',
  portalContainer: canUseDOM ? document.body : null,
  usePortal: canUseDOM,
};

let getTriggerPropsWarningShown = false;

export function TooltipTrigger({
  children,
  closeOnTriggerHidden,
  delayHide,
  delayShow,
  followCursor,
  getTriggerRef,
  initialVisible,
  modifiers,
  mutationObserverOptions,
  onVisibleChange,
  placement,
  portalContainer,
  tooltip,
  trigger,
  usePortal,
  visible: controlledVisible,

  /* DEPRICATED */
  closeOnReferenceHidden: DEPRECATED_closeOnReferenceHidden,
  defaultTooltipShown: DEPRECATED_defaultTooltipShown,
  onVisibilityChange: DEPRECATED_onVisibilityChange,
  tooltipShown: DEPRECATED_tooltipShown,
}: TooltipTriggerProps) {
  if (process.env.NODE_ENV !== 'production') {
    if (followCursor !== undefined) {
      console.error(
        'react-popper-tooltip: "followCursor" prop is no longer supported. See the migration guide on https://github.com/mohsinulhaq/react-popper-tooltip'
      );
    }

    if (DEPRECATED_closeOnReferenceHidden !== undefined) {
      console.warn(
        'react-popper-tooltip: "closeOnReferenceHidden" prop was renamed and will be removed in the next major version. Use "closeOnTriggerHidden" instead.'
      );
    }

    if (DEPRECATED_defaultTooltipShown !== undefined) {
      console.warn(
        'react-popper-tooltip: "defaultTooltipShown" prop was renamed and will be removed in the next major version. Use "initialVisible" instead.'
      );
    }

    if (DEPRECATED_onVisibilityChange !== undefined) {
      console.warn(
        'react-popper-tooltip: "onVisibilityChange" prop was renamed and will be removed in the next major version. Use "onVisibleChange" instead.'
      );
    }

    if (DEPRECATED_tooltipShown !== undefined) {
      console.warn(
        'react-popper-tooltip: "tooltipShown" prop was renamed and will be removed in the next major version. Use "visible" instead.'
      );
    }
  }

  const {
    triggerRef,
    getArrowProps,
    getTooltipProps,
    setArrowRef,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip(
    {
      trigger,
      delayHide,
      delayShow,
      initialVisible: initialVisible || DEPRECATED_defaultTooltipShown,
      onVisibleChange: onVisibleChange || DEPRECATED_onVisibilityChange,
      visible: controlledVisible || DEPRECATED_tooltipShown,
      closeOnTriggerHidden:
        closeOnTriggerHidden || DEPRECATED_closeOnReferenceHidden,
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
    placement,
  });

  React.useEffect(() => {
    if (typeof getTriggerRef === 'function') getTriggerRef(triggerRef);
  }, [triggerRef, getTriggerRef]);

  return (
    <>
      {reference}
      {visible
        ? usePortal
          ? createPortal(popper, portalContainer)
          : popper
        : null}
    </>
  );
}

TooltipTrigger.defaultProps = defaultProps;
