import React from 'react';
import {IStateContainerProps, IStateContainerState} from './types';

class StateContainer extends React.Component<
  IStateContainerProps,
  IStateContainerState
> {
  public state: IStateContainerState = {
    on: false
  };

  public render() {
    return this.props.children({
      on: this.state.on,
      set: this.set,
      toggle: this.toggle
    });
  }

  private set = (on: boolean) => this.setState({on});
  private toggle = () => this.setState(prevState => ({on: !prevState.on}));
}

export {StateContainer};
