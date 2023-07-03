import { getSuggestedQuery } from "@testing-library/react";
import { useEffect, useState } from "react";
import userApi from "../../../../api/userApi";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { toast } from "react-toastify";
import MyPagePrivacyPresenter from "./MyPagePrivacyPresenter";
import { useNavigate } from "react-router-dom";
import { userLogout } from "../../../../redux/user/userSlice";

export interface IPrivacyUser {
  id: string;
  name: string;
  email: string;
  org: IOrg;
}

export interface IOrg {
  organization_id: number;
  organization_name: string;
}

const MyPagePrivacyContainer = () => {
  const loggedInUser = useAppSelector((state) => state.userReducer);
  const dispatch = useAppDispatch();
  const [userInfo, setUserInfo] = useState<IPrivacyUser>();
  const navigate = useNavigate();
  const [isQuitOn, setIsQuitOn] = useState<boolean>(false);
  const [isCompleteQuitOn, setIsCompleteQuitOn] = useState<boolean>(false);
  
  useEffect(() => {
    if(!loggedInUser || !loggedInUser.isLoggedIn) {
      navigate("/login");
      return;
    }
    getUserInfo();
    setUnderLine();
  }, []);

  useEffect(() => {
    console.log("user: ", userInfo);
  }, [userInfo]);

  const setUnderLine = () => {
    const tab = document.getElementById("tab_privacy");
    const line = document.getElementById("line_now");
    console.log(tab.offsetLeft);
    line.style.left = (tab.offsetLeft * 2) + "px";
  }

  const getUserInfo = async () => {
    const res = await userApi.getUserInfo(
      {
        user_id: loggedInUser.id,
      }, 
      loggedInUser.accessToken
    );
    if(res && res.status === 200) {
      console.log(res.data);
      getOrgInfo(res.data);
    }
  };

  const getOrgInfo = async (data: any) => {
    const res = await userApi.getOrganizationInfo(
      {
        organization_id: data.organization_id,
      }, 
      //loggedInUser.accessToken
    );
    if(res && res.status === 200) {
      console.log(res.data);
      const user: IPrivacyUser = {
        id: data.user_id,
        name: data.user_display_name,
        email: data.user_email,
        org: {
          organization_id: res.data.organization_id,
          organization_name: res.data.organization_name,
        },
      };
      setUserInfo(user);
    }
  };

  const onChangeContent = (e: any) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const checkEmail = async () => {
    const res = await userApi.getAllUsers({
      user_email: userInfo.email
    });
    if(res && res.status === 200) {
      const data = res.data;
      if(data.datas.length > 0 || data.pageinfo.totalResults > 0)
        return true;
      if(data.datas.length === 0 && data.pageinfo.totalResults === 0)
        return false;
    }
    return false;
  };

  const handleSave = async (e: any) => {
    if(userInfo.email === "") {
      toast.error("이메일을 입력해주세요.");
      return;
    }
    if(userInfo.name === "") {
      toast.error("이름을 입력해주세요.");
      return;
    }

    const dupEmail = await checkEmail();
    if(dupEmail) {
      toast.error("사용중인 이메일입니다. 다른 이메일을 입력해주세요.");
      return;
    }
    
    console.log(userInfo);
    const res = await userApi.updateUser({
      user_id: userInfo.id,
      user_display_name: userInfo.name,
      user_email:userInfo.email,
    });
    if(res && res.status === 200) {
      toast.success("개인정보가 저장되었습니다.");
      setTimeout(function() {
        window.location.reload();
      }, 3000);
    } else {
      toast.error("개인정보 저장이 실패했습니다.");
    }
  };

  const openQuit = () => {
    setIsQuitOn(true);
  };

  const closeQuit = () => {
    setIsQuitOn(false);
  }

  const handleDelete = async () => {
    try{
      await dispatch(userLogout(loggedInUser.accessToken!));
      const res = await userApi.deleteUser({
        user_id: userInfo.id
      });
      if(res && res.status === 200) {
        setIsQuitOn(false);
        setIsCompleteQuitOn(true);
      } else {
        toast.error("회원탈퇴가 실패했습니다. 확인 후 다시 시도해 주세요");
        setIsQuitOn(false);
      }
    } catch (e) {
      console.log(e);
      toast.error("회원탈퇴가 실패했습니다. 확인 후 다시 시도해 주세요");
      setIsQuitOn(false);
    }
  };

  const closeCompleteQuit = () => {
    setIsCompleteQuitOn(false);
  }

  const handleCompleteDelete = () => {
    setIsCompleteQuitOn(false);
    navigate("/");
  }; 
  
  return (
    <MyPagePrivacyPresenter 
      userInfo={userInfo}
      onChangeContent={onChangeContent}
      handleSave={handleSave}
      openQuit={openQuit}
      closeQuit={closeQuit}
      isQuitOn={isQuitOn}
      handleDelete={handleDelete}
      closeCompleteQuit={closeCompleteQuit}
      isCompleteQuitOn={isCompleteQuitOn}
      handleCompleteDelete={handleCompleteDelete}
    />
  );
}

export default MyPagePrivacyContainer;