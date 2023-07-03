import React from "react";
import { Outlet } from "react-router-dom";
import AuthPage from "../../components/AuthPage";

const StudioRoot = () => {
  return (
    <AuthPage>
      <Outlet />
    </AuthPage>
  );
};

export default StudioRoot;
