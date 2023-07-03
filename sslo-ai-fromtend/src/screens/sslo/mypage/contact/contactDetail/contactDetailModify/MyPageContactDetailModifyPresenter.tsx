import { IContact } from "../../../../../../components/sslo/ContactData";
import "../../../../../../css/sslo/sslo_common.scoped.css";
import "../../../../../../css/sslo/mypage/mypage_contact_detail.scoped.css";
import { useNavigate} from "react-router-dom";

export interface IContactDetailPresenter {
  contact: IContact;
  handleModify: (e: any) => void;
  onChangeContent: (e: any) => void;
}

const MyPageContactDetailModifyPresenter: React.FC<IContactDetailPresenter> = ({
  contact,
  handleModify,
  onChangeContent,
}) => {
  const navigate = useNavigate();
  return (
    <main id="main">
      <section className="intro-type2">
        <img
          src={require("../../../../../../assets/images/sslo/sslo-logo(k).svg").default}
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
      <section className="sec_contact_detail_modify sub-section">
        <table>
          <tbody>
              <tr>
                <th>*문의 유형</th>
                <td>
                <select
                  defaultValue={"qna-type"}
                  name="type"
                  onChange={onChangeContent}
                  value={contact?contact.type:"qna-type"}
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
                    id={"title"} 
                    name={"title"} 
                    placeholder={contact?contact.title:"문의 제목을 입력해주세요."} 
                    onChange={onChangeContent} />
                </td>
              </tr>
              <tr>
                <th>*이름</th>
                <td>
                  <input
                    id="name"
                    placeholder={contact?contact.userName:"이름을 입력해주세요."}
                    name="name"
                    onChange={onChangeContent}
                  />
                </td>
              </tr>
              <tr>
                <th>*전화번호</th>
                <td>
                  <input
                    id="phone"
                    placeholder={contact?contact.phone:"전화번호를 입력해주세요.( ‘-’제외 )"}
                    name="phone"
                    onChange={onChangeContent}
                  />
                </td>
              </tr>
              <tr>
                <th>*이메일</th>
                <td>
                  <input
                    id="email"
                    placeholder={contact?contact.email:"이메일을 정확히 입력해주세요."}
                    name="email"
                    onChange={onChangeContent}
                  />
                </td>
              </tr>
              
              <tr>
                <th>*문의 내용</th>
                <td>
                  <textarea
                    className="qna-text"
                    placeholder={contact?contact.content:"문의내용을 상세히 입력해주세요."}
                    name="content"
                    onChange={onChangeContent}
                  />
                </td>
              </tr>
          </tbody>
        </table>
        <div className="button-box" style={{ width: "calc(100% - 20px)", paddingRight: "20Px" }}>
          <button className="btn-modify" type="button" onClick={handleModify}>수정</button>
          <button className="btn-list" type="button" onClick={() => navigate(-2)}>목록</button>
        </div>
      </section>
    </main>
  );
}

export default MyPageContactDetailModifyPresenter;