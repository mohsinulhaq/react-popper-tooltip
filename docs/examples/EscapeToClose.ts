import React from 'react';

class EscapeToClose extends React.Component<{closeTooltip: () => void}> {
  public componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }
  public componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }
  public render() {
    return this.props.children;
  }
  private handleKeyDown = ({key}: {key: string}) => {
    if (key === 'Escape') {
      this.props.closeTooltip();
    }
  };
}

export default EscapeToClose;
