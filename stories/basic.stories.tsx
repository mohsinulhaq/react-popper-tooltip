import React from 'react';
import { Story, Meta } from '@storybook/react';
import { usePopperTooltip, Config } from '../src';
import '../src/styles.css';

type ExampleProps = Config & { offsetDistance?: number };

export const Example: Story<ExampleProps> = ({
  offsetDistance,
  ...props
}: ExampleProps) => {
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

export const ScrollParent: Story<ExampleProps> = (props: ExampleProps) => {
  return (
    <div style={{ maxHeight: '200px', overflowY: 'scroll' }}>
      {Array(100)
        .fill(null)
        .map((_, i) => (
          <div key={i}>
            <Example {...props} />
          </div>
        ))}
    </div>
  );
};

ScrollParent.argTypes = Example.argTypes;

export default {
  title: 'usePopperTooltip',
} as Meta;
