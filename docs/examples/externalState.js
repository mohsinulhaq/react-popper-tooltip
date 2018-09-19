import React from 'react';
import TooltipTrigger from '../../src/index';
import '../../src/styles.css';

export const Tooltip = ({ tooltip, children, ...props }) => (
  <TooltipTrigger
    {...props}
    tooltip={({
      getTooltipProps,
      getArrowProps,
      tooltipRef,
      arrowRef,
      placement
    }) => (
      <TooltipEsc
        {...getTooltipProps({
          innerRef: tooltipRef,
          className: "tooltip-container",
          handleTooltipState: props.onVisibilityChange
        })}
      >
        <div
          {...getArrowProps({
            ref: arrowRef,
            "data-placement": placement,
            className: "tooltip-arrow"
          })}
        />
        {tooltip}
      </TooltipEsc>
    )}
  >
    {({ getTriggerProps, triggerRef }) => (
      <span
        {...getTriggerProps({
          ref: triggerRef,
          className: "trigger"
        })}
      >
        {children}
      </span>
    )}
  </TooltipTrigger>
);

export class TooltipEsc extends React.Component {
  componentDidMount() {
    document.addEventListener("keydown", this._keyboardShortCutHandler);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this._keyboardShortCutHandler);
  }

  _keyboardShortCutHandler = e => {
    if (e.defaultPrevented) {
      return;
    }
    if (e.key === "Escape" || e.keyCode === 27) {
      this.props.handleTooltipState(false);
    }
  };

  render() {
    // filter out `handleTooltipState` handler
    const { innerRef, handleTooltipState, ...props } = this.props;
    return <div ref={innerRef} {...props} />;
  }
}

export class Container extends React.Component {
  state = {
    on: false
  };

  set = state => this.setState({ on: state });

  render() {
    return this.props.children({
      on: this.state.on,
      set: this.set
    });
  }
}
