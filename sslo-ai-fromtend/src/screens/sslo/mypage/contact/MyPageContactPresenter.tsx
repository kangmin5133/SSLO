import React from "react";
import "../../../../css/sslo/sslo_common.scoped.css";
import "../../../../css/sslo/support/notice.scoped.css";
import { IContactByTag } from "../../../../components/sslo/ContactData";
import { useNavigate} from "react-router-dom";
import { getFormattedDate } from "../../../../utils";

export interface IContactPresenter {
  contacts: IContactByTag[] | undefined;
  setTab: (tab: string) => void;
  setSearchTxt: (e: any) => void;
  handleSearch: (e: any) => void;
  pagerNum: number;
  _setPagerCnt: (index: number) => void;
  handlePrevPage: () => void;
  handleNextPage: () => void;
}

const MyPageContactPresenter: React.FC<IContactPresenter> = ({ 
  contacts,
  setTab, 
  setSearchTxt,
  handleSearch,
  pagerNum,
  _setPagerCnt,
  handlePrevPage,
  handleNextPage,
}) => {
  const navigate = useNavigate();
  const setPager = () => {
    const arr = [];
    for(let i=1; i <= pagerNum; i++) {
      arr.push(<button key={i} id={"pagenum"+i} className={"page_num"}onClick={() => _setPagerCnt(i)}>{i}</button>);
    }
    return arr;
  }
  return (
    <main id="main">
      <section className="intro-type2">
        <img
          src={require("../../../../assets/images/sslo/sslo-logo(k).svg").default}
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
      <section className="customer1 sub-section">
        <div className="table-bar">
          <div className="category">
            <button id="btn_all" className="btn-contact" onClick={() => setTab("all")}>전체</button>
            <button id="btn_inquiry" className="btn-contact" onClick={() => setTab("inquiry")}>1:1 문의</button>
            <button id="btn_partnership" className="btn-contact" onClick={() => setTab("partnership")}>제휴문의</button>
          </div>
          <div className="search">
            <input 
              id="txt_search" 
              type="text" 
              className="search" 
              onChange={setSearchTxt}
              onKeyDown={(e) => {
                e.key === "Enter" ? handleSearch(e) : "";
              }}
            />
            <button className="search-img" onClick={handleSearch}>
              <img
                src={require("../../../../assets/images/sslo/search.png")}
                alt=""
              />
            </button>
          </div>
        </div>
        <table>
          <tbody>
          {contacts.map((item, index) => {
            return (
              <tr
              key={index}>
                <td className="tag" style={{height: "26px", lineHeight: "30px"}}>{item.tag === "inquiry"?"1:1 문의":"제휴문의"}</td>
                <td className="title" onClick={() => navigate("./detail/"+item.contact.id, {state: { item: item }})}>{item.contact.title}</td>
                <td className="date">{getFormattedDate(item.contact.date)}</td>
                <td className="date">{item.tag === "inquiry"? item.contact.status === "true"? "처리완료" : "답변대기" : ""}</td>
              </tr>
            );
          })}
          </tbody>
        </table>
        <div className="pager">
          <button className="left" onClick={handlePrevPage}>
            <img
              src={require("../../../../assets/images/sslo/button-pagerleft.png")}
              alt=""
            />
          </button>
          {setPager()}
          <button className="right" onClick={handleNextPage}>
            <img
              src={require("../../../../assets/images/sslo/button-pagerright.png")}
              alt=""
            />
          </button>
        </div>
      </section>
    </main>
  );
}

export default MyPageContactPresenter;