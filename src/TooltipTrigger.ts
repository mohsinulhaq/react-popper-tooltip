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

export function TooltipTrigger({
  children,
  tooltip,
  defaultTooltipShown,
  onVisibilityChange,
  tooltipShown,
  delayShow,
  delayHide,
  placement,
  trigger,
  getTriggerRef,
  closeOnReferenceHidden,
  usePortal,
  portalContainer,
  modifiers,
  mutationObserverOptions,
}: TooltipTriggerProps) {
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
      initialVisible: defaultTooltipShown,
      onVisibleChange: onVisibilityChange,
      visible: tooltipShown,
      closeOnReferenceHidden,
      mutationObserverOptions,
    },
    {
      placement,
      modifiers,
    }
  );

  const reference = children({
    getTriggerProps: (props) => props,
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

  return [
    reference,
    visible
      ? usePortal
        ? createPortal(popper, portalContainer)
        : popper
      : null,
  ];
}

TooltipTrigger.defaultProps = defaultProps;
