import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import userApi, { IUser } from "../../../../api/userApi";
import { useAppSelector } from "../../../../hooks";
import { getFormattedDate } from "../../../../utils";
import MypageMemberMainPresenter from "./MypageMemberMainPresenter";

const MypageMemberMainContainer = () => {
  const loggedInUser = useAppSelector((state) => state.userReducer);
  // ! 현재 페이지의 organization_id
  const [currentOrganizationId, setCurrentOrganizationId] = useState<number>(0);
  const oId = useRef(currentOrganizationId);
  // ! 전체멤버
  const [myMember, setMyMember] = useState<IUser[]>([]);
  // ! sslo 이메일 가입여부
  const [joinEmail, setJoinEmail] = useState<boolean>(false);
  // ! 전체멤버 인원수
  const [memberCnt, setMemberCnt] = useState<number>(0);
  // ! checkbox에서 선택된 members
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  // ! 삭제팝업의 노출 여부 state
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  // ! 초대팝업의 노출 여부 state
  const [openInvite, setOpenInvite] = useState<boolean>(false);
  // ! 초대멤버 이메일
  const [inviteEmail, setInviteEmail] = useState<string>("");
  // ! 검색어 state
  const [searchedText, setSearchedText] = useState<string>("");
  // ! 검색 list
  const [searchedList, setSearchedList] = useState<IUser[]>([]);
  // ! 검색 결과 list
  const [memberList, setMemberList] = useState<IUser[]>([]);
  // ! role_id
  const [userRoleId, setUserRoleId] = useState<number>(0);

  // ! organization_id 불러오기
  const getOI = async () => {
    const res = await userApi.getUserInfo(
      { user_id: loggedInUser.id },
      loggedInUser.accessToken!
    );
    if (res && res.status === 200) {
      setCurrentOrganizationId(res.data.organization_id);
    }
    return;
  };
  useEffect(() => {
    getOI();
  }, []);
  // ! 조직에 가입된 전체멤버
  const getAllMember = async () => {
    const res = await userApi.getOrganizationMember({
      organization_id: currentOrganizationId,
    });
    if (res && res.status === 200) {
      let users: IUser[] = [];
      for (let i = 0; i < res.data.length; i++) {
        const u: IUser = {
          userId: res.data[i].user_id,
          userEmail: res.data[i].user_email,
          userDisplayName: res.data[i].user_display_name,
          member_permission: res.data[i].role_id,
          created: getFormattedDate(res.data[i].created),
        };
        users.push(u);
      }
      setMyMember(users);
      setMemberCnt(users.length);
    }
  };

  useEffect(() => {
    if (currentOrganizationId > 0) getAllMember();
    oId.current = currentOrganizationId;
  }, [currentOrganizationId]);

  useEffect(() => {
    setSearchedList(myMember);
  }, [myMember]);

  // ! sslo 이메일 가입 여부
  const getAllUsers = async () => {
    const res = await userApi.getAllUsers({
      user_email: inviteEmail,
    });
    if (res && res.status === 200) {
      if (res.data.datas.length === 1) {
        setJoinEmail(true);
      }
    }
  };
  useEffect(() => {
    getAllUsers();
  }, [inviteEmail]);

  // ! 검색어 입력
  const setSearchText = (e: any) => {
    const text = e.target.value;
    setSearchedText(text);
  };

  const handleSearch = () => {
    setSearchedList(
      myMember.filter(
        (element) =>
          element.userDisplayName.includes(searchedText) ||
          element.userEmail.includes(searchedText)
      )
    );
  };

  useEffect(() => {
    if (searchedList) {
      const searchArr = [];
      searchedList.map((element, index) => {
        searchArr.push({
          index: index + 1,
          userId: element.userId,
          userEmail: element.userEmail,
          userDisplayName: element.userDisplayName,
          member_permission: element.member_permission,
          created: element.created,
        });
      });
      setMemberList([...searchArr]);
    }
    handleSearch;
  }, [searchedList]);

  // ! member delete 팝업창
  const onOpenDelete = () => {
    if (selectedUsers.length === 0) {
      toast.error("멤버 한 명 이상을 선택해주세요.");
      return;
    }
    setOpenDelete(true);
  };
  const onCancelDelete = () => {
    setOpenDelete(false);
  };
  // ! member invite 팝업창
  const onOpenInvite = () => {
    setOpenInvite(true);
  };
  const onCancelInvite = () => {
    setOpenInvite(false);
  };
  //**** list check box 개별선택  ****
  const selectedUser = (userId: string) => {
    setSelectedUsers((prev) => [...prev, userId]);
  };
  console.log(selectedUsers);
  const removeUser = (userId: string) => {
    const removeMembers = selectedUsers.filter((m) => m !== userId);
    setSelectedUsers(removeMembers);
  };

  const isSelectedUser = (userId: string): boolean => {
    let isSelected = false;
    for (let i = 0; i < selectedUsers.length; i++) {
      if (selectedUsers[i] === userId) {
        isSelected = true;
      }
    }
    return isSelected;
  };

  //**** header check box 전체선택  ****
  // ! check task is all selected
  const isSelectedAllUsers = () => {
    if (memberList) {
      return memberList.length === selectedUsers.length;
    }
    return false;
  };
  // ! select all task state
  const selectAllUsers = () => {
    if (memberList) {
      let all: string[] = [];
      memberList.forEach((m) => {
        all.push(m.userId);
      });
      setSelectedUsers(all);
    }
    return;
  };
  // ! remove all task state
  const removeAllUsers = () => {
    setSelectedUsers([]);
  };

  // ! role_id 불러오기
  const getRoleId = async () => {
    for (let i = 0; i < selectedUsers.length; i++) {
      const userRes = await userApi.getUserInfo({
        user_id: selectedUsers[i],
      });
      console.log(selectedUsers[i]);
      if (userRes && userRes.status === 200) {
        console.log(userRes.data.role_id);
        setUserRoleId(userRes.data.role_id);
      }
    }
  };
  useEffect(() => {
    getRoleId();
  }, [selectedUsers]);
  console.log(selectedUsers.length);

  // ! selectedUser delete
  const deleteUser = async () => {
    for (let i = 0; i < selectedUsers.length; i++) {
      if (userRoleId === 2) {
        toast.error("매니저는 삭제가 불가합니다.");
        setTimeout(function() {
          window.location.reload();
        }, 3000);
        return;
      } else {
        const res = await userApi.deleteUser(
          {
            user_id: selectedUsers[i],
          },
          loggedInUser.accessToken!
        );
        if (res && res.status === 200) {
          toast.error("삭제 처리되었습니다.");
          setTimeout(function() {
            window.location.reload();
          }, 3000);
        }
      }
    }
  };

  // ! 멤버 초대
  const setInvitationEmail = (e: any) => {
    const email = e.target.value;
    setInviteEmail(email);
  };
  const inviteMember = async () => {
    for (let i = 0; i < myMember.length; i++) {
      if (myMember[i].userEmail === inviteEmail) {
        toast.error("이미 등록 되어있는 이메일입니다.");
        return;
      }
    }
    if (joinEmail === true) {
      toast.error("이미 가입되어있는 이메일입니다.");
      setJoinEmail(false);
      setOpenInvite(false);
      return;
    }
    const res = await userApi.getInviteMember({
      admin_id: loggedInUser.id,
      user_email: inviteEmail,
      organization_id: currentOrganizationId,
    });
    if (res && res.status === 200) {
      console.log(res.data);
      toast.success("멤버를 초대하였습니다.");
      setOpenInvite(false);
    }
  };
  console.log(myMember);
  return (
    <MypageMemberMainPresenter
      page={location.search.split("=")[1] || "1"}
      openInvite={openInvite}
      memberList={memberList}
      onOpenInvite={onOpenInvite}
      onCancelInvite={onCancelInvite}
      openDelete={openDelete}
      memberCnt={memberCnt}
      onOpenDelete={onOpenDelete}
      onCancelDelete={onCancelDelete}
      selectedUser={selectedUser}
      removeUser={removeUser}
      isSelectedUser={isSelectedUser}
      isSelectedAllUsers={isSelectedAllUsers}
      selectAllUsers={selectAllUsers}
      removeAllUsers={removeAllUsers}
      setInvitationEmail={setInvitationEmail}
      inviteMember={inviteMember}
      deleteUser={deleteUser}
      setSearchText={setSearchText}
      handleSearch={handleSearch}
    />
  );
};

export default MypageMemberMainContainer;
