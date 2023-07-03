import React from "react";
import "../../../../css/signup_login.scoped.css";
import logo from "../../../../assets/images/signup_login/logo.svg";
import { AuthGlobalStyles } from "../../../../globals";

const SignupMailPresenter = () => {
  return (
    <>
      <AuthGlobalStyles />
      <div id="wrap">
        <header id="header" />
        <main style={{ marginTop: "100px" }}>
          <div id="container2">
            <div className="title-wrap">
              <a href="/" className="title-logo">
                <img src={logo} alt="" />
              </a>
              <h4>회원가입을 해주셔서 감사합니다.</h4>
            </div>
            <ul>
              <li>
                <div className="login-title">
                  <span />
                </div>
              </li>
              <li className="login-text">
                <p>최초 로그인 시 이메일로 인증 메일이 발송됩니다.</p>
                <p>이메일 인증 이후 모든 서비스 이용이 가능합니다.</p>
              </li>
              <li className="login-btn-wrap">
                <button className="confirmation2">
                  <a href="/login">로그인 하기</a>
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

export default SignupMailPresenter;
