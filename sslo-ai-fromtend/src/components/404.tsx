import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
`;
const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const Title = styled.div`
  font-size: 30px;
  font-weight: 700;
`;
const SemiTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
`;
const Description = styled.span`
  margin-top: 20px;
  font-size: 12px;
`;
const HomeBtn = styled.div`
  margin-top: 15px;
  font-size: 20px;
  color: #3480e3;
`;

const NotFound = () => {
  return (
    <Container>
      <InnerContainer>
        <Title>Page not found</Title>
        <SemiTitle>This is not the web page you are looking for.</SemiTitle>
        <Link to={"/"}>
          <HomeBtn>Go Home &rarr;</HomeBtn>
        </Link>
      </InnerContainer>
    </Container>
  );
};

export default NotFound;
