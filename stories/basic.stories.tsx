import React from 'react';
import { Story, Meta } from '@storybook/react';
import { usePopperTooltip, Config } from '../src';
import '../src/styles.css';

export const Example: Story<Config> = (props) => {
  const [shown, setShown] = React.useState(false);
  const {
    visible,
    setTriggerRef,
    setTooltipRef,
    getArrowProps,
    getTooltipProps,
  } = usePopperTooltip({
    ...props,
    visible: shown,
    onVisibilityChange: setShown,
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
