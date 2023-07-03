import React, { ChangeEvent, useState } from "react";
import "../../../../css/signup_login.scoped.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FindPwMainPresenter from "./FindPwMainPresenter";
import userApi from "../../../../api/userApi";
const FindPwMainContainer = () => {
  const [userId, setUserId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [checkEmail, setCheckEmail] = useState<boolean>(true);

  const handleChangeId = (e: ChangeEvent<HTMLInputElement>) => {
    const id = e.target.value;
    setUserId(id);
  };

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setUserEmail(email);
    const emailCheck = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    emailCheck.test(email) ? setCheckEmail(false) : setCheckEmail(true);
  };

  const navigate = useNavigate();
  const handleConfirm = async () => {
    // Todo: DB user data 비교해서 일치하는 id 혹은 email없을 경우 메세지창 띄우기
    if (!userId) {
      toast.error("아이디는 필수값입니다.");
      return;
    }
    if (!userEmail) {
      toast.error("이메일은 필수값입니다.");
      return;
    }
    if (checkEmail) {
      toast.error("이메일 형식을 확인해주세요.");
      return;
    }
    const res = await userApi.getFindPw({
      user_id: userId,
      user_email: userEmail,
    });
    if (res && res.status === 200) {
      navigate("/find/pw/mail", { state: userEmail });
      return;
    } else {
      toast.error("일치하는 정보가 없습니다.", {
        autoClose: 3000,
      });
      setTimeout(function() {
        window.location.reload();
      }, 3000);
    }
  };
  return (
    <FindPwMainPresenter
      userId={userId}
      userEmail={userEmail}
      checkEmail={checkEmail}
      handleChangeId={handleChangeId}
      handleChangeEmail={handleChangeEmail}
      handleConfirm={handleConfirm}
    />
  );
};

export default FindPwMainContainer;
