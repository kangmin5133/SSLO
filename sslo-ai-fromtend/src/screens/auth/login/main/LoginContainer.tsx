import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../../../../api/userApi";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { userLogin } from "../../../../redux/user/userSlice";
import LoginPresenter from "./LoginPresenter";

const LoginContainer = () => {
  const loggedInUser = useAppSelector((state) => state.userReducer);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [userID, setUserID] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isShowPW, setIsShowPW] = useState<boolean>(false);
  const [getToken, setGetToken] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChangeUserID = (e: ChangeEvent<HTMLInputElement>) => {
    setUserID(e.target.value);
  };
  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleTogglePassword = () => {
    setIsShowPW((prev) => !prev);
  };

  useEffect(() => {
    console.log(loggedInUser.isLoggedIn);
    if (loggedInUser.isLoggedIn) {
      getToken
        ? navigate("/main/dashboard")
        : navigate("/login/mail", { state: userID });
    }
  }, [getToken]);

  const handleLogin = async () => {
    if (!userID || userID === "") return;
    if (!password || password === "") return;
    let check = true;
    try {
      const result = await dispatch(
        userLogin({ user_id: userID, user_password: password })
        );
        if (result === "check") navigate("/login/mail", { state: userID });
        if (result === "success") check = true;
      else check = false;
    } catch (e) {
      console.log(e);
      check = false;
    }
    if (check) {
      const res = await userApi.getUserInfo(
        {
          user_id: userID,
        },
        loggedInUser.accessToken!
        );
        if (res && res.status === 200) {
          setLoading(true);
          const tokenRes = await userApi.getOrganizationInfo({
          organization_id: res.data.organization_id,
        });
        if (tokenRes && tokenRes.status === 200) {
          console.log(tokenRes);
          setLoading(false);
          setGetToken(tokenRes.data.organization_email_verification);
        }
      }
    }
  };
  const handleEnterKeyDown: React.KeyboardEventHandler<
    HTMLButtonElement | HTMLInputElement
  > = (event) => {
    if (event.key !== "Enter") {
      return;
    }
    if (!userID || userID === "") return;
    if (!password || password === "") return;
    handleLogin();
  };
  return (
    <LoginPresenter
      handleChangeUserID={handleChangeUserID}
      handleChangePassword={handleChangePassword}
      handleEnterKeyDown={handleEnterKeyDown}
      handleTogglePassword={handleTogglePassword}
      handleLogin={handleLogin}
      userID={userID}
      isShowPW={isShowPW}
      password={password}
      loading={loading}
    />
  );
};

export default LoginContainer;
