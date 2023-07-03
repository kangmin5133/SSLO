import { IContactByTag } from "../../../../../components/sslo/ContactData";
import "../../../../../css/sslo/sslo_common.scoped.css";
import "../../../../../css/sslo/mypage/mypage_contact_detail.scoped.css";
import { useNavigate} from "react-router-dom";
import { getFormattedDate } from "../../../../../utils";

export interface IContactDetailPresenter {
  contactInfo: IContactByTag;
  contactType: string;
  handleModify: (e: any) => void;
}

const MyPageContactDetailPresenter: React.FC<IContactDetailPresenter> = ({
  contactInfo,
  contactType,
  handleModify,
}) => {
  const navigate = useNavigate();
  return (
    <main id="main">
      <section className="intro-type2">
        <img
          src={require("../../../../../assets/images/sslo/sslo-logo(k).svg").default}
          alt="sslo-logo"
        />
        <h2>문의내역</h2>
        <b>Contact</b>
      </section>
      {/* <!-- 메뉴바 --> */}
      <div className="lnb">
        <ul>
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
      <section className="sec_contact_detail sub-section">
        <table>
          {contactInfo && contactInfo.tag === "inquiry" && (
            <tbody>
                <tr>
                  <th>문의 유형</th>
                  <td>{contactType}</td>
                </tr>
                <tr>
                  <th>등록자</th>
                  <td>{contactInfo.contact.userName}</td>
                  <th>등록일</th>
                  <td>{getFormattedDate(contactInfo.contact.date)}</td>
                </tr>
                <tr>
                  <th>첨부파일</th>
                  <td>{"없음"}</td>
                </tr>
                <tr>
                  <th>문의 제목</th>
                  <td>{contactInfo.contact.title}</td>
                </tr>
                <tr>
                  <th>문의 내용</th>
                  <td>{contactInfo.contact.content}</td>
                </tr>
            </tbody>
          )}
          {contactInfo && contactInfo.tag === "partnership" && (
            <tbody>
                <tr>
                  <th>문의 유형</th>
                  <td>{contactType}</td>
                </tr>
                <tr>
                  <th>등록자</th>
                  <td>{contactInfo.contact.userName}</td>
                  <th>등록일</th>
                  <td>{getFormattedDate(contactInfo.contact.date)}</td>
                </tr>
                <tr>
                  <th>첨부파일</th>
                  <td>{contactInfo.contact.file?contactInfo.contact.file:"없음"}</td>
                </tr>
                <tr>
                  <th>문의 제목</th>
                  <td>{contactInfo.contact.title}</td>
                </tr>
                <tr>
                  <th>문의 내용</th>
                  <td>{contactInfo.contact.content}</td>
                </tr>
            </tbody>
          )}
        </table>
        <div className="button-box">
          {contactInfo && contactInfo.tag === "inquiry" && contactInfo.contact.status !== "true" && (
            <button 
              className="btn-modify" 
              type="button" 
              style={{ cursor:"pointer" }}
              onClick={() => navigate("./modify", {state: {contact: contactInfo.contact}})}
            >
              수정
            </button>
          )}
          <button 
            className="btn-list" 
            type="button" 
            style={{ cursor:"pointer" }} 
            onClick={() => navigate("/sslo/mypage/contact")}
          >
            목록
          </button>
        </div>
      </section>
    </main>
  );
}

export default MyPageContactDetailPresenter;