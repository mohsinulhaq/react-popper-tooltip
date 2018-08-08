import styled from 'react-emotion';

export const PopperBox = styled('div')`
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: white;
  border: 1px solid silver;
  border-radius: 3px;
  margin: 0.4rem;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  ${props => props.popperStyle};
`;

export const TransitionedPopperBox = styled(PopperBox)`
  transition: opacity 0.3s;
`;

export const Arrow = styled('div')`
  position: absolute;
  width: 1rem;
  height: 1rem;
  &[data-placement*='bottom'] {
    top: 0;
    left: 0;
    margin-top: -0.4rem;
    width: 1rem;
    height: 1rem;
    &::before {
      border-width: 0 0.5rem 0.4rem 0.5rem;
      border-color: transparent transparent silver transparent;
      position: absolute;
      top: -1px;
    }
    &::after {
      border-width: 0 0.5rem 0.4rem 0.5rem;
      border-color: transparent transparent white transparent;
    }
  }
  &[data-placement*='top'] {
    bottom: 0;
    left: 0;
    margin-bottom: -1rem;
    width: 1rem;
    height: 1rem;
    &::before {
      border-width: 0.4rem 0.5rem 0 0.5rem;
      border-color: silver transparent transparent transparent;
      position: absolute;
      top: 1px;
    }
    &::after {
      border-width: 0.4rem 0.5rem 0 0.5rem;
      border-color: white transparent transparent transparent;
    }
  }
  &[data-placement*='right'] {
    left: 0;
    margin-left: -0.7rem;
    height: 1rem;
    width: 1rem;
    &::before {
      border-width: 0.5rem 0.4rem 0.5rem 0;
      border-color: transparent silver transparent transparent;
    }
    &::after {
      border-width: 0.5rem 0.4rem 0.5rem 0;
      border-color: transparent white transparent transparent;
      top: 0px;
      left: 6px;
    }
  }
  &[data-placement*='left'] {
    right: 0;
    margin-right: -0.7rem;
    height: 1rem;
    width: 1rem;
    &::before {
      border-width: 0.5rem 0 0.5rem 0.4em;
      border-color: transparent transparent transparent silver;
    }
    &::after {
      border-width: 0.5rem 0 0.5rem 0.4em;
      border-color: transparent transparent transparent white;
      top: 0;
      left: 4px;
    }
  }
  &::before {
    content: '';
    margin: auto;
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
  }
  &::after {
    content: '';
    margin: auto;
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
  }
`;
