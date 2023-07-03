import React, { ChangeEvent, useState, useRef, useEffect } from "react";
import "../../../../css/signup_login.scoped.css";
import { AuthGlobalStyles } from "../../../../globals";
import logo from "../../../../assets/images/signup_login/logo.svg";
import googlesvg from "../../../../assets/images/signup_login/google.svg";
import kakaosvg from "../../../../assets/images/signup_login/kakao.svg";
import naversvg from "../../../../assets/images/signup_login/naver.svg";
import warningsvg from "../../../../assets/images/signup_login/icon-warning.svg";
import iconview1 from "../../../../assets/images/signup_login/icon-view1.svg";
import { Link, useNavigate } from "react-router-dom";

import {
  ChakraProvider,
  Button,
  color,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

interface ISignupPresenter {
  id: string;
  email: string;
  emailDoubleCheck: boolean;
  emailCheckResult: string;
  writeEmail: boolean;
  idDoubleCheck: boolean;
  idCheckResult: string;
  writeId: boolean;
  pwType1: { type; visible };
  pwType2: { type; visible };
  writeConfirmPw: boolean;
  writeName: boolean;
  writeOrganization: boolean;
  writePw: boolean;
  serviceCheck: boolean;
  useCheck: boolean;
  openPolicy: boolean;
  openPolicy2: boolean;
  organizationId: number;
  organization: string;
  handlePwView1: () => void;
  handlePwView2: () => void;
  handleEmailChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleEmailDoubleCheck: () => void;
  handleIdChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleIdDoubleCheck: () => void;
  handlePwChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleConfirmPwChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleOrganizationChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSignUp: () => void;
  onOpenPolicy: () => void;
  onCancelPolicy: () => void;
  onOpenPolicy2: () => void;
  onCancelPolicy2: () => void;
  serviceCheckBox: () => void;
  useCheckBox: () => void;
}

const SignupMainPresenter: React.FC<ISignupPresenter> = ({
  id,
  email,
  emailDoubleCheck,
  emailCheckResult,
  writeEmail,
  idDoubleCheck,
  idCheckResult,
  writeId,
  writePw,
  pwType1,
  pwType2,
  writeConfirmPw,
  writeName,
  writeOrganization,
  openPolicy,
  openPolicy2,
  useCheck,
  serviceCheck,
  organizationId,
  organization,
  handlePwView1,
  handlePwView2,
  handleEmailChange,
  handleEmailDoubleCheck,
  handleIdChange,
  handleIdDoubleCheck,
  handlePwChange,
  handleConfirmPwChange,
  handleNameChange,
  handleOrganizationChange,
  handleSignUp,
  onOpenPolicy,
  onCancelPolicy,
  onOpenPolicy2,
  onCancelPolicy2,
  useCheckBox,
  serviceCheckBox,
}) => {
  return (
    <>
      <ChakraProvider>
        <AuthGlobalStyles />
        <div id="wrap">
          <header id="header" />
          <main>
            <div id="container2">
              <div className="title-wrap">
                <a href="/" className="title-logo">
                  <img src={logo} alt="" />
                </a>
                <h4>회원가입을 해주셔서 감사합니다.</h4>
              </div>
              <ul>
                {organizationId ? (
                  <li>
                    <div className="login-title">
                      <span />
                      <h4>소셜 간편 가입</h4>
                      <span />
                    </div>
                    <div className="social-signup">
                      <button
                        className="google"
                        onClick={() => {
                          location.href =
                            "http://210.113.122.196:8829/rest/api/1/auth/social/google";
                        }}
                      >
                        <img src={googlesvg} alt="" />
                        <span>구글 계정으로 회원가입</span>
                      </button>
                      <button
                        className="kakao"
                        onClick={() => {
                          location.href =
                            "http://210.113.122.196:8829/rest/api/1/auth/social/kakao";
                        }}
                      >
                        <img src={kakaosvg} alt="" />
                        <span>카카오 계정으로 회원가입</span>
                      </button>
                      <button
                        className="naver"
                        onClick={() => {
                          location.href =
                            "http://210.113.122.196:8829/rest/api/1/auth/social/naver";
                        }}
                      >
                        <img src={naversvg} alt="" />
                        <span>네이버 계정으로 회원가입</span>
                      </button>
                    </div>
                    <div className="login-title">
                      <span />
                      <p>또는</p>
                      <span />
                    </div>
                  </li>
                ) : (
                  ""
                )}
                <li>
                  <div className="login-title">
                    <span />
                    <h4>회원 정보를 입력하세요.</h4>
                    <span />
                  </div>
                  <div className="login-text">
                    <p>*는 필수 입력 정보입니다.</p>
                  </div>
                </li>
                {organizationId ? (
                  <li>
                    <div className="login-input">
                      <div className="login-input-check">
                        <div className="left">
                          <input
                            type="text"
                            className="check-data"
                            style={{
                              width: 400,
                              background: "#c5c5c5",
                              cursor: "no-drop",
                            }}
                            readOnly
                          />
                          <label>{email}</label>
                        </div>
                      </div>
                    </div>
                  </li>
                ) : (
                  <li>
                    <div className="login-input-wrap">
                      <div className="login-input-check">
                        <div className="left">
                          <input
                            onChange={handleEmailChange}
                            type="text"
                            id="login-email"
                            required
                            className="check-data"
                          />
                          <label htmlFor="login-email">
                            <span className="star">*</span> 이메일
                          </label>
                          {email.length === 0 ? null : emailDoubleCheck ? (
                            <span className="check-result">
                              {emailCheckResult}
                            </span>
                          ) : (
                            <span
                              className="check-result"
                              style={{ color: "#FF9F46" }}
                            >
                              {emailCheckResult}
                            </span>
                          )}
                        </div>
                        {writeEmail ? (
                          <button
                            onClick={handleEmailDoubleCheck}
                            style={{
                              backgroundColor: "#B0C4DE",
                              borderColor: "#B0C4DE",
                            }}
                            disabled={true}
                          >
                            중복체크
                          </button>
                        ) : (
                          <button
                            onClick={handleEmailDoubleCheck}
                            style={{ cursor: "pointer" }}
                            disabled={false}
                          >
                            중복체크
                          </button>
                        )}
                      </div>
                      {writeEmail ? (
                        <div className="warning">
                          <img src={warningsvg} alt="" />
                          <span> 이메일 형식이 올바르지 않습니다.</span>
                        </div>
                      ) : null}
                    </div>
                  </li>
                )}

                <li>
                  <div className="login-input-wrap">
                    <div className="login-input-check">
                      <div className="left">
                        <input
                          onChange={handleIdChange}
                          type="text"
                          id="login-id"
                          required
                          className="check-data"
                        />
                        <label htmlFor="login-id">
                          <span className="star">*</span> 아이디
                        </label>
                        {id.length === 0 ? null : idDoubleCheck ? (
                          <span className="check-result">{idCheckResult}</span>
                        ) : (
                          <span
                            className="check-result"
                            style={{ color: "#FF9F46" }}
                          >
                            {idCheckResult}
                          </span>
                        )}
                      </div>
                      {writeId ? (
                        <button
                          onClick={handleIdDoubleCheck}
                          style={{
                            backgroundColor: "#B0C4DE",
                            borderColor: "#B0C4DE",
                          }}
                          disabled={true}
                        >
                          중복체크
                        </button>
                      ) : (
                        <button
                          onClick={handleIdDoubleCheck}
                          style={{ cursor: "pointer" }}
                          disabled={false}
                        >
                          중복체크
                        </button>
                      )}
                    </div>
                    {writeId ? (
                      <div className="warning">
                        <img src={warningsvg} alt="" />
                        <span> 6-12자 이내 영문/숫자 조합으로 입력하세요.</span>
                      </div>
                    ) : null}
                  </div>
                </li>
                <li>
                  <div className="login-input-wrap">
                    <input
                      onChange={handlePwChange}
                      type={pwType1.type}
                      id="login-pw"
                      required
                    />
                    <label htmlFor="login-pw">
                      <span className="star">*</span> 비밀번호
                    </label>
                    <img
                      onClick={handlePwView1}
                      style={{ cursor: "pointer" }}
                      className="pw-view"
                      src={iconview1}
                      alt=""
                    />
                    {writePw ? (
                      <div className="warning">
                        <img src={warningsvg} alt="" />
                        <span>
                          {" "}
                          8-20자 이내 영문/숫자/특수문자 조합으로 입력하세요.
                        </span>
                      </div>
                    ) : null}
                  </div>
                </li>
                <li>
                  <div className="login-input-wrap">
                    <input
                      onChange={handleConfirmPwChange}
                      type={pwType2.type}
                      id="login-pw-confirm"
                      required
                    />
                    <label htmlFor="login-pw-confirm">
                      <span className="star">*</span> 비밀번호 확인
                    </label>
                    <img
                      onClick={handlePwView2}
                      style={{ cursor: "pointer" }}
                      className="pw-view"
                      src={iconview1}
                      alt=""
                    />
                    {writeConfirmPw ? (
                      <div className="warning">
                        <img src={warningsvg} alt="" />
                        <span> 비밀번호가 일치하지않습니다.</span>
                      </div>
                    ) : null}
                  </div>
                </li>
                <li>
                  <div className="login-input-wrap">
                    <input
                      onChange={handleNameChange}
                      type="text"
                      id="login-name"
                      required
                    />
                    <label htmlFor="login-name">
                      <span className="star">*</span> 이름
                    </label>
                    {writeName ? (
                      <div className="warning">
                        <img src={warningsvg} alt="" />
                        <span> 이름을 입력하세요.</span>
                      </div>
                    ) : null}
                  </div>
                </li>
                {organizationId ? (
                  <li>
                    <div className="login-input">
                      <input
                        type="text"
                        id="login-organization"
                        readOnly
                        style={{ background: "#c5c5c5", cursor: "no-drop" }}
                      />
                      <label>{organization}</label>
                    </div>
                  </li>
                ) : (
                  <li>
                    <div className="login-input-wrap">
                      <input
                        onChange={handleOrganizationChange}
                        type="text"
                        id="login-organization"
                        required
                      />
                      <label htmlFor="login-organization">
                        <span className="star">*</span> 소속
                      </label>
                      {writeOrganization ? (
                        <div className="warning">
                          <img src={warningsvg} alt="" />
                          <span> 소속을 입력하세요.</span>
                        </div>
                      ) : null}
                    </div>
                  </li>
                )}

                <li className="service-agree">
                  <div className="checkbox-wrap">
                    <input
                      type="checkbox"
                      id="service-agree1"
                      checked={serviceCheck}
                      onChange={serviceCheckBox}
                    />
                    <label htmlFor="service-agree1">
                      <span onClick={serviceCheckBox}>
                        <Link
                          to={"#"}
                          onClick={onOpenPolicy}
                          style={{ textDecoration: "underline" }}
                        >
                          서비스 이용약관
                          <Modal
                            isOpen={openPolicy}
                            onClose={onCancelPolicy}
                            size={"2xl"}
                            isCentered
                          >
                            <ModalContent
                              style={{
                                width: 800,
                                height: "80%",
                              }}
                            >
                              <ModalHeader
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  height: 50,
                                  paddingTop: 10,
                                  paddingBottom: 10,
                                  backgroundColor: "#D2E2F8",
                                  justifyContent: "center",
                                  color: "#243654",
                                  fontSize: "14px",
                                  fontWeight: 700,
                                }}
                              >
                                서비스 이용약관
                              </ModalHeader>
                              <ModalBody
                                style={{
                                  overflow: "auto",
                                  height: "80%",
                                  fontSize: 15,
                                  fontWeight: 500,
                                }}
                              >
                                <br />
                                <b>
                                  티벨(이하 ‘회사’)가 운영하는 SSLO 서비스를
                                  이용하시는 것은 다음의 조건에 동의한다는 것을
                                  의미합니다.
                                  <br /> 본 약관에 동의하지 않으시면 서비스
                                  이용이 제한될 수 있습니다.
                                </b>
                                <br />
                                <br />
                                <b>제 1조 (목적)</b>
                                <br />
                                본 약관은 주식회사 티벨(이하 ＂티벨＂ 또는
                                ＂회사＂라 합니다)가 운영하는 티벨 SSLO 웹사이트
                                및 모바일 애플리케이션을 통하여 제공하는 SSLO
                                솔루션을 이용함에 있어 회사와 이용자의 권리,
                                의무 및 책임사항, 기타 필요한 사항을 규정함을
                                목적으로 합니다.
                                <br />
                                <br />
                                <b>제 2조 (용어의 정의)</b>
                                <br />
                                본 약관에서 사용하는 용어의 정의는 다음과
                                같습니다.
                                <br />
                                ① ”회원”이라 함은 본 약관에 동의하고 계정을
                                생성한 자로서, 회사가 제공하는 서비스를 통하여
                                무료로 제공하는 정보를 지속적으로 이용할 수 있는
                                자를 말합니다.
                                <br />
                                ② “아이디(ID)”라 함은 회원의 식별 및 서비스
                                이용을 위하여 회원이 정한 문자와 숫자의 조합을
                                말합니다.
                                <br />
                                ③ ”비밀번호”라 함은 “회원”이 부여받은 “아이디”와
                                일치되는 “회원”임을 확인하고 비밀보호를 위해
                                “회원” 자신이 정한 문자 또는 숫자의 조합을
                                의미합니다.
                                <br />
                                ④ “유료회원”이라 함은 별도의 금액을 지불하고
                                이용권 등을 결제하여 유료서비스를 이용하는
                                회원을 의미합니다.
                                <br />
                                ⑤ “결제”라 함은 회원이 유료서비스를 이용하기
                                위하여 이 약관에서 정한 각종 지불수단을 통하여
                                회사가 정한 일정 금액을 회사에 지불하는 것을
                                의미합니다.
                                <br />
                                ⑥ "이용자"라 함은 회사의 서비스에 접속하여 본
                                약관에 따라 회사가 제공하는 서비스를 받는 자를
                                말합니다.
                                <br />
                                ⑦ "운영자"라 함은 서비스의 관리와 운영을 위하여
                                회사가 선정한 사람을 의미합니다.
                                <br />
                                ⑧ 이 약관에서 사용하는 용어의 정의는 본 조항에서
                                정의된 것을 제외하고는 관계 법령 및 서비스별
                                안내에서 정하는 바에 의합니다.
                                <br />
                                <br />
                                <b>제 3조 (약관의 게시와 개정 및 해석)</b>
                                <br />
                                ① 회사는 본 약관의 내용을 회원이 쉽게 알 수
                                있도록 메인사이트 푸터 및 회원가입 서비스
                                이용약관에 게시합니다.
                                <br />
                                ② 회사는 「약관의 규제에 관한 법률」,
                                「정보통신망 이용촉진 및 정보보호 등에 관한
                                법률」 등 관련법을 위배하지 않는 범위에서 본
                                약관을 개정할 수 있습니다.
                                <br />
                                ③ 회사가 약관을 개정할 경우에는 적용일자 및 개정
                                사유를 명시하여 현행약관과 함께 제1항의 방식에
                                따라 그 개정약관의 적용일자 30일 전부터 적용일자
                                전일까지 공지합니다. 다만, 이용자에게 불리한
                                약관의 개정의 경우에는 공지 외에 일정기간 서비스
                                내 전자우편, 전자쪽지, 로그인시 동의창 등의
                                전자적 수단을 통해 따로 명확히 통지하도록
                                합니다.
                                <br />
                                ④ 회사가 전항에 따라 개정약관을 공지 또는
                                통지하면서 이용자에게 30일 기간 내에 의사표시를
                                하지 않으면 의사표시가 표명된 것으로 본다는 뜻을
                                명확하게 공지 또는 통지하였음에도 이용자가
                                명시적으로 거부의 의사표시를 하지 아니한 경우
                                이용자가 개정약관에 동의한 것으로 봅니다.
                                <br />
                                ⑤ 이용자가 개정약관의 적용에 동의하지 않는 경우
                                회사는 개정 약관의 내용을 적용할 수 없으며, 이
                                경우 이용자는 이용계약을 해지(회원등록 취소)할
                                수 있습니다. 다만, 회사가 기존 약관을 계속
                                적용할 수 없는 특별한 사정이 있는 경우에는
                                개정약관에 동의하지 않는 이용자의 이용계약을
                                해지(서비스 불가)할 수 있습니다.
                                <br />
                                ⑥ 본 약관에서 정하지 아니한 사항과 본 약관의
                                해석에 관하여는 전기통신기본법, 전기통신사업법,
                                기타 관련법령 및 전기공급약관의 규정에 따릅니다.
                                <br />
                                <br />
                                <b>제 4조 (이용계약 체결)</b>
                                <br />
                                ① 이용계약은 이용자가 되고자 하는 고객(이하
                                ＂이용신청자")이 약관의 내용에 대하여 동의를 한
                                다음, 회사가 정한 가입 양식에 따라 주거정보를
                                기입한 후 서비스를 이용함으로써 체결됩니다.
                                <br />
                                ② 회사는 ＂이용신청자"의 서비스 이용을
                                승낙절차없이 제공함을 원칙으로 합니다. 다만,
                                회사는 다음 각 호에 해당하는 이용에 대하여
                                사후에 이용계약을 해지할 수 있습니다.
                                <br />
                                1. 기술상 서비스 제공이 불가능한 경우
                                <br />
                                2. 실명이 아니거나 타인의 명의를 이용한 경우
                                <br />
                                3. 허위의 정보를 기재하거나, 회사가 제시하는
                                내용을 기재하지 않은 경우
                                <br />
                                4. 14세 미만 아동이 법정대리인(부모 등)의 동의를
                                얻지 아니한 경우
                                <br />
                                5. 이용자의 귀책사유로 인하여 승인이
                                불가능하거나 기타 규정한 제반 사항을 위반하며
                                신청하는 경우
                                <br />
                                6. 사회적으로 부도덕적인 행위에 활용하는 경우
                                <br />
                                ③ 회사는 서비스 관련 설비의 여유가 없거나,
                                기술상 또는 업무상 문제가 있는 경우에는 이용을
                                제한할 수 있습니다.
                                <br />
                                ④ 제4항에 따라 이용을 제한하거나 유보한 경우,
                                회사는 원칙적으로 이를 이용신청자에게 알리도록
                                합니다.
                                <br />
                                ⑤ 이용계약의 성립 시기는 회사가 입력완료를
                                정보입력 상에서 표시한 시점으로 합니다.
                                <br />
                                <br />
                                <b>제 5조 (정보의 변경)</b>
                                <br />
                                ① 이용자는 이용신청 시 등록한 사항에 변경이 있는
                                경우, 상당한 기간 이내에 정보 수정 등의 방법으로
                                그 변경사항을 알려야 합니다.
                                <br />
                                ② 제1항의 변경사항을 변경하지 않아 발생한
                                불이익에 대하여 회사는 책임지지 않습니다.
                                <br />
                                <br />
                                <b>제 6조 (개인정보보호 의무)</b>
                                <br />
                                회사는 「개인정보보호법」등 관계 법령이 정하는
                                바에 따라 회원의 개인정보를 보호하기 위해
                                노력합니다. 개인정보의 보호 및 사용에 대해서는
                                관련법 및 회사의 「개인정보처리방침」이
                                적용됩니다. 다만, 회사의 공식 사이트 이외의
                                링크된 사이트에서는 회사의 개인정보처리방침이
                                적용되지 않습니다.
                                <br />
                                <br />
                                <b>제 7조 (회원에 대한 통지)</b>
                                <br />
                                ① 회사는 이용자 전체에 대한 통지의 경우 7일 이상
                                회사의 게시판에 게시함으로써 제1항의 통지에
                                갈음할 수 있습니다.
                                <br />
                                ②회사는 서비스를 통해 이용자의 단말기에 쿠키를
                                전송할 수 있습니다. 이용자는 쿠키 수신을 거부
                                하거나 쿠키 수신에 대해 경고하도록 설정을 변경할
                                수 있습니다.
                                <br />
                                <br />
                                <b>제 8조 (회사의 의무)</b>
                                <br />
                                ① 회사는 관련법과 본 약관이 금지하거나
                                미풍양속에 반하는 행위를 하지 않으며, 계속적이고
                                안정적으로 서비스를 제공하기 위하여 최선을
                                다하여 노력합니다.
                                <br />
                                ② 회사는 이용자가 안전하게 서비스를 이용할 수
                                있도록 개인정보(신용정보 포함)보호를 위해
                                보안시스템을 갖추어야 하며 개인정보처리방침을
                                공시하고 준수합니다.
                                <br />
                                ③ 회사는 서비스이용과 관련하여 발생하는 이용자의
                                불만 또는 피해구제요청을 적절하게 처리할 수
                                있도록 필요한 인력 및 시스템을 구비합니다.
                                <br />
                                ④ 회사는 서비스이용과 관련하여 이용자로부터
                                제기된 의견이나 불만이 정당하다고 인정할
                                경우에는 이를 처리하여야 합니다. 이용자가 제기한
                                의견이나 불만사항에 대해서는 게시판을 활용하거나
                                전자우편 등을 통하여 이용자에게 처리과정 및
                                결과를 전달합니다.
                                <br />
                                <br />
                                <b>제 9조 (이용자의 의무)</b>
                                <br />
                                ① 이용자는 다음 행위를 하여서는 안 됩니다.
                                <br />
                                1. 회사가 게시한 정보의 변경
                                <br />
                                2. 회사가 정한 정보 이외의 정보(컴퓨터 프로그램
                                등) 등의 송신 또는 게시
                                <br />
                                3. 회사와 기타 제3자의 저작권 등 지적재산권에
                                대한 침해
                                <br />
                                4. 회사 및 기타 제3자의 명예를 손상시키거나
                                업무를 방해하는 행위
                                <br />
                                5. 회사의 동의 없이 영리를 목적으로 서비스를
                                사용하는 행위
                                <br />
                                6. 기타 불법적이거나 부당한 행위
                                <br />
                                ② 이용자는 관계법, 본 약관의 규정, 이용안내 및
                                서비스와 관련하여 공지한 주의사항, 회사가
                                통지하는 사항 등을 준수하여야 하며, 기타 회사의
                                업무에 방해되는 행위를 하여서는 안 됩니다.
                                <br />
                                ③ 이용자는 회사의 사전 동의 없이 서비스를
                                이용하여 어떠한 영리행위도 할 수 없으며, 법에
                                저촉 되는 자료를 배포 또는 게재할 수 없습니다.
                                특히 해킹, 광고를 통한 수익획득 행위,
                                음란사이트를 통한 상업행위, 상용S/W 불법배포
                                등을 할 수 없습니다. 이를 어기고 발생한 행위의
                                결과 및 손실, 관계기관에 의한 구속 등 법적 조치
                                등에 대해서 회사는 책임을 지지 않으며, 이용자는
                                이와 같은 행위와 관련하여 회사에 대하여 손해배상
                                의무를 집니다.
                                <br />
                                ④ 이용자는 서비스의 이용권한, 기타 이용 계약상
                                지위를 타인에게 양도, 증여할 수 없으며 이를
                                담보로 제공할 수 없습니다.
                                <br />
                                <br />
                                <b>제 10조 (서비스의 제공 및 변경)</b>
                                <br />
                                ① 회사는 회원에게 아래와 같은 서비스를
                                제공합니다.
                                <br />
                                데이터 수집 관련 정보제공 서비스
                                <br />
                                데이터 정제 관련 정보제공 서비스
                                <br />
                                데이터 전처리 관련 정보제공 서비스
                                <br />
                                데이터 가공 관련 정보제공 서비스
                                <br />
                                기타 회사가 정하는 서비스 <br />
                                ② 서비스는 연중무휴, 1일 24시간 제공함을
                                원칙으로 합니다. 다만, 회사는 서비스를
                                일정범위로 분할하여 각 범위별로 이용 가능한
                                시간을 별도로 정할 수 있으며, 이 경우 그 내용을
                                사전에 공지합니다.
                                <br />
                                ③ 회사는 상당한 이유가 있는 경우에 운영상,
                                기술상의 필요에 따라 제공하고 있는 전부 또는
                                일부 서비스를 변경하거나 추가할 수 있습니다.
                                <br />
                                <br />
                                <b>제 11조 (서비스의 중지 등)</b>
                                <br />
                                ① 회사는 아래의 각 호에 해당하는 경우 서비스의
                                제공을 일시적으로 중단할 수 있습니다.
                                <br />
                                정보통신설비의 보수점검, 교체 및 고장, 통신두절
                                등의 기술상 불가피한 경우
                                <br />
                                정전, 제반 설비의 장애 또는 이용량의 폭주 등으로
                                정상적인 서비스 제공에 지장이 있는 경우
                                <br />
                                기타 천재지변, 국가비상사태 등의 불가항력적
                                사유가 있는 경우
                                <br />
                                ② 제 1항에 의해 서비스의 중지가 발생한 경우
                                회사는 제 8조 (이용자에 대한 통지)에 정한
                                방법으로 회원에게 통지합니다. 다만, 회사가
                                사전에 통지할 수 없는 부득이한 사유가 있는 경우
                                사후에 통지할 수 있습니다.
                                <br />
                                ③ 회사는 서비스의 제공에 필요한 경우 정기점검을
                                실시할 수 있으며, 정기점검시간은 서비스
                                제공화면에 공지한 바에 따릅니다.
                                <br />
                                <br />
                                <b>제 12조 (정보의 제공 및 광고의 게재)</b>
                                <br />
                                ① 회사는 이용자의 서비스 이용 중 필요하다고
                                인정되는 다양한 정보를 공지사항이나 전자우편
                                등의 방법으로 이용자에게 제공할 수 있습니다.
                                다만, 이용자는 관련법에 따른 전기사용 관련 정보
                                및 고객문의 등에 대한 답변 등을 제외하고는
                                언제든지 전자우편에 대해서 수신 거절을 할 수
                                있습니다.
                                <br />
                                ② 제1항의 정보를 전화 및 모사전송기기에 의하여
                                전송하려고 하는 경우에는 이용자의 사전 동의를
                                받아서 전송합니다. 다만, 이용자의 전기사용 관련
                                정보 및 고객문의 등에 대한 회신에 있어서는
                                제외됩니다.
                                <br />
                                ③ 회사는 서비스의 운영과 관련하여 서비스 화면,
                                홈페이지, 전자우편 등에 광고를 게재할 수
                                있습니다. 광고가 게재된 전자우편을 수신한
                                이용자는 수신거절을 회사에게 할 수 있습니다.
                                <br />
                                ④ 이용자는 회사가 제공하는 서비스와 관련하여
                                게시물 또는 기타 정보를 변경, 수정, 제한하는
                                등의 조치를 취하지 않습니다.
                                <br />
                                <br />
                                <b>제 13조 (이용제한 등)</b>
                                <br />
                                ① 회사는 이용자가 본 약관의 의무를 위반하거나
                                서비스의 정상적인 운영을 방해한 경우, 그
                                이용자에 대해 서비스의 전부 또는 일부의 이용을
                                제한할 수 있습니다.
                                <br />
                                ②본 조에 따라 서비스 이용을 제한하거나 계약을
                                해지하는 경우에는 제8조에 정한 방법으로
                                이용자에게 통지합니다.
                                <br />
                                ③회사는 본 조에 의해 서비스의 이용이 제한됨으로
                                인하여 이용자 또는 제 3자가 입은 손해에 대하여
                                회사에 고의 또는 중과실이 있는 경우를 제외하고는
                                배상하지 않습니다.
                                <br />
                                ④이용자는 본 조에 따른 이용제한 등에 대해 회사가
                                정한 절차에 따라 이의 신청을 할 수 있습니다. 이
                                때 이의신청이 정당하다고 회사가 인정하는 경우,
                                회사는 즉시 서비스의 이용을 재개합니다.
                                <br />
                                <br />
                                <b>제 14조 (계약해제, 해지 등)</b>
                                <br />
                                ① 회원은 언제든지 정보삭제를 통해 이용계약 해지
                                신청을 할 수 있으며, 회사는 관련법 등이 정하는
                                바에 따라 이를 즉시 처리하여야 합니다.
                                <br />
                                ② 본 조와 제 16조에 의해 이용계약이 해지되는
                                경우, 관련법 및 개인정보처리방침에 따라 회사가
                                정보를 보유하는 경우를 제외하고는 해지 즉시
                                정보를 삭제합니다.
                                <br />
                                ③ 이용자가 제공한 정보의 경우 해당 정보제공 조건
                                및 개인정보처리방침에 의해 처리됩니다.
                                <br />
                                ④ 전기상담 등 이용자가 작성한 게시물은 자동
                                삭제되지 않으니 사전에 삭제 요청 등을 통해 처리
                                후 이용계약 해지하시기 바랍니다.
                                <br />
                                <br />
                                <b>제15조 (책임제한)</b>
                                <br />
                                ① 회사는 천재지변 또는 이에 준하는 불가항력으로
                                인하여 서비스를 제공할 수 없는 경우에는 서비스
                                제공에 관한 책임이 면제됩니다.
                                <br />
                                ② 회사가 제공하는 서비스와 관련하여 이용자에게
                                발생한 손해에 대해 회사에 고의 또는 중과실에
                                의한 경우를 제외하고 이에 대하여 책임을 지지
                                않습니다.
                                <br />
                                ③ 회사는 이용자가 서비스의 이용과 관련하여
                                기대하는 이익의 상실이나 서비스를 통하여 얻은
                                자료에 대한 취사선택 또는 이용으로 발생하는 손해
                                등에 대해 책임을 지지 않습니다.
                                <br />
                                ④ 회사는 서비스에서 제공되는 메시지, 전자우편,
                                게시판의 게시물 등이 보유되는 최대 일수, 송수신
                                할 수 있는 전자우편 메시지의 최대크기 등을 제한
                                할 수 있습니다.
                                <br />
                                ⑤ 회사는 이용자의 귀책사유로 인한 서비스 이용의
                                장애에 대하여는 책임을 지지 않습니다.
                                <br />
                                ⑥ 회사는 서비스와 관련하여 게재한 정보, 자료,
                                사실의 신뢰도, 정확성 등의 내용에 관하여는
                                책임을 지지 않습니다.
                                <br />
                                ⑦ 회사는 이용자 간 또는 이용자와 제3자 상호간에
                                서비스를 매개로 발생한 분쟁에 대해서는 개입할
                                의무가 없으며 이로 인한 손해를 배상할 책임이
                                없습니다.
                                <br />
                                ⑧ 이용자가 본 약관의 규정을 위반함으로 인하여
                                회사에 손해가 발생하게 되는 경우, 위반한
                                이용자는 회사에 발생되는 모든 손해를 배상하여야
                                하며, 이용자에게 발생한 손해에 대해서도 회사를
                                면책시켜야 합니다.
                                <br />
                                <br />
                                <b>제 16조 (분쟁의 해결)</b>
                                <br />
                                ① 회사와 이용자는 서비스와 관련하여 발생한
                                분쟁을 원만하게 해결하기 위하여 필요한 모든
                                노력을 하여야 합니다.
                                <br />
                                ② 제1항의 노력에도 불구하고 분쟁이 해결되지 않을
                                경우, 양 당사자는 민사 소송법상의 관할법원에
                                소를 제기할 수 있습니다.
                                <br />
                                ③ 회사와 이용자 간 제기된 소송은 대한민국 법을
                                준거법으로 합니다.
                                <br />
                                <br />
                                <b>부칙</b>
                                <br />
                                본 약관은 2023년 2월 1일부터 적용됩니다.
                                <br />
                              </ModalBody>
                              <ModalFooter>
                                <Button
                                  style={{
                                    width: "10%",
                                    height: 30,
                                    backgroundColor: "#3580E3",
                                    fontSize: 12,
                                    color: "#FFF",
                                    marginRight: 0,
                                  }}
                                  onClick={onCancelPolicy}
                                >
                                  닫기
                                </Button>
                              </ModalFooter>
                            </ModalContent>
                          </Modal>
                        </Link>
                        에 동의합니다.
                      </span>
                    </label>
                  </div>
                  <div className="checkbox-wrap">
                    <input
                      type="checkbox"
                      id="service-agree2"
                      checked={useCheck}
                      onChange={useCheckBox}
                    />
                    <label htmlFor="service-agree2">
                      <span onClick={useCheckBox}>
                        <Link
                          to={"#"}
                          style={{ textDecoration: "underline" }}
                          onClick={onOpenPolicy2}
                        >
                          개인정보 수집 및 이용
                          <Modal
                            isOpen={openPolicy2}
                            onClose={onCancelPolicy2}
                            size={"2xl"}
                            isCentered
                          >
                            <ModalContent
                              style={{
                                width: 800,
                                height: "80%",
                              }}
                            >
                              <ModalHeader
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  height: 50,
                                  paddingTop: 10,
                                  paddingBottom: 10,
                                  backgroundColor: "#D2E2F8",
                                  justifyContent: "center",
                                  color: "#243654",
                                  fontSize: "14px",
                                  fontWeight: 700,
                                }}
                              >
                                개인정보 수집 및 이용
                              </ModalHeader>
                              <ModalBody
                                style={{
                                  height: "80%",
                                  overflow: "auto",
                                  fontSize: 15,
                                  fontWeight: 500,
                                }}
                              >
                                <br />
                                <b>
                                  티벨 SSLO 서비스 관련하여 아래와 같이
                                  개인정보를 수집 및 이용합니다.
                                  <br /> 티벨에서 수집한 개인정보는
                                  개인정보보호법 등 관계 법령에 따라 안전하게
                                  관리됩니다.
                                </b>
                                <br />
                                <br /> 1. 수집하는 개인정보의 항목
                                <br />
                                &nbsp;&nbsp; ① 이메일, 아이디, 비밀번호, 이름,
                                소속 <br />
                                <br />
                                2. 개인정보의 수집 및 이용목적 <br />
                                &nbsp;&nbsp; ① 서비스 이용/해지에 따른 본인 식별
                                <br />
                                &nbsp;&nbsp; ② 서비스 이용기록과 접속 빈도 분석,
                                서비스 이용에 대한 통계, 맞춤형 서비스 제공
                                <br />
                                &nbsp;&nbsp; ③ 이벤트 정보 및 참여기회 제공,
                                광고성 정보 제공 등 마케팅 및 프로모션 목적
                                <br />
                                &nbsp;&nbsp; ④ 법령 및 이용약관을 위반하는
                                회원에 대한 이용 제한 조치, 부정 이용 행위를
                                포함하여 <br />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 서비스의
                                원활한 운영에 지장을 주는 행위에 대한 방지 및
                                제재, 계정도용 및 부정거래
                                <br />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 방지, 약관
                                개정 등의 고지사항 전달, 분쟁조정을 위한 기록
                                보존, 민원처리 등 이용자
                                <br />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 보호 및
                                서비스 운영
                                <br />
                                <br />
                                3. 개인정보의 보관기간
                                <br />
                                &nbsp;&nbsp; ① 회원탈퇴 시 또는 서비스 해지 시
                                지체없이 파기합니다. 단, 관계법령에 의해
                                보관해야
                                <br />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 하는 정보는
                                해당 법령에서 정한 기간만큼 보관합니다.
                                <br />
                                <br />
                                4. 동의 거부권 등에 대한 공지 <br />
                                &nbsp;&nbsp; ① 본 동의는 서비스의 본질적인 기능
                                제공을 위한 개인정보 수집/이용에 대한 동의로서,
                                <br />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 위 내용에
                                동의하지 않으실 경우 서비스 제공이 불가능합니다.
                                <br />
                                <br />
                                <b>
                                  위 내용 외 개인정보와 관련한 일반적인 내용은
                                  ‘티벨 개인정보 처리방침’에 따릅니다.
                                </b>
                              </ModalBody>
                              <ModalFooter>
                                <Button
                                  style={{
                                    width: "10%",
                                    height: 30,
                                    backgroundColor: "#3580E3",
                                    fontSize: 12,
                                    color: "#FFF",
                                    marginRight: 0,
                                  }}
                                  onClick={onCancelPolicy2}
                                >
                                  닫기
                                </Button>
                              </ModalFooter>
                            </ModalContent>
                          </Modal>
                        </Link>
                        에 동의합니다.
                      </span>
                    </label>
                  </div>
                </li>
                <li className="login-btn-wrap">
                  <button
                    onClick={handleSignUp}
                    className="confirmation2"
                    style={{ cursor: "pointer" }}
                  >
                    회원가입
                  </button>
                </li>
                <li>
                  <div className="login-title">
                    <span />
                  </div>
                </li>
                <li className="logout-wrap">
                  <p>이미 계정이 있으세요?</p>
                  <a href="login" className="login">
                    로그인
                  </a>
                </li>
              </ul>
            </div>
          </main>
          <footer id="footer" />
        </div>
      </ChakraProvider>
    </>
  );
};

export default SignupMainPresenter;
