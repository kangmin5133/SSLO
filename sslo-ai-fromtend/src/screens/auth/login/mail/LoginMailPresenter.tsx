import React from "react";
import "../../../../css/signup_login.scoped.css";
import logo from "../../../../assets/images/signup_login/logo.svg";
import { AuthGlobalStyles } from "../../../../globals";

const LoginMailPresenter = (emailData) => {
  return (
    <>
      <AuthGlobalStyles />
      <div id="wrap">
        <header id="header" />
        <main>
          <div id="container2">
            <div className="title-wrap">
              <a href="/" className="title-logo">
                <img src={logo} alt="" />
              </a>
              <h4>이메일 인증을 부탁드립니다.</h4>
            </div>
            <ul>
              <li>
                <div className="login-title">
                  <span />
                </div>
              </li>
              <li className="mail-box">
                <div className="left">
                  <b>이메일 주소</b>
                </div>
                <div className="right">
                  <p>{emailData.emailData}</p>
                </div>
              </li>
              <li className="login-text">
                <p>상단의 이메일로 로그인 인증 메일이 발송되었습니다.</p>
                <p>이메일 인증 이후에 재로그인 하시기 바랍니다.</p>
              </li>
              <li>
                <div className="login-title">
                  <span />
                </div>
              </li>
              <li className="login-btn-wrap">
                <button className="confirmation2">
                  <a href="/login">로그인 하러가기</a>
                </button>
              </li>
            </ul>
          </div>
        </main>
        <footer id="footer" />
      </div>
    </>
  );
};

export default LoginMailPresenter;
