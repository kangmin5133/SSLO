import React from "react";
import "../../../../css/sslo/sslo_common.scoped.css";
import "../../../../css/sslo/support/inquiry.scoped.css";
import { useAppSelector } from "../../../../hooks";

export interface IInquiry {
  changeProposalFile: (e: any) => void;
  changeIntroductionFile: (e: any) => void;
  onChangeInfo: (e: any) => void;
  onSubmit: () => void;
  infoCheckBox: () => void;
  proposalFile: File;
  introductionFile: File;
  InfoCheck: boolean;
  userName: string;
  userEmail: string;
}

const SsloInquiryPresenter: React.FC<IInquiry> = ({
  onChangeInfo,
  onSubmit,
  changeProposalFile,
  changeIntroductionFile,
  infoCheckBox,
  proposalFile,
  introductionFile,
  InfoCheck,
  userName,
  userEmail,
}) => {
  const loggedInUser = useAppSelector((state) => state.userReducer);

  return (
    <main id="main" style={{ height: "2100px" }}>
      <section className="intro-type2">
        <img
          src={
            require("../../../../assets/images/sslo/sslo-logo(k).svg").default
          }
          alt="sslo-logo"
        />
        <h2>제휴 문의</h2>
        <b>Partnership inquiry</b>
      </section>
      {/* <!-- 메뉴바 --> */}
      <div className="lnb">
        <ul>
          <li>
            <a href="notice">공지사항</a>
          </li>
          <li>
            <a href="qna">1:1 문의하기</a>
          </li>
          <li>
            <a href="">제휴문의</a>
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
      {/* <!-- 제휴제안내용 --> */}
      <table className="customer1 sub-section table1">
        <caption>제휴제안 내용</caption>
        <tbody>
          <tr>
            <th>*제휴 유형</th>
            <td>
              <select
                defaultValue={"inquiry-type"}
                name="partnership_inquiry_type"
                onChange={onChangeInfo}
              >
                <option value="inquiry-type" disabled>
                  제휴 유형을 선택해주세요.
                </option>
                <option value="technology">기술 제휴</option>
                <option value="sales">판매 제휴</option>
                <option value="advertisement">광고 제휴</option>
                <option value="business">사업 제휴</option>
                <option value="etc">기타 제휴</option>
              </select>
            </td>
          </tr>
          <tr>
            <th>*제목</th>
            <td>
              <input
                className="title"
                placeholder="제목을 입력해주세요."
                name="partnership_inquiry_title"
                onChange={onChangeInfo}
              />
            </td>
          </tr>
          <tr>
            <th>*내용</th>
            <td>
              <textarea
                name="partnership_inquiry_contents"
                onChange={onChangeInfo}
                className="inquiry-text"
                placeholder="제휴하실 내용을 입력해주세요.
              1. 제안사유 
              2. 제안내용
              3. 기대효과
              4. 기타"
              />
            </td>
          </tr>
          <tr>
            <th>제안서첨부</th>
            <td>
              <input
                name="partnership_inquiry_proposal"
                type="file"
                className="attach"
                id="file"
                accept=".pdf"
                onChange={changeProposalFile}
              />
              <input
                placeholder="파일을 첨부해주세요.(.pdf)"
                className="file-upload"
                defaultValue={proposalFile ? proposalFile.name : ""}
              />
              <label id="upload-btn" htmlFor="file">
                파일첨부
              </label>
            </td>
          </tr>
        </tbody>
      </table>
      {/* <!-- 업체정보 --> */}
      <table className="customer1 sub-section table1">
        <caption>업체 정보 </caption>
        <tbody>
          <tr>
            <th>*기업 구분</th>
            <td>
              <select
                defaultValue={"inquiry-type"}
                name="partnership_inquiry_company_classification"
                onChange={onChangeInfo}
              >
                <option value="inquiry-type" disabled>
                  기업 구분을 선택해주세요.
                </option>
                <option value="public">공공기관</option>
                <option value="large corporation">대기업</option>
                <option value="medium-sized enterprise">중견기업</option>
                <option value="SME">중소기업</option>
                <option value="Startup">스타트업</option>
                <option value="SMB">소상공인</option>
              </select>
            </td>
          </tr>
          <tr>
            <th>*회사명</th>
            <td>
              <input
                className="name"
                placeholder="회사명을 입력해주세요."
                name="partnership_inquiry_company_name"
                onChange={onChangeInfo}
              />
            </td>
          </tr>
          <tr>
            <th>*제안자명</th>
            <td>
              {userName === undefined ? (
                <input
                  className="name"
                  placeholder={"제안자명을 입력해주세요."}
                  name="partnership_inquiry_creator_name"
                  onChange={onChangeInfo}
                />
              ) : (
                <input
                  className="name"
                  value={userName}
                  name="partnership_inquiry_creator_name"
                  onChange={onChangeInfo}
                  readOnly
                />
              )}
            </td>
          </tr>
          <tr>
            <th>*전화번호</th>
            <td>
              <input
                className="phone"
                placeholder="전화번호를 입력해주세요.(‘-’제외)"
                name="partnership_inquiry_company_number"
                onChange={onChangeInfo}
              />
            </td>
          </tr>
          <tr>
            <th>*메일</th>
            <td>
              {userEmail === undefined ? (
                <input
                  className="email"
                  placeholder={"메일주소를 입력해주세요."}
                  name="partnership_inquiry_company_email"
                  onChange={onChangeInfo}
                />
              ) : (
                <input
                  className="email"
                  value={userEmail}
                  name="partnership_inquiry_company_email"
                  onChange={onChangeInfo}
                  readOnly
                />
              )}
            </td>
          </tr>
          <tr>
            <th>홈페이지주소</th>
            <td>
              <input
                className="email"
                placeholder="홈페이지주소를 입력해주세요."
                name="partnership_inquiry_company_website_url"
                onChange={onChangeInfo}
              />
            </td>
          </tr>
          <tr>
            <th>회사소개서</th>
            <td>
              <input
                name="partnership_inquiry_company_introduction"
                type="file"
                accept=".pdf"
                className="attach"
                id="file1"
                onChange={changeIntroductionFile}
              />
              <input
                placeholder="파일을 첨부해주세요.(.pdf)"
                className="file-upload"
                defaultValue={introductionFile ? introductionFile.name : ""}
              />
              <label id="upload-btn" htmlFor="file1">
                파일첨부
              </label>
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        <div className="checkbox1">
          <input
            type="checkbox"
            name="agree"
            checked={InfoCheck}
            onChange={infoCheckBox}
          />
          <label>
            <span
              onClick={infoCheckBox}
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
export default SsloInquiryPresenter;
