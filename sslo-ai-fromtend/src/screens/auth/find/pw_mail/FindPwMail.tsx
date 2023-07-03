import React from "react";
import "../../../../css/signup_login.scoped.css";
import { AuthGlobalStyles } from "../../../../globals";
import logo from "../../../../assets/images/signup_login/logo.svg";
import { useLocation } from "react-router-dom";

const FindPwMail = () => {
  const { state } = useLocation();
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
              <h4 style={{ fontSize: 18 }}>
                비밀번호 재설정 이메일이 전송되었습니다.
              </h4>
            </div>
            <ul>
              <li>
                <div className="login-title">
                  <span />
                </div>
              </li>
              <li>
                <div className="contentbox1" style={{ fontSize: 18 }}>
                  <p>
                    <b>{state}</b> 으로
                  </p>
                  <p>임시 비밀번호가 발급되었습니다.</p>
                  <p>임시 비밀번호로 로그인 후</p>
                  <p style={{ color: "#FF9F46", fontWeight: 700 }}>
                    개인정보설정에서 비밀번호를 재설정하시기 바랍니다.
                  </p>
                </div>
              </li>
              <li className="login-btn-wrap">
                <a href="/login" className="confirmation2">
                  확인
                </a>
              </li>
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

export default FindPwMail;
