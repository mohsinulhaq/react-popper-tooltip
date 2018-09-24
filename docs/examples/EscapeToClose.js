import React from 'react';

export default class EscapeToClose extends React.Component {
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
