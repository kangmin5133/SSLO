import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../../hooks";
import { toast } from "react-toastify";
import MyPagePasswordPresenter from "./MyPagePasswordPresenter";
import userApi from "../../../../../api/userApi";
import { useNavigate } from "react-router-dom";

export interface IPassWord {
  oldPwd: string;
  newPwd: string;
  newPwdConfirm: string;
}

const MyPagePasswordContainer = () => {
  const loggedInUser = useAppSelector((state) => state.userReducer);
  const navigate = useNavigate();
  const [passwordInfo, setPasswordInfo] = useState<IPassWord>({
    oldPwd: "",
    newPwd: "",
    newPwdConfirm: "",
  });

  useEffect(() => {
    if(!loggedInUser || !loggedInUser.isLoggedIn) {
      navigate("/login");
      return;
    }
    setUnderLine();
  }, []);

  const setUnderLine = () => {
    const tab = document.getElementById("tab_privacy");
    const line = document.getElementById("line_now");
    console.log(tab.offsetLeft);
    line.style.left = (tab.offsetLeft * 2) + "px";
  }

  const onChangeContent = (e: any) => {
    setPasswordInfo({ ...passwordInfo, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: any) => {
    if(passwordInfo.oldPwd === "") {
      toast.error("현재 비밀번호를 입력해주세요.");
      return;
    }
    if(passwordInfo.newPwd === "") {
      toast.error("새 비밀번호를 입력해주세요.");
      return;
    }
    if(passwordInfo.newPwd.length < 8 || passwordInfo.newPwd.length > 20) {
      toast.error("새 비밀번호는 8 ~ 20 글자로 입력해주세요.");
      return;
    }
    const pwCheck = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$/;
    if(!pwCheck.test(passwordInfo.newPwd)) {
      toast.error("새 비밀번호는 영문/숫자/특수문자 조합으로 입력해주세요.");
      return;
    }
    if(passwordInfo.newPwdConfirm === "") {
      toast.error("새 비밀번호 확인을 입력해주세요.");
      return;
    }
    if(passwordInfo.newPwd !== passwordInfo.newPwdConfirm) {
      toast.error("새 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    const res = await userApi.updateUser({
      user_id: loggedInUser.id,
      current_user_password: passwordInfo.oldPwd,
      new_user_password: passwordInfo.newPwd,
      new_user_password_check: passwordInfo.newPwdConfirm,
    });

    if(res && res.status === 200) {
      toast.success("비밀번호 변경이 성공하였습니다.");
      navigate(-1);
    } else {
      if (res && res.data === "current password is wrong") {
        toast.error("현재 비밀번호가 일치하지 않습니다. 확인 후 다시 시도해주세요.");
      } else {
        toast.error("비밀번호 변경이 실패하였습니다. 확인 후 다시 시도해주세요.");
      }
    }
  };

  return (
    <MyPagePasswordPresenter 
      handleSave={handleSave}
      onChangeContent={onChangeContent}
    />
  );
}

export default MyPagePasswordContainer;