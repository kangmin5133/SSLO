import React from "react";
import styled, { keyframes } from "styled-components";
import headerLogo from "../assets/images/project/header+menu/header-logo.svg";

interface ILoader {
  small?: boolean;
}
const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;
const FadeInAnimation = keyframes`
    0% {
        transform: scale(1, 1);
    }
    50% {
        transform: scale(2, 2);
    }
    100% {
        transform: scale(1, 1);
    }
`;
const Logo = styled.img<{ small: boolean }>`
  width: ${(props) => (props.small ? "50px" : "100px")};
  height: ${(props) => (props.small ? "50px" : "100px")};
  animation: ${FadeInAnimation} 1s linear infinite;
`;

const Loader: React.FC<ILoader> = ({ small = false }) => {
  return (
    <Container>
      <Logo src={headerLogo} small={small} />
    </Container>
  );
};

export default Loader;
