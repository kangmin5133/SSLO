import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import userApi, { ISignUpPayload } from "../../../../api/userApi";
import { useAppSelector } from "../../../../hooks";
import MypageGroupMainPresenter from "./MypageGroupMainPresenter";

export enum MyPageTopTab {
  oneTab = "조직설정",
  twoTab = "사용현황",
}

const MypageGroupMainContainer = () => {
  const loggedInUser = useAppSelector((state) => state.userReducer);
  // ! 유저정보 state
  const [userInfo, setUserInfo] = useState<ISignUpPayload>();
  // ! 탈퇴팝업의 노출 여부 state
  const [openRemove, setOpenRemove] = useState<boolean>(false);
  // ! 상단 tab state
  const [selectTab, setSelectTab] = useState<MyPageTopTab>(MyPageTopTab.oneTab);
  // ! user role_id
  const [userRoleId, setUserRoleId] = useState<number>(0);

  //******************** 상단 tab state change ***************
  const handleTab = (tab: MyPageTopTab) => {
    setSelectTab(tab);
  };

  //****************** user all data *****************
  // ! 서버로부터 로그인한 유저정보 가져와 정제하여 state에 저장(필요한 파라메타만 가져옴)
  const cleanUser = (data: any) => {
    setUserInfo({
      organization_id: data.organization_id,
      organization_name: data.organization_name,
    });
  };
  // ! 서버로부터 유저 정보 불러옴
  const getUserInfo = async () => {
    if (!loggedInUser) return;
    if (loggedInUser) {
      const res = await userApi.getUserInfo(
        { user_id: loggedInUser.id },
        loggedInUser.accessToken!
      );
      if (res && res.status === 200) {
        console.log(res.data.organization_id);
        setUserRoleId(res.data.role_id);
        const organizationRes = await userApi.getOrganizationInfo({
          organization_id: res.data.organization_id,
        });
        if (organizationRes && organizationRes.status === 200) {
          console.log(organizationRes.data);
          cleanUser(organizationRes.data);
        }
      }
    }
  };

  //***************** user modify *********************
  const onChangeName = (e: any) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const res = await userApi.updateOrganizaton({
      organization_id: userInfo.organization_id,
      organization_name: userInfo.organization_name,
    });
    if (res && res.status === 200) {
      toast.success("변경된 조직명으로 저장되었습니다.", { autoClose: 3000 });
      setTimeout(function() {
        window.location.reload();
      }, 3000);
    } else {
      toast.error("저장을 실패했습니다.");
    }
  };

  const navigate = useNavigate();

  //***************** user delete *********************
  const handleDelete = async () => {
    if (!loggedInUser) return;
    if (loggedInUser && userRoleId === 2) {
      toast.error("매니저는 탈퇴 권한이 없습니다.");
      setOpenRemove(false);
      return;
    }
    if (loggedInUser) {
      const res = await userApi.deleteUser(
        { user_id: loggedInUser.id },
        loggedInUser.accessToken!
      );
      if (res && res.status === 200) {
        toast.success("조직에서 탈퇴되었습니다.");
        navigate("/");
      }
    }
  };

  //***************** user delete 팝업창 *********************
  const onOpenRemove = () => {
    setOpenRemove(true);
  };

  const onCancelRemove = () => {
    setOpenRemove(false);
  };
  useEffect(() => {
    getUserInfo();
  }, []);
  return (
    <MypageGroupMainPresenter
      userInfo={userInfo}
      selectTab={selectTab}
      handleDelete={handleDelete}
      onOpenRemove={onOpenRemove}
      openRemove={openRemove}
      onCancelRemove={onCancelRemove}
      handleTab={handleTab}
      onChangeName={onChangeName}
      handleSave={handleSave}
    />
  );
};

export default MypageGroupMainContainer;
