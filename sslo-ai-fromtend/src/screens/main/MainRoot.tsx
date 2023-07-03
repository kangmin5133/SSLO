import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import AuthPage from "../../components/AuthPage";
import Sidebar from "../../components/main/Sidebar";

const CoreWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const CoreRoot = () => {
  const { pathname } = useLocation();
  return (
    <AuthPage>
      <CoreWrapper>
        <Sidebar pathname={pathname} />
        <Outlet />
      </CoreWrapper>
    </AuthPage>
  );
};

export default CoreRoot;
