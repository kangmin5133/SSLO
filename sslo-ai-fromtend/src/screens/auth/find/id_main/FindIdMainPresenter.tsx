import React, { ChangeEvent } from "react";
import { AuthGlobalStyles } from "../../../../globals";
import logo from "../../../../assets/images/signup_login/logo.svg";
import iconWarning from "../../../../assets/images/signup_login/icon-warning.svg";
import "../../../../css/signup_login.scoped.css";

interface IFindIdMainPresenter {
  userEmail: string;
  checkEmail: boolean;
  handleConfirm: () => void;
  handleChangeEmail: (e: ChangeEvent<HTMLInputElement>) => void;
  getFindId:()=>void;
}

const FindIdMainPresenter: React.FC<IFindIdMainPresenter> = ({
  userEmail,
  checkEmail,
  handleConfirm,
  handleChangeEmail,
  getFindId,
}) => {
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
              <h4 style={{ fontSize: 18 }}>
                회원정보상의 이메일을 입력하세요.
              </h4>
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
                    type="text"
                    id="login-id"
                    value={userEmail}
                    onChange={handleChangeEmail}
                    required
                  />
                  <label htmlFor="login-id">이메일</label>
                  {checkEmail ? (
                    <div className="warning">
                      <img src={iconWarning} alt="" />
                      <span> 형식에 맞게 이메일 주소를 입력하세요.</span>
                    </div>
                  ) : null}
                </div>
              </li>
              <li className="login-btn-wrap">
                <a href="/login" className="cancel">
                  취소
                </a>
                <button
                  onClick={getFindId}
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

            <div className="contentbox">
              <div className="member-info">
                <p>
                  회원정보가 기억나지 않거나 이메일 주소가 불일치하여 <br />
                  아이디 찾기가 어려운 경우에는 관리자에게 문의해주세요. <br />
                  <b>관리자 이메일 : abc1234@tbell.co.kr</b>
                </p>
              </div>
            </div>
          </div>
        </main>
        <footer id="footer" />
      </div>
    </>
  );
};

export default FindIdMainPresenter;
