import * as React from 'react';
import { usePopper } from 'react-popper';
import {
  useControlledProp,
  useGetLatest,
  generateGetBoundingClientRect,
} from './utils';
import {
  ConfigProps,
  PopperOptions,
  PropsGetterArgs,
  TriggerType,
} from './types';

const virtualElement = {
  getBoundingClientRect: generateGetBoundingClientRect(),
};

const defaultConfig: ConfigProps = {
  closeOnClickOutside: true,
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
  originalConfig: ConfigProps = {},
  originalPopperOptions: PopperOptions = {}
) {
  // Merging options with default options.
  // Keys with undefined values are replaced with the default ones if any.
  // Keys with other values pass through.
  const config = (Object.keys(defaultConfig) as Array<
    keyof typeof defaultConfig
  >).reduce(
    (config, key) => ({
      ...config,
      [key]:
        originalConfig[key] !== undefined
          ? originalConfig[key]
          : defaultConfig[key],
    }),
    originalConfig
  );

  const defaultModifiers = React.useMemo(
    () => [{ name: 'offset', options: { offset: config.offset } }],
    [config.offset]
  );

  const popperOptions = {
    ...originalPopperOptions,
    placement: originalPopperOptions.placement || config.placement,
    modifiers: originalPopperOptions.modifiers || defaultModifiers,
  };

  const [triggerRef, setTriggerRef] = React.useState<HTMLElement | null>(null);
  const [tooltipRef, setTooltipRef] = React.useState<HTMLElement | null>(null);
  const [arrowRef, setArrowRef] = React.useState<HTMLElement | null>(null);
  const [visible, setVisible] = useControlledProp({
    initial: config.defaultVisible,
    value: config.visible,
    onChange: config.onVisibleChange,
  });

  const timer = React.useRef<number>();

  const { styles, attributes, ...popperProps } = usePopper(
    config.followCursor ? virtualElement : triggerRef,
    tooltipRef,
    popperOptions
  );

  const update = popperProps.update;

  const getLatest = useGetLatest({
    visible,
    triggerRef,
    tooltipRef,
    config,
  });

  const isTriggeredBy = React.useCallback(
    (trigger: TriggerType) => {
      return Array.isArray(config.trigger)
        ? config.trigger.includes(trigger)
        : config.trigger === trigger;
    },
    [config.trigger]
  );

  const hideTooltip = React.useCallback(() => {
    clearTimeout(timer.current);
    timer.current = window.setTimeout(
      () => setVisible(false),
      config.delayHide
    );
  }, [config.delayHide, setVisible]);

  const showTooltip = React.useCallback(() => {
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setVisible(true), config.delayShow);
  }, [config.delayShow, setVisible]);

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
    if (!getLatest().config.closeOnClickOutside) return;

    const handleClickOutside: EventListener = (event) => {
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
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [getLatest, hideTooltip]);

  // Trigger: click
  React.useEffect(() => {
    if (triggerRef == null || !isTriggeredBy('click')) return;

    triggerRef.addEventListener('click', toggleTooltip);

    return () => {
      triggerRef.removeEventListener('click', toggleTooltip);
    };
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
    if (tooltipRef == null || !getLatest().config.interactive) return;

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
    if (config.closeOnTriggerHidden && isReferenceHidden) hideTooltip();
  }, [config.closeOnTriggerHidden, hideTooltip, isReferenceHidden]);

  // Handle follow cursor
  React.useEffect(() => {
    if (!config.followCursor || triggerRef == null) return;

    function setMousePosition({
      clientX,
      clientY,
    }: {
      clientX: number;
      clientY: number;
    }) {
      virtualElement.getBoundingClientRect = generateGetBoundingClientRect(
        clientX,
        clientY
      );
      if (update) update();
    }

    triggerRef.addEventListener('mousemove', setMousePosition);
    return () => triggerRef.removeEventListener('mousemove', setMousePosition);
  }, [config.followCursor, triggerRef, update]);

  // Handle tooltip DOM mutation changes (aka mutation observer)
  React.useEffect(() => {
    if (
      tooltipRef == null ||
      update == null ||
      config.mutationObserverOptions == null
    )
      return;

    const observer = new MutationObserver(update);
    observer.observe(tooltipRef, config.mutationObserverOptions);
    return () => observer.disconnect();
  }, [config.mutationObserverOptions, tooltipRef, update]);

  // Tooltip props getter
  const getTooltipProps = (args: PropsGetterArgs = {}) => {
    return {
      ...args,
      style: {
        ...args.style,
        ...styles.popper,
      },
      ...attributes.popper,
    };
  };

  // Arrow props getter
  const getArrowProps = (args: PropsGetterArgs = {}) => {
    return {
      ...args,
      style: { ...args.style, ...styles.arrow },
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
