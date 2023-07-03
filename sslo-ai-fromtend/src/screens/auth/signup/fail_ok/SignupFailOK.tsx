import React from 'react';
import { AuthGlobalStyles } from '../../../../globals';
import logo from '../../../../assets/images/signup_login/logo.svg';
import '../../../../css/signup_login.scoped.css';

const SignupFailOK = () => {
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
              <h4>
                가입 승인에 실패하였습니다. <br />
                아래 해당 사유 확인 후 재가입하시기 바랍니다.
              </h4>
            </div>
            <ul>
              <li>
                <div className="login-title">
                  <span />
                </div>
              </li>
              <li className="login-text">
                <b>가입 실패 사유</b>
                <p>가입 사유가 부적절하여 반려 처리되었습니다.</p>
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

export default SignupFailOK;
