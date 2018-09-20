import React from 'react';

export class StateContainer extends React.Component {
  state = {
    on: false
  };

  set = on => this.setState({on});

  toggle = () => this.setState(prevState => ({ on: !prevState.on }));

  render() {
    return this.props.children({
      on: this.state.on,
      set: this.set,
      toggle: this.toggle
    });
  }
}
