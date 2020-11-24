import * as React from 'react';
import { usePopper } from 'react-popper';
import { useControlledProp, useGetLatest } from './utils';
import * as PopperJS from '@popperjs/core';

type TriggerType = 'none' | 'click' | 'right-click' | 'hover' | 'focus';

interface ConfigProps {
  /**
   * Event or events that trigger the tooltip
   * @default hover
   */
  trigger?: TriggerType | TriggerType[];
  /**
   * Delay in hiding the tooltip (ms)
   * @default 0
   */
  delayHide?: number;
  /**
   * Delay in showing the tooltip (ms)
   * @default 0
   */
  delayShow?: number;
  /**
   * Options to MutationObserver, used internally for updating
   * tooltip position based on its DOM changes
   * @default  { attributes: true, childList: true, subtree: true }
   */
  mutationObserverOptions?: MutationObserverInit;
  /**
   * Whether tooltip is shown by default
   * @default false
   */
  initialVisible?: boolean;
  /**
   * Used to create controlled tooltip
   */
  visible?: boolean;
  /**
   * Called when the visibility of the tooltip changes
   */
  onVisibleChange?: (state: boolean) => void;
  /**
   * Whether to close the tooltip when its trigger is out of boundary
   * @default true
   */
  closeOnReferenceHidden?: boolean;
  /**
   * Alias for popper.js placement, see https://popper.js.org/docs/v2/constructors/#placement
   */
  placement?: PopperJS.Placement;
  /**
   * Shorthand for popper.js offset modifier, see https://popper.js.org/docs/v2/modifiers/offset/
   * @default [0, 10]
   */
  offset?: [number, number];
}

type PopperOptions = Partial<PopperJS.Options> & {
  createPopper?: typeof PopperJS.createPopper;
};

export const defaultConfig: ConfigProps = {
  closeOnReferenceHidden: true,
  delayHide: 0,
  delayShow: 0,
  initialVisible: false,
  mutationObserverOptions: {
    attributes: true,
    childList: true,
    subtree: true,
  },
  offset: [0, 10],
  trigger: 'hover',
};

export const defaultPopperOptions: PopperOptions = {
  modifiers: [{ options: { offset: defaultConfig.offset } }],
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
    placement: config.placement,
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
