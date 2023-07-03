import React from "react";
import "../../../../css/sslo/sslo_common.scoped.css";
import "../../../../css/sslo/support/notice.scoped.css";
import { INotice } from "../../../../api/helpApi";
import { useNavigate } from "react-router-dom";

export interface INoticePresenter {
  pagerNum: number;
  notices: INotice[] | undefined;
  handleTab: (tab: string) => void;
  setSearchTxt: (e: any) => void;
  handleSearch: () => void;
  _setPagerCnt: (index: number) => void;
  handlePrevPager: () => void;
  handleNextPager: () => void;
}

const SsloNoticePresenter: React.FC<INoticePresenter> = ({
  notices,
  pagerNum,
  handleTab,
  setSearchTxt,
  handleSearch,
  _setPagerCnt,
  handlePrevPager,
  handleNextPager,
}) => {
  const navigate = useNavigate();
  const setPager = () => {
    const arr = [];
    for (let i = 1; i <= pagerNum; i++) {
      arr.push(
        <button
          key={i}
          id={"pagenum" + i}
          className={"page_num"}
          onClick={() => _setPagerCnt(i)}
        >
          {i}
        </button>
      );
    }
    return arr;
  };
  return (
    <main id="main">
      <section className="intro-type2">
        <img
          src={
            require("../../../../assets/images/sslo/sslo-logo(k).svg").default
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
            <a href="qna">1:1 문의하기</a>
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
      <section className="customer1 sub-section">
        <div className="table-bar">
          <div className="category">
            <button
              id="all"
              className="notice-btn"
              onClick={() => handleTab("all")}
            >
              전체
            </button>
            <button
              id="service"
              className="notice-btn"
              onClick={() => handleTab("service")}
            >
              서비스 안내
            </button>
            <button
              id="work"
              className="notice-btn"
              onClick={() => handleTab("work")}
            >
              작업 안내
            </button>
          </div>
          <div className="search">
            <input
              type="text"
              className="search"
              onChange={setSearchTxt}
              onKeyDown={(e) => {
                e.key === "Enter" ? handleSearch() : "";
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
            {notices.map((item, index) => {
              return (
                <tr key={index}>
                  <td className="tag">
                    {item.notice_type === "work" ? "작업 안내" : "서비스 안내"}
                  </td>
                  <td
                    className="title"
                    onClick={() => navigate("./detail/" + item.notice_id)}
                  >
                    {item.notice_title}
                  </td>
                  <td className="date">{item.notice_date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pager">
          {Math.floor(pagerNum) === 1  ? (
            ""
          ) : (
            <button className="left" onClick={handlePrevPager}>
              <img
                src={require("../../../../assets/images/sslo/button-pagerleft.png")}
                alt=""
              />
            </button>
          )}
          {setPager()}
          {Math.floor(pagerNum) === 1 ? (
            ""
          ) : (
            <button className="right" onClick={handleNextPager}>
              <img
                src={require("../../../../assets/images/sslo/button-pagerright.png")}
                alt=""
              />
            </button>
          )}
        </div>
      </section>
    </main>
  );
};

export default SsloNoticePresenter;
