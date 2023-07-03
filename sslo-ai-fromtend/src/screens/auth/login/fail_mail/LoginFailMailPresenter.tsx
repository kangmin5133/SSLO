import React from 'react';
import { AuthGlobalStyles } from '../../../../globals';
import logo from '../../../../assets/images/signup_login/logo.svg';
import iconWarning from '../../../../assets/images/signup_login/icon-warning.svg';
import '../../../../css/signup_login.scoped.css';

const LoginFailMailPresenter = () => {
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
              <h4>활성 회원 전환 안내</h4>
              <div className="login-text">
                <br />
                <p>
                  현재 사용하고 계시는 계정은 <b>휴면 계정</b>입니다. <br />
                  활성 회원 계정으로 전환하시려면 개인정보 보호를 위해 <br />
                  이메일 인증 후 로그인을 진행해 주시기 바랍니다.
                </p>
              </div>
            </div>

            <ul>
              <li>
                <div className="login-title">
                  <span />
                </div>
              </li>
              <li>
                <div className="login-input-wrap">
                  <input type="text" id="login-id" required />
                  <label htmlFor="login-id">이메일</label>
                  <div className="warning">
                    <img src={iconWarning} alt="" />
                    <span> 이메일 주소를 입력하세요.</span>
                  </div>
                </div>
              </li>
              <li className="login-btn-wrap">
                <a href="front-login.html" className="cancel">
                  취소
                </a>
                <button className="confirmation">확인</button>
              </li>
              <li>
                <div className="login-title">
                  <span />
                </div>
              </li>
            </ul>
          </div>
        </main>
        <footer id="footer" />
      </div>
    </>
  );
};

export default LoginFailMailPresenter;
