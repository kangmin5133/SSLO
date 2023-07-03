import React from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";

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

const NetworkErrorPage = () => {
  const location = useLocation();
  let title = location.search
    ? location.search.split("statusCode=")[1].split("&")[0]
    : null;
  let description = location.search
    ? location.search.split("errorMsg=")[1].replaceAll("%20", " ")
    : null;

  return (
    <Container>
      <InnerContainer>
        <Title>Network Error</Title>
        {title && description ? (
          <>
            <SemiTitle>Status code: {title}</SemiTitle>
            <Description>Error Message: {description}</Description>
          </>
        ) : (
          <SemiTitle>Unknown error</SemiTitle>
        )}
        <Link to={"/"}>
          <HomeBtn>Go Home &rarr;</HomeBtn>
        </Link>
      </InnerContainer>
    </Container>
  );
};

export default NetworkErrorPage;
