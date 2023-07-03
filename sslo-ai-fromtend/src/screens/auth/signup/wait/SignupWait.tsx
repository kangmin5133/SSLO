import React from 'react';
import '../../../../css/signup_login.scoped.css';
import { AuthGlobalStyles } from '../../../../globals';
import logo from '../../../../assets/images/signup_login/logo.svg';
import { Link } from 'react-router-dom';

const SignupWait = () => {
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
              <h4>승인 진행 중입니다.</h4>
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
                <Link to={'/'} className="confirmation2">
                  Home
                </Link>
              </li>
            </ul>
          </div>
        </main>
        <footer id="footer" />
      </div>
    </>
  );
};

export default SignupWait;
