import React from 'react';
import { StateContainerProps, StateContainerState } from './types';

class StateContainer extends React.Component<
  StateContainerProps,
  StateContainerState
> {
  public state: StateContainerState = {
    on: false,
  };

  public render() {
    return this.props.children({
      on: this.state.on,
      set: this.set,
      toggle: this.toggle,
    });
  }

  private set = (on: boolean) => this.setState({ on });
  private toggle = () => this.setState((prevState) => ({ on: !prevState.on }));
}

export { StateContainer };
