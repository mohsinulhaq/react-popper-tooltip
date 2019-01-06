import React from 'react';

class EscapeToClose extends React.Component {
  componentDidMount() {
    document.addEventListener('keydown', this._handleKeyDown);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this._handleKeyDown);
  }
  render() {
    return this.props.children;
  }
  _handleKeyDown = ({key}) => {
    if (key === 'Escape') {
      this.props.closeTooltip();
    }
  };
}

export default EscapeToClose;
