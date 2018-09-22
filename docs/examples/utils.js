import React from 'react';
import T from 'prop-types';

export class StateContainer extends React.Component {
  static propTypes = {
    children: T.func.required
  };

  state = {
    on: false
  };

  set = on => this.setState({ on });

  toggle = () => this.setState(prevState => ({ on: !prevState.on }));

  render() {
    return this.props.children({
      on: this.state.on,
      set: this.set,
      toggle: this.toggle
    });
  }
}
