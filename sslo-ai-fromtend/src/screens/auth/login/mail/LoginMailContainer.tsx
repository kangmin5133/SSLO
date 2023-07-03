import React, { useEffect, useState } from "react";
import SignupMailPresenter from "./LoginMailPresenter";
import { useLocation } from "react-router-dom";
import userApi from "../../../../api/userApi";
import { useAppSelector } from "../../../../hooks";

const LoginMailContainer = () => {
  const { state } = useLocation();
  console.log(state);

  const loggedInUser = useAppSelector((state) => state.userReducer);
  const [userEmail, setUserEmail] = useState<string>("");

  const getUserEmail = async () => {
    const res = await userApi.getUserInfo(
      {
        user_id: state,
      },
      loggedInUser.accessToken!
    );
    if (res && res.status === 200) {
      console.log(res.data);
      setUserEmail(res.data.user_email);
    }
  };
  useEffect(() => {
    getUserEmail();
  }, []);
  return <SignupMailPresenter emailData={userEmail} />;
};

export default LoginMailContainer;
