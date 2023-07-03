import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import sslologo from "../../assets/images/sslo/sslo-logo.svg";
import icnogoto from "../../assets/images/sslo/icon-goto.svg";
import iconProfile from "../../assets/images/project/header+menu/icon-profile.svg";
import "../../css/sslo/sslo_main.scoped.css";
import "../../css/sslo/sslo_common.scoped.css";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { userLogout } from "../../redux/user/userSlice";
import styled from "styled-components";

const PartIcon = styled.img``;
const SsloHeader = () => {
  const user = useAppSelector((state) => state.userReducer);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector((state) => state.userReducer.isLoggedIn);
  const dispatch = useAppDispatch();
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
  return (
    <header id="sslo-header">
      <nav>
        <div className="gnb container">
          <div className="logobox">
            <Link to="/">
              <img src={sslologo} alt="sslo-logo" />
            </Link>
          </div>
          <ul className="menubox">
            <li>
              <Link to="/sslo/service">서비스</Link>
            </li>
            <li>
              <Link to="/sslo/solution">솔루션</Link>
            </li>
            {/* <li>
              <Link to="/sslo/price">가격</Link>
            </li> */}
            <li>
              <Link to="/sslo/intro">회사소개</Link>
            </li>
            <li>
              <Link to="/sslo/help/notice">고객지원</Link>
            </li>
          </ul>
          <div className="loginbox">
            <ul>
              <li className="platform">
                <Link to="/main/dashboard">
                  <div className="goto">
                    통합 플랫폼 바로가기
                    <img src={icnogoto} alt="" />
                  </div>
                </Link>
              </li>
              <li className="login">
                {!isLoggedIn && (
                  <Link to="/login" style={{ verticalAlign: "sub" }}>
                    로그인
                  </Link>
                )}
                {isLoggedIn && (
                  <PartIcon
                    style={{ cursor: "pointer", marginRight: 30 }}
                    src={iconProfile}
                    onClick={toggleIsOpen}
                  />
                )}

                {isOpen && (
                  <ul className="my-list">
                    <li>
                      <a href="/sslo/mypage/contact">문의내역</a>
                    </li>
                    <li>
                      <a href="/sslo/mypage/privacy">개인정보설정</a>
                    </li>
                    <li>
                      <button
                        id="logout"
                        onClick={handleLogout}
                        style={{ cursor: "pointer" }}
                      >
                        <span>로그아웃</span>
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default SsloHeader;
