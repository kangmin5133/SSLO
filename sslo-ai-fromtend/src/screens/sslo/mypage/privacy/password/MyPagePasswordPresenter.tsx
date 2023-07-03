import { useNavigate} from "react-router-dom";
import "../../../../../css/sslo/sslo_common.scoped.css";
import "../../../../../css/sslo/mypage/mypage_privacy.scoped.css";

export interface IPrivacyPasswordPresenter {
  handleSave: (e: any) => Promise<void>;
  onChangeContent: (e: any) => void;
}

const MyPagePasswordPresenter: React.FC<IPrivacyPasswordPresenter> = ({
  handleSave,
  onChangeContent,
}) => {
  const navigate = useNavigate();
  return (
    <main id="main">
      <section className="intro-type2">
        <img
          src={require("../../../../../assets/images/sslo/sslo-logo(k).svg").default}
          alt="sslo-logo"
        />
        <h2>비밀번호 변경</h2>
        <b>Password</b>
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
                <th>현재 비밀번호</th>
                <td><input type="password" name="oldPwd" placeholder="현재 비밀번호" onChange={onChangeContent} /></td>
              </tr>
              <tr>
                <th>새 비밀번호</th>
                <td><input type="password" name="newPwd" placeholder="새 비밀번호" onChange={onChangeContent} /></td>
              </tr>
              <tr>
                <th>새 비밀번호 확인</th>
                <td><input type="password" name="newPwdConfirm" placeholder="새 비밀번호 확인" onChange={onChangeContent} /></td>
              </tr>
          </tbody>
        </table>
        <div className="button-box">
          <button className="btn-save" type="button" onClick={handleSave}>저장</button>
          <button className="btn-cancle" type="button" onClick={() => navigate(-1)}>취소</button>
        </div>
      </section>
    </main>
  );
}

export default MyPagePasswordPresenter;