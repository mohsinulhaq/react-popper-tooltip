import * as React from 'react';
import { usePopper } from 'react-popper';
import { useControlledProp, useGetLatest } from './utils';
import {
  ConfigProps,
  PopperOptions,
  PropsGetterArgs,
  TriggerType,
} from './types';

export function usePopperTooltip(
  originalConfig: ConfigProps = {},
  originalPopperOptions: PopperOptions = {}
) {
  const config = {
    ...originalConfig,
    closeOnReferenceHidden: originalConfig.closeOnReferenceHidden || true,
    delayHide: originalConfig.delayHide || 0,
    delayShow: originalConfig.delayShow || 0,
    initialVisible: originalConfig.initialVisible || false,
    mutationObserverOptions: originalConfig.mutationObserverOptions || {
      attributes: true,
      childList: true,
      subtree: true,
    },
    offset: originalConfig.offset || [0, 10],
    trigger: originalConfig.trigger || 'hover',
  };

  const popperOptions = {
    ...originalPopperOptions,
    placement: originalPopperOptions.placement || config.placement,
    modifiers: originalPopperOptions.modifiers || [
      { name: 'offset', options: { offset: config.offset } },
    ],
  };

  const [triggerRef, setTriggerRef] = React.useState<HTMLElement | null>(null);
  const [tooltipRef, setTooltipRef] = React.useState<HTMLElement | null>(null);
  const [arrowRef, setArrowRef] = React.useState<HTMLElement | null>(null);
  const [visible, setVisible] = useControlledProp({
    initial: config.initialVisible,
    value: config.visible,
    onChange: config.onVisibleChange,
  });

  const timer = React.useRef<number>();

  const { styles, attributes, ...popperProps } = usePopper(
    triggerRef,
    tooltipRef,
    popperOptions
  );

  const getLatest = useGetLatest({
    visible,
    triggerRef,
    tooltipRef,
    config,
  });

  const isTriggeredBy = React.useCallback(
    (trigger: TriggerType) => {
      const { config } = getLatest();

      return Array.isArray(config.trigger)
        ? config.trigger.includes(trigger)
        : config.trigger === trigger;
    },
    [getLatest]
  );

  const hideTooltip = React.useCallback(() => {
    clearTimeout(timer.current);
    timer.current = window.setTimeout(
      () => setVisible(false),
      getLatest().config.delayHide
    );
  }, [getLatest, setVisible]);

  const showTooltip = React.useCallback(() => {
    clearTimeout(timer.current);
    timer.current = window.setTimeout(
      () => setVisible(true),
      getLatest().config.delayShow
    );
  }, [getLatest, setVisible]);

  const toggleTooltip = React.useCallback(() => {
    if (getLatest().visible) {
      hideTooltip();
    } else {
      showTooltip();
    }
  }, [getLatest, hideTooltip, showTooltip]);

  React.useEffect(() => clearTimeout(timer.current), []);

  // Handle click outside
  React.useEffect(() => {
    const handleStart: EventListener = (event) => {
      const { tooltipRef, triggerRef } = getLatest();
      const target = event.target;
      if (target instanceof Node) {
        if (
          tooltipRef != null &&
          triggerRef != null &&
          !tooltipRef.contains(target) &&
          !triggerRef.contains(target)
        ) {
          hideTooltip();
        }
      }
    };

    document.addEventListener('touchstart', handleStart);
    document.addEventListener('mousedown', handleStart);

    return () => {
      document.removeEventListener('touchstart', handleStart);
      document.removeEventListener('mousedown', handleStart);
    };
  }, [getLatest, hideTooltip]);

  // Trigger: click
  React.useEffect(() => {
    if (triggerRef == null || !isTriggeredBy('click')) return;

    triggerRef.addEventListener('click', toggleTooltip);
    return () => triggerRef.removeEventListener('click', toggleTooltip);
  }, [triggerRef, isTriggeredBy, toggleTooltip]);

  // Trigger: focus
  React.useEffect(() => {
    if (triggerRef == null || !isTriggeredBy('focus')) return;

    triggerRef.addEventListener('focus', showTooltip);
    triggerRef.addEventListener('blur', hideTooltip);
    return () => {
      triggerRef.removeEventListener('focus', showTooltip);
      triggerRef.removeEventListener('blur', hideTooltip);
    };
  }, [triggerRef, isTriggeredBy, showTooltip, hideTooltip]);

  // Trigger: hover on trigger
  React.useEffect(() => {
    if (triggerRef == null || !isTriggeredBy('hover')) return;

    triggerRef.addEventListener('mouseenter', showTooltip);
    triggerRef.addEventListener('mouseleave', hideTooltip);
    return () => {
      triggerRef.removeEventListener('mouseenter', showTooltip);
      triggerRef.removeEventListener('mouseleave', hideTooltip);
    };
  }, [triggerRef, isTriggeredBy, showTooltip, hideTooltip]);

  // Trigger: hover on tooltip, keep it open if hovered
  React.useEffect(() => {
    if (tooltipRef == null || !isTriggeredBy('hover')) return;

    tooltipRef.addEventListener('mouseenter', showTooltip);
    tooltipRef.addEventListener('mouseleave', hideTooltip);
    return () => {
      tooltipRef.removeEventListener('mouseenter', showTooltip);
      tooltipRef.removeEventListener('mouseleave', hideTooltip);
    };
  }, [tooltipRef, isTriggeredBy, showTooltip, hideTooltip]);

  // Handle closeOnReferenceHidden prop
  const isReferenceHidden =
    popperProps.state?.modifiersData?.hide?.isReferenceHidden;
  React.useEffect(() => {
    if (getLatest().config.closeOnReferenceHidden && isReferenceHidden)
      hideTooltip();
  }, [getLatest, hideTooltip, isReferenceHidden]);

  // Handle tooltip DOM mutation changes (aka mutation observer)
  const update = popperProps.update;
  React.useEffect(() => {
    const mutationObserverOptions = getLatest().config.mutationObserverOptions;
    if (tooltipRef == null || update == null || mutationObserverOptions == null)
      return;

    const observer = new MutationObserver(update);
    observer.observe(tooltipRef, mutationObserverOptions);
    return () => observer.disconnect();
  }, [getLatest, tooltipRef, update]);

  // Tooltip props getter
  const getTooltipProps = (args: PropsGetterArgs = {}) => {
    return {
      ...args,
      style: { ...styles.popper, ...args.style },
      ...attributes.popper,
    };
  };

  // Arrow props getter
  const getArrowProps = (args: PropsGetterArgs = {}) => {
    return {
      ...args,
      style: { ...styles.arrow, ...args.style },
      ...attributes.arrow,
      'data-popper-arrow': true,
    };
  };

  return {
    arrowRef,
    tooltipRef,
    triggerRef,
    getArrowProps,
    getTooltipProps,
    setArrowRef,
    setTooltipRef,
    setTriggerRef,
    visible,
    ...popperProps,
  };
}
