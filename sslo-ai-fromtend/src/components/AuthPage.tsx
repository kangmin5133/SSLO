import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";

interface IAuthPage {
  children: React.ReactNode;
}

const AuthPage: React.FC<IAuthPage> = ({ children }) => {
  const isLoggedIn = useAppSelector((state) => state.userReducer.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  return <>{children}</>;
};

export default AuthPage;
