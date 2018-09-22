import React from 'react';
import T from 'prop-types';

export default class EscapeToClose extends React.Component {
  static propTypes = {
    closeTooltip: T.func.required,
    children: T.object
  };

  componentDidMount() {
    document.addEventListener('keydown', this._handleKeyDown);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this._handleKeyDown);
  }
  _handleKeyDown = ({ key }) => {
    if (key === 'Escape') {
      this.props.closeTooltip();
    }
  };
  render() {
    return this.props.children;
  }
}
