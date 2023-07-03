import "../../../../../css/sslo/sslo_common.scoped.css";
import "../../../../../css/sslo/support/notice_detail.scoped.css";
import { useNavigate } from "react-router-dom";
import { INotice } from "../../../../../api/helpApi";

export interface INoticeDetailPresenter {
  notice: INotice;
}

const NoticeDetailPresenter: React.FC<INoticeDetailPresenter> = ({
  notice,
}) => {
  const navigate = useNavigate();
  return (
    <main id="main">
      <section className="intro-type2">
        <img
          src={
            require("../../../../../assets/images/sslo/sslo-logo(k).svg")
              .default
          }
          alt="sslo-logo"
        />
        <h2>공지사항</h2>
        <b>Notice</b>
      </section>
      {/* <!-- 메뉴바 --> */}
      <div className="lnb">
        <ul>
          <li>
            <a href="help/notice">공지사항</a>
          </li>
          <li>
            <a href="/sslo/help/qna">1:1 문의하기</a>
          </li>
          <li>
            <a href="/sslo/help/inquiry">제휴문의</a>
          </li>
          <li>
            <a href="/sslo/help/faq">자주하는 질문</a>
          </li>
        </ul>
        <div className="container">
          <div className="now">
            <div className="now-bar" />
          </div>
        </div>
      </div>
      <section className="sec_contact_detail sub-section">
        <table>
          {notice && (
            <tbody>
              <tr>
                <th>유형</th>
                <td>{notice.notice_type === "work" ? "작업 안내" : "서비스 안내"}</td>

                <th>등록일</th>
                <td>{notice ? notice.notice_date : ""}</td>
              </tr>
              <tr>
                <th>제목</th>
                <td>{notice ? notice.notice_title : ""}</td>
              </tr>
              <tr>
                <th>내용</th>
                <td>{notice ? notice.notice_contents : ""}</td>
              </tr>
            </tbody>
          )}
        </table>
        <div className="button-box">
          <button
            className="btn-list"
            type="button"
            onClick={() => navigate(-1)}
          >
            목록
          </button>
        </div>
      </section>
    </main>
  );
};

export default NoticeDetailPresenter;
