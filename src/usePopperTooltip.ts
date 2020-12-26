import * as React from 'react';
import { usePopper } from 'react-popper';
import { useControlledProp, useGetLatest } from './utils';
import {
  ConfigProps,
  FollowCursorStore,
  PopperOptions,
  PropsGetterArgs,
  TriggerType,
} from './types';

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
  trigger: 'hover',
};

export function usePopperTooltip(
  originalConfig: ConfigProps = {},
  originalPopperOptions: PopperOptions = {}
) {
  // Merging options with default options.
  // Keys with undefined values are replaced with the default ones if any.
  // Keys with null values pass through.
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
    initial: config.defaultVisible,
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
    update: popperProps.update,
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
    if (
      tooltipRef == null ||
      !isTriggeredBy('hover') ||
      !getLatest().config.interactive
    )
      return;

    tooltipRef.addEventListener('mouseenter', showTooltip);
    tooltipRef.addEventListener('mouseleave', hideTooltip);
    return () => {
      tooltipRef.removeEventListener('mouseenter', showTooltip);
      tooltipRef.removeEventListener('mouseleave', hideTooltip);
    };
  }, [tooltipRef, isTriggeredBy, showTooltip, hideTooltip, getLatest]);

  // Handle closing tooltip if trigger hidden
  const isReferenceHidden =
    popperProps?.state?.modifiersData?.hide?.isReferenceHidden;
  React.useEffect(() => {
    if (config.closeOnTriggerHidden && isReferenceHidden) hideTooltip();
  }, [config.closeOnTriggerHidden, hideTooltip, isReferenceHidden]);

  // Handle follow cursor
  const store = React.useRef<FollowCursorStore>();

  React.useEffect(() => {
    if (!config.followCursor || triggerRef == null || tooltipRef == null)
      return;

    const tooltipRect = tooltipRef.getBoundingClientRect();

    function storeMousePosition({
      pageX,
      pageY,
    }: {
      pageX: number;
      pageY: number;
    }) {
      store.current = { pageX, pageY, ...tooltipRect };
      if (popperProps.update !== null) popperProps.update();
    }

    triggerRef.addEventListener('mousemove', storeMousePosition);
    return () =>
      triggerRef.removeEventListener('mousemove', storeMousePosition);
    // eslint-disable-next-line
  }, [
    triggerRef,
    tooltipRef,
    getLatest,
    config.followCursor,
    popperProps.update,
  ]);

  function getFollowCursorTransform() {
    if (tooltipRef == null || store.current == null) return;

    const { pageX, pageY, width, height } = store.current;

    const x =
      pageX + width > window.pageXOffset + document.body.offsetWidth
        ? pageX - width
        : pageX;
    const y =
      pageY + height > window.pageYOffset + document.body.offsetHeight
        ? pageY - height
        : pageY;
    return { transform: `translate3d(${x}px, ${y}px, 0` };
  }

  // Handle tooltip DOM mutation changes (aka mutation observer)
  const update = popperProps.update;
  React.useEffect(() => {
    const mutationObserverOptions = config.mutationObserverOptions;
    if (tooltipRef == null || update == null || mutationObserverOptions == null)
      return;

    const observer = new MutationObserver(update);
    observer.observe(tooltipRef, mutationObserverOptions);
    return () => observer.disconnect();
  }, [config.mutationObserverOptions, tooltipRef, update]);

  // Tooltip props getter
  const getTooltipProps = (args: PropsGetterArgs = {}) => {
    return {
      ...args,
      style: {
        ...args.style,
        ...styles.popper,
        ...(config.followCursor ? getFollowCursorTransform() : {}),
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
