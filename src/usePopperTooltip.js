import React from "react";
import { usePopper } from "react-popper";
import { useControlledProp, useGetLatest } from "./utils";

const defaultConfig = {
  trigger: "click",
  delayHide: 0,
  delayShow: 0,
};

export function usePopperTooltip(config, popperOptions) {
  config = {
    ...defaultConfig,
    ...config,
  };

  const [triggerRef, setTriggerRef] = React.useState(null);
  const [tooltipRef, setTooltipRef] = React.useState(null);
  const [arrowRef, setArrowRef] = React.useState(null);
  const [visible, setVisible] = useControlledProp({
    initial: config.initialVisible,
    value: config.visible,
    onChange: config.onVisibleChange,
  });

  const timer = React.useRef();

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
    (event) => {
      const { config } = getLatest();

      return Array.isArray(config.trigger)
        ? config.trigger.includes(event)
        : config.trigger === event;
    },
    [getLatest]
  );

  const hideTooltip = React.useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(
      () => setVisible(false),
      getLatest().config.delayHide
    );
  }, [getLatest, setVisible]);

  const showTooltip = React.useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(
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
    const handleStart = (event) => {
      const { tooltipRef, triggerRef } = getLatest();
      const target = event.target;
      if (target instanceof Node) {
        if (
          tooltipRef != null &&
          !tooltipRef.contains(target) &&
          !triggerRef.contains(target)
        ) {
          hideTooltip();
        }
      }
    };

    document.addEventListener("touchstart", handleStart);
    document.addEventListener("mousedown", handleStart);

    return () => {
      document.removeEventListener("touchstart", handleStart);
      document.removeEventListener("mousedown", handleStart);
    };
  }, [getLatest, hideTooltip]);

  // Trigger: click
  React.useEffect(() => {
    if (triggerRef == null || !isTriggeredBy("click")) return;

    triggerRef.addEventListener("click", toggleTooltip);
    return () => triggerRef.removeEventListener("click", toggleTooltip);
  }, [triggerRef, isTriggeredBy, toggleTooltip]);

  // Trigger: focus
  React.useEffect(() => {
    if (triggerRef == null || !isTriggeredBy("focus")) return;

    triggerRef.addEventListener("focus", showTooltip);
    triggerRef.addEventListener("blur", hideTooltip);
    return () => {
      triggerRef.removeEventListener("focus", showTooltip);
      triggerRef.removeEventListener("blur", hideTooltip);
    };
  }, [triggerRef, isTriggeredBy, showTooltip, hideTooltip]);

  // Trigger: hover on trigger
  React.useEffect(() => {
    if (triggerRef == null || !isTriggeredBy("hover")) return;

    triggerRef.addEventListener("mouseenter", showTooltip);
    triggerRef.addEventListener("mouseleave", hideTooltip);
    return () => {
      triggerRef.removeEventListener("mouseenter", showTooltip);
      triggerRef.removeEventListener("mouseleave", hideTooltip);
    };
  }, [triggerRef, isTriggeredBy, showTooltip, hideTooltip]);

  // Trigger: hover on tooltip, keep it open if hovered
  React.useEffect(() => {
    if (tooltipRef == null || !isTriggeredBy("hover")) return;

    tooltipRef.addEventListener("mouseenter", showTooltip);
    tooltipRef.addEventListener("mouseleave", hideTooltip);
    return () => {
      tooltipRef.removeEventListener("mouseenter", showTooltip);
      tooltipRef.removeEventListener("mouseleave", hideTooltip);
    };
  }, [tooltipRef, isTriggeredBy, showTooltip, hideTooltip]);

  // Tooltip props getter
  const getTooltipProps = (args = {}) => {
    return {
      ...args,
      style: { ...styles.popper, ...args.style },
      ...attributes.popper,
    };
  };

  // Arrow props getter
  const getArrowProps = (args = {}) => {
    return {
      ...args,
      style: { ...styles.arrow, ...args.style },
      ...attributes.arrow,
      "data-popper-arrow": true,
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
