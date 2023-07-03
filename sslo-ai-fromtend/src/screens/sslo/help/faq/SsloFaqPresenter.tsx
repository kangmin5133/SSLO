import React from "react";
import "../../../../css/sslo/sslo_common.scoped.css";
import "../../../../css/sslo/support/faq.scoped.css";
import { IFaq } from "./SsloFaqContainer";

export interface IHelpPresenter {
  faqs: IFaq[] | undefined;
  pagerNum: number;
  handleTab: (tab: string) => void;
  setSearchText: (e: any) => void;
  handleSearch: () => void;
  toggleFaqOpen: (item: any) => void;
  _setPagerCnt: (index: number) => void;
  handlePrevPager: () => void;
  handleNextPager: () => void;
}

const SsloFaqPresenter: React.FC<IHelpPresenter> = ({
  faqs,
  pagerNum,
  handleTab,
  setSearchText,
  handleSearch,
  toggleFaqOpen,
  _setPagerCnt,
  handlePrevPager,
  handleNextPager,
}) => {
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
        <h2>자주하는질문</h2>
        <b>FAQ</b>
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
            <a href="inquiry">제휴문의</a>
          </li>
          <li>
            <a href="">자주하는 질문</a>
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
              className="fnq-btn"
              onClick={() => handleTab("all")}
            >
              전체
            </button>
            <button
              id="member"
              className="fnq-btn"
              onClick={() => handleTab("member")}
            >
              회원
            </button>
            <button
              id="service"
              className="fnq-btn"
              onClick={() => handleTab("service")}
            >
              서비스
            </button>
            <button
              id="price"
              className="fnq-btn"
              onClick={() => handleTab("price")}
            >
              요금
            </button>
            <button
              id="solution"
              className="fnq-btn"
              onClick={() => handleTab("solution")}
            >
              솔루션
            </button>
            <button
              id="error"
              className="fnq-btn"
              onClick={() => handleTab("error")}
            >
              오류
            </button>
            <button
              id="etc"
              className="fnq-btn"
              onClick={() => handleTab("etc")}
            >
              기타
            </button>
          </div>
          <div className="search">
            <input
              type="text"
              className="search"
              onKeyDown={(e) => {
                e.key === "Enter" ? handleSearch() : "";
              }}
              onChange={setSearchText}
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
          {faqs.map((item, index) => {
            return (
              <tbody key={index}>
                <tr>
                  <td className="tag">
                    {item.if_faq_type === "member"
                      ? "회원"
                      : item.if_faq_type === "service"
                      ? "서비스"
                      : item.if_faq_type === "price"
                      ? "요금"
                      : item.if_faq_type === "solution"
                      ? "솔루션"
                      : item.if_faq_type === "error"
                      ? "오류"
                      : "기타"}
                  </td>
                  <td
                    className="title"
                    onClick={() => {
                      toggleFaqOpen(item);
                    }}
                  >
                    Q. {item.notice_title}
                  </td>
                  <td className="date">{item.notice_date}</td>
                </tr>
                <tr>
                  <td
                    id={"desc_" + index}
                    className="desc"
                    style={{ display: "none" }}
                  >
                    A. {item.notice_contents}
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
        <div className="pager">
          {Math.floor(pagerNum) === 1 ? (
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

export default SsloFaqPresenter;
