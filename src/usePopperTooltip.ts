import * as React from 'react';
import type { VirtualElement } from '@popperjs/core';
import { usePopper } from 'react-popper';
import {
  useControlledState,
  useGetLatest,
  generateBoundingClientRect,
} from './utils';
import { Config, PopperOptions, PropsGetterArgs, TriggerType } from './types';

const virtualElement: VirtualElement = {
  getBoundingClientRect: generateBoundingClientRect(),
};

const defaultConfig: Config = {
  closeOnOutsideClick: true,
  closeOnTriggerHidden: false,
  defaultVisible: false,
  delayHide: 0,
  delayShow: 0,
  followCursor: false,
  interactive: false,
  mutationObserverOptions: {
    attributes: true,
    childList: true,
    subtree: true,
  },
  offset: [0, 6],
  trigger: 'hover',
};

export function usePopperTooltip(
  config: Config = {},
  popperOptions: PopperOptions = {}
) {
  // Merging options with default options.
  // Keys with undefined values are replaced with the default ones if any.
  // Keys with other values pass through.
  const finalConfig = (
    Object.keys(defaultConfig) as Array<keyof typeof defaultConfig>
  ).reduce(
    (config, key) => ({
      ...config,
      [key]: config[key] !== undefined ? config[key] : defaultConfig[key],
    }),
    config
  );

  const defaultModifiers = React.useMemo(
    () => [{ name: 'offset', options: { offset: finalConfig.offset } }],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    Array.isArray(finalConfig.offset) ? finalConfig.offset : []
  );

  const finalPopperOptions = {
    ...popperOptions,
    placement: popperOptions.placement || finalConfig.placement,
    modifiers: popperOptions.modifiers || defaultModifiers,
  };

  const [triggerRef, setTriggerRef] = React.useState<HTMLElement | null>(null);
  const [tooltipRef, setTooltipRef] = React.useState<HTMLElement | null>(null);
  const [visible, setVisible] = useControlledState({
    initial: finalConfig.defaultVisible,
    value: finalConfig.visible,
    onChange: finalConfig.onVisibleChange,
  });

  const timer = React.useRef<number>();
  React.useEffect(() => () => clearTimeout(timer.current), []);

  const { styles, attributes, ...popperProps } = usePopper(
    finalConfig.followCursor ? virtualElement : triggerRef,
    tooltipRef,
    finalPopperOptions
  );

  const update = popperProps.update;

  const getLatest = useGetLatest({
    visible,
    triggerRef,
    tooltipRef,
    finalConfig,
  });

  const isTriggeredBy = React.useCallback(
    (trigger: TriggerType) => {
      return Array.isArray(finalConfig.trigger)
        ? finalConfig.trigger.includes(trigger)
        : finalConfig.trigger === trigger;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    Array.isArray(finalConfig.trigger)
      ? finalConfig.trigger
      : [finalConfig.trigger]
  );

  const hideTooltip = React.useCallback(() => {
    clearTimeout(timer.current);
    timer.current = window.setTimeout(
      () => setVisible(false),
      finalConfig.delayHide
    );
  }, [finalConfig.delayHide, setVisible]);

  const showTooltip = React.useCallback(() => {
    clearTimeout(timer.current);
    timer.current = window.setTimeout(
      () => setVisible(true),
      finalConfig.delayShow
    );
  }, [finalConfig.delayShow, setVisible]);

  const toggleTooltip = React.useCallback(() => {
    if (getLatest().visible) {
      hideTooltip();
    } else {
      showTooltip();
    }
  }, [getLatest, hideTooltip, showTooltip]);

  // Handle click outside
  React.useEffect(() => {
    if (!getLatest().finalConfig.closeOnOutsideClick) return;

    const handleClickOutside: EventListener = (event) => {
      const { tooltipRef, triggerRef } = getLatest();
      const target = event.composedPath?.()?.[0] || event.target;
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
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [getLatest, hideTooltip]);

  // Trigger: click
  React.useEffect(() => {
    if (triggerRef == null || !isTriggeredBy('click')) return;

    triggerRef.addEventListener('click', toggleTooltip);

    return () => triggerRef.removeEventListener('click', toggleTooltip);
  }, [triggerRef, isTriggeredBy, toggleTooltip]);

  // Trigger: right-click
  React.useEffect(() => {
    if (triggerRef == null || !isTriggeredBy('right-click')) return;

    const preventDefaultAndToggle: EventListener = (event) => {
      // Don't show the context menu
      event.preventDefault();
      toggleTooltip();
    };

    triggerRef.addEventListener('contextmenu', preventDefaultAndToggle);
    return () =>
      triggerRef.removeEventListener('contextmenu', preventDefaultAndToggle);
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
    if (tooltipRef == null || !getLatest().finalConfig.interactive) return;

    tooltipRef.addEventListener('mouseenter', showTooltip);
    tooltipRef.addEventListener('mouseleave', hideTooltip);
    return () => {
      tooltipRef.removeEventListener('mouseenter', showTooltip);
      tooltipRef.removeEventListener('mouseleave', hideTooltip);
    };
  }, [tooltipRef, showTooltip, hideTooltip, getLatest]);

  // Handle closing tooltip if trigger hidden
  const isReferenceHidden =
    popperProps?.state?.modifiersData?.hide?.isReferenceHidden;
  React.useEffect(() => {
    if (finalConfig.closeOnTriggerHidden && isReferenceHidden) hideTooltip();
  }, [finalConfig.closeOnTriggerHidden, hideTooltip, isReferenceHidden]);

  // Handle follow cursor
  React.useEffect(() => {
    if (!finalConfig.followCursor || triggerRef == null) return;

    function setMousePosition({
      clientX,
      clientY,
    }: {
      clientX: number;
      clientY: number;
    }) {
      virtualElement.getBoundingClientRect = generateBoundingClientRect(
        clientX,
        clientY
      );
      update?.();
    }

    triggerRef.addEventListener('mousemove', setMousePosition);
    return () => triggerRef.removeEventListener('mousemove', setMousePosition);
  }, [finalConfig.followCursor, triggerRef, update]);

  // Handle tooltip DOM mutation changes (aka mutation observer)
  React.useEffect(() => {
    if (
      tooltipRef == null ||
      update == null ||
      finalConfig.mutationObserverOptions == null
    )
      return;

    const observer = new MutationObserver(update);
    observer.observe(tooltipRef, finalConfig.mutationObserverOptions);
    return () => observer.disconnect();
  }, [finalConfig.mutationObserverOptions, tooltipRef, update]);

  // Tooltip props getter
  const getTooltipProps = (args: PropsGetterArgs = {}) => {
    return {
      ...args,
      style: {
        ...args.style,
        ...styles.popper,
      },
      ...attributes.popper,
      'data-popper-interactive': finalConfig.interactive,
    };
  };

  // Arrow props getter
  const getArrowProps = (args: PropsGetterArgs = {}) => {
    return {
      ...args,
      ...attributes.arrow,
      style: {
        ...args.style,
        ...styles.arrow,
      },
      'data-popper-arrow': true,
    };
  };

  return {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    tooltipRef,
    triggerRef,
    visible,
    ...popperProps,
  };
}
