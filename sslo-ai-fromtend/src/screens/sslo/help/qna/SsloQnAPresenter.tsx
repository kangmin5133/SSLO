import { Checkbox } from "@chakra-ui/react";
import React from "react";
import "../../../../css/sslo/sslo_common.scoped.css";
import "../../../../css/sslo/support/qna.scoped.css";
import { useAppSelector } from "../../../../hooks";

interface IQnaPresenter {
  ageCheck: boolean;
  useCheck: boolean;
  userName: string;
  onChangeContent: (e: any) => void;
  onSubmit: () => void;
  useCheckBox: () => void;
  ageCheckBox: () => void;
}

const SsloQnAPresenter: React.FC<IQnaPresenter> = ({
  ageCheck,
  useCheck,
  userName,
  useCheckBox,
  ageCheckBox,
  onChangeContent,
  onSubmit,
}) => {
  const loggedInUser = useAppSelector((state) => state.userReducer);
  return (
    <main id="main" style={{ height: "1680px" }}>
      <section className="intro-type2">
        <img
          src={
            require("../../../../assets/images/sslo/sslo-logo(k).svg").default
          }
          alt="sslo-logo"
        />
        <h2>1:1 문의하기</h2>
        <b>1:1 question</b>
      </section>
      {/* <!-- 메뉴바 --> */}
      <div className="lnb">
        <ul>
          <li>
            <a href="notice">공지사항</a>
          </li>
          <li>
            <a href="">1:1 문의하기</a>
          </li>
          <li>
            <a href="inquiry">제휴문의</a>
          </li>
          <li>
            <a href="faq">자주하는 질문</a>
          </li>
        </ul>
        <div className="container">
          <div className="now">
            <div className="now-bar" />
          </div>
        </div>
      </div>
      <table className="customer1 sub-section table1">
        <tbody>
          <tr>
            <th>*문의유형</th>
            <td>
              <select
                defaultValue={"qna-type"}
                name="inquiry_type"
                onChange={onChangeContent}
              >
                <option value="qna-type" disabled>
                  문의 유형을 선택해주세요.
                </option>
                <option value="website">사이트 문의</option>
                <option value="account">계정 문의</option>
                <option value="solution">솔루션 문의</option>
                <option value="etc">기타 문의</option>
              </select>
            </td>
          </tr>
          <tr>
            <th>*제목</th>
            <td>
              <input
                className="qna-title"
                placeholder="문의 제목을 입력해주세요."
                name="inquiry_title"
                onChange={onChangeContent}
              />
            </td>
          </tr>
          <tr>
            <th>*이름</th>
            <td>
              {/* <input
                  className="name"
                  placeholder={"이름을 입력해주세요."}
                  name="inquiry_user_display_name"
                  onChange={onChangeContent}
                /> */}
              {userName === undefined ? (
                <input
                  className="name"
                  value={userName}
                  placeholder={"이름을 입력해주세요."}
                  name="inquiry_user_display_name"
                  onChange={onChangeContent}
                />
              ) : (
                <input
                  className="name"
                  value={userName}
                  readOnly
                  name="inquiry_user_display_name"
                  onChange={onChangeContent}
                />
              )}
            </td>
          </tr>
          <tr>
            <th>*전화번호</th>
            <td>
              <input
                className="phone"
                placeholder="전화번호를 입력해주세요.( ‘-’제외 )"
                name="inquiry_user_number"
                onChange={onChangeContent}
              />
            </td>
          </tr>
          <tr>
            <th>*이메일</th>
            <td>
              <input
                className="email"
                placeholder="이메일을 정확히 입력해주세요."
                name="inquiry_user_email"
                onChange={onChangeContent}
              />
            </td>
          </tr>
          {/* <div className="title" style={{ float: "left" }}>
          *관심/사업분야
          </div>
          <div className="input">
          <select style={{ width: "500px", height: "40px", fontSize:"14px" }}>
          <option>귀하의 관심/사업분야를 선택해주세요.</option>
          </select>
        </div> */}
          <tr>
            <th>*문의내용</th>
            <td>
              <textarea
                className="qna-text"
                placeholder="문의내용을 상세히 입력해주세요."
                name="inquiry_contents"
                onChange={onChangeContent}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        <div className="checkbox1">
          <input type="checkbox" checked={ageCheck} onChange={ageCheckBox} />
          <label>
            <span
              onClick={ageCheckBox}
              style={{ marginLeft: "10px", fontSize: "18px", color: "#243654" }}
            >
              14세 미만이 아님을 확인합니다.
            </span>
          </label>
        </div>
        <div className="text">
          <label>
            <span style={{ marginLeft: "20px" }}>
              만 14세 미만인 경우 서비스가 제한됩니다. 서비스를 원하시는 경우,
              고객센터로 문의 부탁드립니다. <br />
            </span>
            <span style={{ marginLeft: "20px" }}>
              (고객센터 연락처 : abdc1234@tbell.co.kr)
            </span>
          </label>
        </div>
        <div className="checkbox2">
          <input type="checkbox" checked={useCheck} onChange={useCheckBox} />
          <label>
            <span
              onClick={useCheckBox}
              style={{ marginLeft: "10px", fontSize: "18px", color: "#243654" }}
            >
              개인정보 수집 및 이용에 동의합니다.
            </span>
          </label>
        </div>
        <div className="submit" onClick={onSubmit}>
          제출
        </div>
      </div>
    </main>
  );
};

export default SsloQnAPresenter;
