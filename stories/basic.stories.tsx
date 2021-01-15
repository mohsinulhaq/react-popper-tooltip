import React from 'react';
import { Story, Meta } from '@storybook/react';
import { usePopperTooltip, Config } from '../src';
import '../src/styles.css';

export const Example: Story<Config> = (props) => {
  const {
    visible,
    setTriggerRef,
    setArrowRef,
    setTooltipRef,
    getArrowProps,
    getTooltipProps,
  } = usePopperTooltip(props);

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
          Tooltip element
          <div
            ref={setArrowRef}
            {...getArrowProps({ className: 'tooltip-arrow' })}
          />
        </div>
      )}
    </>
  );
};

Example.argTypes = {
  trigger: {
    control: {
      type: 'select',
      options: ['hover', 'click', 'right-click', 'focus', null],
    },
  },
  placement: {
    control: {
      type: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
  },
  followCursor: {
    control: {
      type: 'boolean',
    },
  },
};

export default {
  title: 'usePopperTooltip',
} as Meta;
