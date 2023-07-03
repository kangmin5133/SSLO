import React from 'react';
import styled, { keyframes } from 'styled-components';
interface ILoaderText {
  color?: string;
  text?: string;
  size?: 'small' | 'normal' | 'default';
}
const FadeInAnimation = keyframes`
    0% {
        opacity: 100%
    }
    25% {
        opacity: 25%;
    }
    50% {
        opacity: 0%;
    }
    100% {
        opacity: 100%;
    }
`;
const Loader = styled.span<{ customColor: string; size: string }>`
  font-size: ${(props) =>
    props.size === 'normal'
      ? '15px'
      : props.size === 'small'
      ? '13px'
      : '20px'};
  font-weight: 700;
  color: ${(props) =>
    props.customColor === 'default' ? '#FFF' : props.customColor};
  animation: ${FadeInAnimation} 1s linear infinite;
`;

const LoaderText: React.FC<ILoaderText> = ({
  color = 'default',
  text = 'Loading...',
  size = 'normal',
}) => {
  return (
    <Loader customColor={color} size={size}>
      {text}
    </Loader>
  );
};

export default LoaderText;
