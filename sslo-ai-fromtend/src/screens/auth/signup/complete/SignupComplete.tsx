import React from 'react';
import '../../../../css/signup_login.scoped.css';
import logo from '../../../../assets/images/signup_login/logo.svg';
import { AuthGlobalStyles } from '../../../../globals';

const SignupComplete = () => {
  return (
    <>
      <AuthGlobalStyles />
      <div id="wrap">
        <header id="header" />
        <main>
          <div id="container2">
            <div className="title-wrap">
              <a href="front-login.html" className="title-logo">
                <img src={logo} alt="" />
              </a>
              <h4>통합 회원으로 가입이 완료되었습니다.</h4>
            </div>
            <ul>
              <li>
                <div className="login-title">
                  <span />
                </div>
              </li>
              <li className="login-text">
                <p>
                  관리자 승인 완료 후, 서비스 이용이 가능합니다. <br />
                  관리자 승인은 5~10분 정도 소요됩니다.
                </p>
              </li>
              <li className="login-btn-wrap">
                <a href="front-login.html" className="confirmation2">
                  Home
                </a>
              </li>
            </ul>
          </div>
        </main>
        <footer id="footer" />
      </div>
    </>
  );
};

export default SignupComplete;
