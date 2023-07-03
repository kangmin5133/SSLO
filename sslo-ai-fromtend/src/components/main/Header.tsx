import React, { useEffect, useState } from "react";
import styled from "styled-components";
import iconList from "../../assets/images/project/header+menu/icon-list.svg";
import iconProfile from "../../assets/images/project/header+menu/icon-profile.svg";
import "../../css/sslo/sslo_main.scoped.css";
import "../../css/sslo/sslo_common.scoped.css";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { userLogout } from "../../redux/user/userSlice";
export interface IHeader {
  title: string;
  projectType?: number;
}

const Container = styled.div`
  width: 100%;
  min-height: 61px;
  max-height: 61px;
  border-bottom: 1px;
  border-bottom-color: #cddff8;
  border-bottom-style: solid;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 60px;
`;
const HeaderPart = styled.div`
  display: flex;
  align-items: center;
`;
const PartIcon = styled.img``;
const PartTitle = styled.span`
  margin-left: 12px;
  font-size: 17px;
  font-weight: 800;
  color: #243754;
`;
const PartType = styled.div`
  width: 130px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ecf3fb;
  border-radius: 20px;
  margin-left: 30px;
  padding: 3px 5px;
`;

const Header: React.FC<IHeader> = ({ title, projectType }) => {
  const user = useAppSelector((state) => state.userReducer);
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleIsOpen = () => {
    setIsOpen((isOpen) => !isOpen);
  };
  const handleLogout = async () => {
    try {
      await dispatch(userLogout(user.accessToken!));
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };

  // ! admin 권한
  const [userRole, setUserRole] = useState<boolean>(false);
  useEffect(() => {
    setUserRole(user.isAdmin);
  }, [userRole]);

  return (
    <Container>
      <HeaderPart>
        <PartIcon src={iconList} />
        <PartTitle>{title}</PartTitle>
        {projectType && (
          <PartType>
            {projectType === 1
              ? "데이터 수집/정제"
              : projectType === 2
              ? "데이터 전처리"
              : "데이터 가공"}
          </PartType>
        )}
      </HeaderPart>
      <HeaderPart>
        <PartIcon
          style={{ cursor: "pointer", marginRight: 30 }}
          src={iconProfile}
          onClick={toggleIsOpen}
        />
        {isOpen && (
          <ul className="my-page-list">
            <li>
              <a href="/main/setting/group">조직설정</a>
            </li>
            {userRole ? (
              <li>
                <a href="/main/setting/member">멤버설정</a>
              </li>
            ) : (
              ""
            )}

            <li>
              <button
                id="logout"
                style={{ cursor: "pointer" }}
                onClick={handleLogout}
              >
                <span>로그아웃</span>
              </button>
            </li>
          </ul>
        )}
      </HeaderPart>
    </Container>
  );
};

export default Header;
