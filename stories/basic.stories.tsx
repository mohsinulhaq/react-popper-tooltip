import React from 'react';
import { Story, Meta } from '@storybook/react';
import { usePopperTooltip, Config } from '../src';
import '../src/styles.css';

export const Example: Story<Config & { offsetDistance?: number }> = ({
  // eslint-disable-next-line react/prop-types
  offsetDistance,
  ...props
}) => {
  const [shown, setShown] = React.useState(false);
  const {
    visible,
    setTriggerRef,
    setTooltipRef,
    getArrowProps,
    getTooltipProps,
  } = usePopperTooltip({
    ...props,
    offset: [0, offsetDistance],
    onVisibleChange: setShown,
    visible: shown,
  });

  return (
    <>
      <button type="button" ref={setTriggerRef}>
        Trigger element
      </button>

      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({ className: 'tooltip-container' })}
        >
          <div {...getArrowProps({ className: 'tooltip-arrow' })} />
          Tooltip element
        </div>
      )}
    </>
  );
};

Example.argTypes = {
  delayHide: {
    control: {
      type: 'number',
      options: { min: 0, step: 1 },
    },
  },
  delayShow: {
    control: {
      type: 'number',
      options: { min: 0, step: 1 },
    },
  },
  followCursor: {
    control: {
      type: 'boolean',
    },
  },
  interactive: {
    control: {
      type: 'boolean',
    },
  },
  offsetDistance: {
    control: {
      type: 'number',
      options: { min: 0, step: 1 },
    },
    defaultValue: 6,
  },
  placement: {
    control: {
      type: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
  },
  trigger: {
    control: {
      type: 'select',
      options: ['hover', 'click', 'right-click', 'focus', null],
    },
  },
};

export default {
  title: 'usePopperTooltip',
} as Meta;
