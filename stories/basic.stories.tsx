import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { Config } from '../src/main.js';
import { usePopperTooltip } from '../src/main.js';

import '../src/styles.css';

const meta: Meta = {
  title: 'usePopperTooltip',
};

export default meta;

type ExampleProps = Config & { offsetDistance: number };

export const Example: StoryObj<ExampleProps> = {
  render: ({ offsetDistance, ...props }: ExampleProps) => {
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
  },

  argTypes: {
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
  },
};
