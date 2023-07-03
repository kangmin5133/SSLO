import React from "react";
import "../../../../css/signup_login.scoped.css";
import { AuthGlobalStyles } from "../../../../globals";
import logo from "../../../../assets/images/signup_login/logo.svg";
import { useLocation } from "react-router-dom";

const FindIdMail = () => {
  const { state } = useLocation();
  console.log(state);
  return (
    <>
      <AuthGlobalStyles />
      <div id="wrap">
        <header id="header" />
        <main>
          <div id="container2">
            <div className="title-wrap">
              <a href="/login" className="title-logo">
                <img src={logo} alt="" />
              </a>
              <h4 style={{ fontSize: 18 }}>아이디 찾기</h4>
            </div>
            <ul>
              <li>
                <div className="login-title">
                  <span />
                </div>
              </li>
              <li>
                <div className="contentbox1" style={{ fontSize: 18 }}>
                  <p>고객님의 정보와 일치하는 아이디입니다.</p>
                </div>
              </li>
              <li className="mail-box">
                <div className="left">
                  <b>아이디</b>
                </div>
                <div className="right">
                  <p>{state}</p>
                </div>
              </li>
              <li className="login-btn-wrap">
                <a href="/login" className="confirmation2">
                  로그인 하러가기
                </a>
              </li>
              <div className="login-title1">
                <b>비밀번호가 기억이 나지 않으세요?</b>
                <a href="/find/pw/reset" className="reset-pw">
                  비밀번호 재설정
                </a>
              </div>
              <div className="login-title">
                <span />
              </div>
            </ul>

            <div className="contentbox">
              <div className="member-info">
                <p>
                  정상적으로 메일 수신이 되지 않았다면, <b>스팸메일함</b>을
                  확인해주십시오. <br />
                  기타 아이디 관련 문의는 관리자에게 문의해주세요. <br />
                  <b>관리자 이메일 : abc1234@tbell.co.kr</b>
                </p>
              </div>
            </div>
          </div>
        </main>
        <footer id="footer" />
      </div>
    </>
  );
};

export default FindIdMail;
