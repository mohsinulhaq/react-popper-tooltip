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
  delayHide,
  delayShow,
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
    'initialVisible'
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
      initialVisible: initialVisible || DEPRECATED_defaultTooltipShown,
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
          ? createPortal(popper, portalContainer)
          : popper
        : null}
    </>
  );
}

TooltipTrigger.defaultProps = defaultProps;

function renameWarning<T>(prop: T, oldName: string, newName: string): void {
  if (process.env.NODE_ENV !== 'production' && prop !== undefined) {
    console.error(
      `react-popper-tooltip: "${oldName}" prop was renamed and will be removed in the next major version. Use "${newName}" instead.`
    );
  }
}

function removeWarning<T>(prop: T, name: string): void {
  if (process.env.NODE_ENV !== 'production' && prop !== undefined) {
    console.error(
      `react-popper-tooltip: "${name}" prop is no longer supported. See the migration guide on https://github.com/mohsinulhaq/react-popper-tooltip`
    );
  }
}
