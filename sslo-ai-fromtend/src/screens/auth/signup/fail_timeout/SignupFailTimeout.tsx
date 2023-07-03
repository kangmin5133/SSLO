import React from 'react';
import '../../../../css/signup_login.scoped.css';
import { AuthGlobalStyles } from '../../../../globals';
import logo from '../../../../assets/images/signup_login/logo.svg';
import { Link } from 'react-router-dom';

const SignupFailTimeout = () => {
  return (
    <>
      <AuthGlobalStyles />
      <div id="wrap">
        <header id="header" />
        <main>
          <div id="container2">
            <div className="title-wrap">
              <Link to={'/'} className="title-logo">
                <img src={logo} alt="" />
              </Link>
              <h4>인증 유효 시간이 초과되었습니다.</h4>
            </div>
            <ul>
              <li>
                <div className="login-title">
                  <span />
                </div>
              </li>
              <li className="login-text">
                <p>회원가입 신청을 다시 진행해주시기 바랍니다.</p>
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

export default SignupFailTimeout;
