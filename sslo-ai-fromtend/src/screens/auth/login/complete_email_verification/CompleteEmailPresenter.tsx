import React from "react";
import "../../../../css/signup_login.scoped.css";
import logo from "../../../../assets/images/signup_login/logo.svg";
import { AuthGlobalStyles } from "../../../../globals";

const CompleteEmailPresenter = () => {
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
              <h4>이메일 인증이 확인되었습니다.</h4>
            </div>
            <ul>
              <li>
                <div className="login-title">
                  <span />
                </div>
              </li>
              <li className="login-text">
                <p>이메일 인증이 완료되었습니다.</p>
                <p>재로그인 후 서비스를 이용해주기 바랍니다.</p>
              </li>
              <li>
                <div className="login-title">
                  <span />
                </div>
              </li>
              <li className="login-btn-wrap">
                <button className="confirmation2">
                  <a href="/login">재로그인 하러가기</a>
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

export default CompleteEmailPresenter;
