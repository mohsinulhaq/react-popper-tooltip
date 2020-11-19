import * as React from 'react';
import { usePopper } from 'react-popper';
import { useControlledProp, useGetLatest } from './utils';
import * as PopperJS from '@popperjs/core';

interface ConfigProps {
  trigger?: TriggerTypes;
  delayHide?: number;
  delayShow?: number;
  mutationObserverOptions?: MutationObserverInit;
  initialVisible?: boolean;
  visible?: boolean;
  onVisibleChange?: (state: boolean) => void;
  closeOnReferenceHidden?: boolean;
}

type PopperOptions = Partial<PopperJS.Options> & {
  createPopper?: typeof PopperJS.createPopper;
};

type TriggerTypes = 'none' | 'click' | 'right-click' | 'hover' | 'focus';

export const defaultConfig: ConfigProps = {
  trigger: 'hover',
  delayHide: 0,
  delayShow: 0,
  initialVisible: false,
  mutationObserverOptions: {
    attributes: true,
    childList: true,
    subtree: true,
  },
};

export const defaultPopperOptions = {
  modifiers: [{ options: { offset: [0, 10] } }],
};

export function usePopperTooltip(
  config: ConfigProps = {},
  popperOptions?: PopperOptions
) {
  config = {
    ...defaultConfig,
    ...config,
  };

  popperOptions = {
    ...defaultPopperOptions,
    ...popperOptions,
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
    (trigger: TriggerTypes) => {
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
  const getTooltipProps = (args: { style?: React.CSSProperties } = {}) => {
    return {
      ...args,
      style: { ...styles.popper, ...args.style },
      ...attributes.popper,
    };
  };

  // Arrow props getter
  const getArrowProps = (args: { style?: React.CSSProperties } = {}) => {
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
