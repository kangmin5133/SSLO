import React, { ChangeEvent } from "react";
import "../../../../css/signup_login.scoped.css";
import logotype from "../../../../assets/images/signup_login/logotype.svg";
import logo from "../../../../assets/images/signup_login/logo.svg";
import googlelogo from "../../../../assets/images/signup_login/google.svg";
import kakaologo from "../../../../assets/images/signup_login/kakao.svg";
import naverlogo from "../../../../assets/images/signup_login/naver.svg";
import iconwarning from "../../../../assets/images/signup_login/icon-warning.svg";
import iconview1 from "../../../../assets/images/signup_login/icon-view1.svg";
import { Link } from "react-router-dom";
import { AuthGlobalStyles } from "../../../../globals";
import { Helmet } from "react-helmet-async";
import LoaderText from "../../../../components/LoaderText";

export interface ILoginPresenter {
  handleChangeUserID: (e: ChangeEvent<HTMLInputElement>) => void;
  handleChangePassword: (e: ChangeEvent<HTMLInputElement>) => void;
  handleTogglePassword: () => void;
  handleEnterKeyDown: (event) => void;
  handleLogin: () => void;
  userID: string;
  password: string;
  isShowPW: boolean;
  loading: boolean;
}

const LoginPresenter: React.FC<ILoginPresenter> = ({
  handleChangeUserID,
  handleChangePassword,
  handleTogglePassword,
  handleEnterKeyDown,
  handleLogin,
  userID,
  password,
  isShowPW,
  loading,
}) => {
  return (
    <>
      <AuthGlobalStyles />
      <Helmet>
        <title>SSLO | LOGIN</title>
      </Helmet>
      <div id="wrap">
        <main id="main">
          <section id="login-container">
            <article className="container-bg">
              <div className="login-wrap">
                <div className="login-left">
                  <p>
                    데이터로 새로운 <br />
                    미래를 펼치는
                  </p>
                  <div id="logotype">
                    <img src={logotype} alt="" />
                  </div>
                </div>
                <ul className="login-right" style={{ padding: "30px 70px 40px" }}>
                  <li style={{ display: "flex", justifyContent: "center" }}>
                    <Link to={"/"}>
                      <img src={logo} alt="" style={{ width: "180px"}}/>
                    </Link>
                  </li>
                  <li>
                    <div className="login-title">
                      <span />
                      <p>소셜 로그인</p>
                      <span />
                    </div>
                    <div className="social-login">
                      <button
                        className="google"
                        onClick={() => {
                          location.href =
                            "http://210.113.122.196:8829/rest/api/1/auth/social/google";
                        }}
                      >
                        <img src={googlelogo} alt="" />
                      </button>
                      <button
                        className="kakao"
                        onClick={() => {
                          location.href =
                            "http://210.113.122.196:8829/rest/api/1/auth/social/kakao";
                        }}
                      >
                        <img src={kakaologo} alt="" />
                      </button>
                      <button
                        className="naver"
                        onClick={() => {
                          location.href =
                            "http://210.113.122.196:8829/rest/api/1/auth/social/naver";
                        }}
                      >
                        <img src={naverlogo} alt="" />
                      </button>
                    </div>
                  </li>
                  <li>
                    <div className="login-title">
                      <span />
                      <p>또는</p>
                      <span />
                    </div>
                    <div className="login-input-wrap">
                      <input
                        type="text"
                        id="login-id"
                        required
                        onChange={handleChangeUserID}
                        value={userID}
                      />
                      <label htmlFor="login-id">아이디</label>
                      {(!userID || userID === "") && (
                        <div className="warning">
                          <img src={iconwarning} alt="" />
                          <span> 아이디를 입력하세요.</span>
                        </div>
                      )}
                    </div>
                    <div className="login-input-wrap">
                      <input
                        type={isShowPW ? "text" : "password"}
                        id="login-pw"
                        required
                        onChange={handleChangePassword}
                        onKeyDown={handleEnterKeyDown}
                        value={password}
                      />
                      <label htmlFor="login-pw">비밀번호</label>
                      <img
                        className="pw-view"
                        src={iconview1}
                        style={{ cursor: "pointer" }}
                        alt=""
                        onClick={handleTogglePassword}
                      />
                      {/* <img className="pw-view" src="../assets/images/signup_login/icon-view2.svg" alt=""> */}
                      {(!password || password === "") && (
                        <div className="warning">
                          <img src={iconwarning} alt="" />
                          <span> 비밀번호를 입력하세요.</span>
                        </div>
                      )}
                      {/* <div className="warning"><img src={iconwarning} alt=""><span> 비밀번호는 최소 8자 이상입니다.</span></div>
                                  <div className="warning"><img src={iconwarning} alt=""><span> 아이디를 입력하세요.</span></div>  */}
                    </div>
                  </li>
                  {/* <li className="auto-input">
                    <ul>
                      <li />
                      <li>
                        <button className="sound">
                          <img src={iconautoinput1} alt="" />
                          <span>음성듣기</span>
                        </button>
                        <button className="refresh">
                          <img src={iconautoinput2} alt="" />
                          <span>새로고침</span>
                        </button>
                      </li>
                    </ul>
                    <input type="text" placeholder="자동입력 방지" />
                  </li>
                  <li>
                    <ul className="checkbox-wrap2">
                      <li>
                        <input type="checkbox" id="save-id" />
                        <label htmlFor="save-id">아이디 저장</label>
                      </li>
                      <li>
                        <input type="checkbox" id="maintain-login" />
                        <label htmlFor="maintain-login">로그인 상태 유지</label>
                      </li>
                    </ul>
                  </li> */}
                  <li>
                    {userID && userID !== "" && password && password !== "" ? (
                      <button
                        className="login-btn2"
                        onClick={handleLogin}
                        style={{ cursor: "pointer" }}
                        onKeyDown={handleEnterKeyDown}
                        disabled={loading}
                      >
                        {loading ? (
                          <LoaderText text={"Login..."} />
                        ) : (
                          "로그인"
                        )}
                      </button>
                    ) : (
                      <button
                        className="login-btn"
                        style={{ cursor: "not-allowed" }}
                      >
                        로그인
                      </button>
                    )}
                    {/* @click="login" */}
                    <div className="login-option">
                      <Link to={"/find/id"}>아이디 찾기</Link>
                      <span />
                      <Link to={"/find/pw"}>비밀번호 찾기</Link>
                      <span />
                      <Link to={"/signup"}>회원가입</Link>
                    </div>
                  </li>
                </ul>
              </div>
            </article>
          </section>
        </main>
      </div>
    </>
  );
};

export default LoginPresenter;
