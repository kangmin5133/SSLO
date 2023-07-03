import React from "react";
import "../../../../css/sslo/mypage/mypage_privacy.scoped.css";
import { useNavigate} from "react-router-dom";
import { IPrivacyUser } from "./MyPagePrivacyContainer";
import {
  ChakraProvider,
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalCloseButton,
  Button as ChakraButton,
  extendTheme,
} from "@chakra-ui/react"

const theme = extendTheme({
  colors: {
    ssloGreen: {
      100: "#2EA090",
      500: "#2EA090",
    },
    ssloOrange: {
      100: "#FF4343",
      500: "#FF4343",
    },
    ssloNavy: {
      100: "#243654",
      500: "#243654",
    },
    ssloGrey: {
      100: "#5F6164",
      500: "#5F6164",
    }
  },
});

export interface IPrivacyPresenter {
  userInfo: IPrivacyUser;
  onChangeContent: (e: any) => void;
  handleSave: (e: any) => Promise<void>;
  openQuit: () => void;
  closeQuit: () => void;
  isQuitOn: boolean;
  handleDelete: () => Promise<void>;
  closeCompleteQuit: () => void;
  isCompleteQuitOn: boolean;
  handleCompleteDelete: () => void;
}

const MyPagePrivacyPresenter: React.FC<IPrivacyPresenter> = ({
  userInfo,
  onChangeContent,
  handleSave,
  openQuit,
  closeQuit,
  isQuitOn,
  handleDelete,
  closeCompleteQuit,
  isCompleteQuitOn,
  handleCompleteDelete,
}) => {
  const navigate = useNavigate();
  return (
    <ChakraProvider theme={theme}>
    <main id="main">
      <section className="intro-type2">
        <img
          src={require("../../../../assets/images/sslo/sslo-logo(k).svg").default}
          alt="sslo-logo"
        />
        <h2>개인정보설정</h2>
        <b>Privacy</b>
      </section>
      {/* <!-- 메뉴바 --> */}
      <div className="lnb">
        <ul style={{width: "650px"}}>
          <li id="tab_contact">
            <a href="/sslo/mypage/contact">문의내역</a>
          </li>
          <li id="tab_privacy">
            <a href="/sslo/mypage/privacy">개인정보설정</a>
          </li>
        </ul>
        <div className="container">
          <div id="line_now" className="now">
            <div className="now-bar" />
          </div>
        </div>
      </div>
      <section className="sec_privacy sub-section">
        <table>
          <tbody>
              <tr>
                <th>이메일</th>
                <td>
                  <input 
                    id={"email"} 
                    name={"email"} 
                    placeholder={userInfo?userInfo.email:"이메일"} 
                    onChange={onChangeContent} />
                </td>
              </tr>
              <tr>
                <th>이름</th>
                <td>
                  <input 
                    id={"name"} 
                    name={"name"} 
                    placeholder={userInfo?userInfo.name:"이름"} 
                    onChange={onChangeContent} />
                </td>
              </tr>
              <tr>
                <th>소속</th>
                <td>
                  <span>{userInfo?userInfo.org.organization_name:""}</span>
                </td>
              </tr>
              <tr>
                <th>비밀번호</th>
                <td>{"********"}
                  <button className="password-modify-btn" type="button" onClick={() => navigate("./password/")}>비밀번호 변경</button>
                </td>
              </tr>
          </tbody>
        </table>
        <div className="button-box">
          <button className="btn-quit" type="button" onClick={openQuit} style={{ cursor: "pointer" }}>회원탈퇴
          <Modal isCentered isOpen={isQuitOn} onClose={closeQuit}>
            <ModalContent>
              <ModalHeader>회원탈퇴 확인</ModalHeader>
              <ModalCloseButton />
              <ModalBody>탈퇴하시겠습니까?</ModalBody>
              <ModalFooter height={"auto"} paddingTop={0} background={"transparent"}>
                <ChakraButton mr={3} onClick={closeQuit}>취소</ChakraButton>
                <ChakraButton colorScheme="ssloOrange" onClick={handleDelete}>탈퇴</ChakraButton>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Modal isCentered isOpen={isCompleteQuitOn} onClose={closeCompleteQuit}>
            <ModalContent>
              <ModalHeader>회원탈퇴 완료</ModalHeader>
              <ModalCloseButton />
              <ModalBody>회원 탈퇴가 정상적으로 되었습니다. 이용해주셔서 감사합니다.</ModalBody>
              <ModalFooter height={"100%"}>
                <ChakraButton colorScheme="ssloNavy" onClick={handleCompleteDelete}>확인</ChakraButton>
              </ModalFooter>
            </ModalContent>
          </Modal>
          </button>
          <button className="btn-save" type="button" onClick={handleSave} style={{ cursor: "pointer" }}>저장</button>
        </div>
      </section>
    </main>
    </ChakraProvider>
  );
}

export default MyPagePrivacyPresenter;