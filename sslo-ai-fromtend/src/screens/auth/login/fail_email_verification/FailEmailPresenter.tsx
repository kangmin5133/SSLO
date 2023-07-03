import React from "react";
import "../../../../css/signup_login.scoped.css";
import logo from "../../../../assets/images/signup_login/logo.svg";
import { AuthGlobalStyles } from "../../../../globals";
import { useNavigate } from "react-router-dom";

const FailEmailPresenter = () => {
  const navigate = useNavigate();
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
              <h4>이메일 인증에 실패하였습니다.</h4>
            </div>
            <ul>
              <li>
                <div className="login-title">
                  <span />
                </div>
              </li>
              <li className="login-text">
                <p>이메일 인증 도중 오류가 발생하였습니다.</p>
                <p>재시도 해주시기 바랍니다.</p>
              </li>
              <li>
                <div className="login-title">
                  <span />
                </div>
              </li>
              <li className="login-btn-wrap">
                <button className="confirmation2" onClick={() => navigate(-1)}>
                  뒤로가기
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

export default FailEmailPresenter;
