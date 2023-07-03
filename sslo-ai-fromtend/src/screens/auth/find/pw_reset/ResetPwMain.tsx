import React, { ChangeEvent, useState } from "react";
import { AuthGlobalStyles } from "../../../../globals";
import logo from "../../../../assets/images/signup_login/logo.svg";
import iconWarning from "../../../../assets/images/signup_login/icon-warning.svg";
import "../../../../css/signup_login.scoped.css";
import iconview from "../../../../assets/images/signup_login/icon-view1.svg";
const ResetPwMain = () => {
  const [userPw, setUserPw] = useState<string>("");
  const [confirmPw, setConfirmPw] = useState<string>("");
  const [pwCheck, setPwCheck] = useState<boolean>(true);
  const [confirmPwCheck, setConfirmPwCheck] = useState<boolean>(true);
  const [viewPw1, setViewPw1] = useState({ type: "password", visible: false });
  const [viewPw2, setViewPw2] = useState({ type: "password", visible: false });

  const handleChangePw = (e: ChangeEvent<HTMLInputElement>) => {
    const pw = e.target.value;
    setUserPw(pw);
    const pwCheck = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$/;
    pwCheck.test(pw) ? setPwCheck(false) : setPwCheck(true);
  };

  const handleChangeConfirmPw = (e: ChangeEvent<HTMLInputElement>) => {
    const confirmPw = e.target.value;
    setConfirmPw(confirmPw);
    userPw === confirmPw ? setConfirmPwCheck(false) : setConfirmPwCheck(true);
  };

  const handlePwView1 = () => {
    setViewPw1(() => {
      if (!viewPw1.visible) {
        return { type: "text", visible: true };
      } else {
        return { type: "password", visible: false };
      }
    });
  };

  const handlePwView2 = () => {
    setViewPw2(() => {
      if (!viewPw2.visible) {
        return { type: "text", visible: true };
      } else {
        return { type: "password", visible: false };
      }
    });
  };
  return (
    <>
      <AuthGlobalStyles />
      <div id="wrap">
        <header id="header" />
        <main>
          <div id="container2">
            <div className="title-wrap">
              <a href="/login" className="title-logo">
                <img src={logo} alt="" />
              </a>
              <h4 style={{ fontSize: 18 }}>새로운 비밀번호를 입력해주세요.</h4>
            </div>
            <ul>
              <li>
                <div className="login-title">
                  <span />
                </div>
              </li>
              <li>
                <div className="login-input-wrap">
                  <input
                    type={viewPw1.type}
                    id="login-pw"
                    value={userPw}
                    onChange={handleChangePw}
                    required
                  />
                  <label htmlFor="login-id">새 비밀번호</label>
                  <img
                    onClick={handlePwView1}
                    style={{ cursor: "pointer" }}
                    className="pw-view"
                    src={iconview}
                    alt=""
                  />
                  {pwCheck ? (
                    <div className="warning">
                      <img src={iconWarning} alt="" />
                      <span> 8-20자 이내 영문/숫자/특수문자로 입력하세요.</span>
                    </div>
                  ) : null}
                </div>
                <div className="login-input-wrap">
                  <input
                    type={viewPw2.type}
                    id="login-id"
                    value={confirmPw}
                    onChange={handleChangeConfirmPw}
                    required
                  />
                  <label htmlFor="login-id">새 비밀번호 확인</label>
                  <img
                    onClick={handlePwView2}
                    style={{ cursor: "pointer" }}
                    className="pw-view"
                    src={iconview}
                    alt=""
                  />
                  {confirmPwCheck ? (
                    <div className="warning">
                      <img src={iconWarning} alt="" />
                      <span> 비밀번호가 일치하지않습니다.</span>
                    </div>
                  ) : null}
                </div>
              </li>
              <li className="login-btn-wrap">
                <a href="/login" className="cancel">
                  취소
                </a>
                <button
                  onClick={undefined}
                  className="confirmation"
                  style={{ cursor: "pointer" }}
                >
                  확인
                </button>
              </li>
              <div className="login-title">
                <span />
              </div>
            </ul>
          </div>
        </main>
        <footer id="footer" />
      </div>
    </>
  );
};

export default ResetPwMain;
