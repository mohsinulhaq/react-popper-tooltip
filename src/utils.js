import React from 'react';
import cn from 'classnames';
import _ from 'lodash';

export const renderSlot = (El, extraProps = {}) => {
  if (_.isFunction(El)) {
    let props = extraProps;
    if (_.isFunction(extraProps)) {
      props = props();
    }
    return <El {...props} />;
  }
  if (React.isValidElement(El)) {
    let props = extraProps;
    if (_.isFunction(extraProps)) {
      props = props(El.props);
    } else if (props.className) {
      props.className = cn(props.className, El.props.className);
    }
    return React.cloneElement(El, props);
  }
  return El;
};
