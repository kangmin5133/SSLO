import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import helpApi, { INotice } from "../../../../api/helpApi";
import { getFormattedDate } from "../../../../utils";
import SsloFaqPresenter from "./SsloFaqPresenter";

export interface IFaq {
  notice_id?: number;
  notice_type?: string;
  if_faq_type?: string; // faq 세부카테고리
  notice_title: string;
  notice_contents?: string;
  notice_date: string;
  isOpen?: boolean;
}

const SsloFaqContainer = () => {
  // ! 전체 faq list
  const [allFaq, setAllFaq] = useState<IFaq[]>([]);
  // ! faq list
  const [faqs, setFaqs] = useState<IFaq[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [filteredList, setFilteredList] = useState<IFaq[]>([]);
  const [searchedList, setSearchedList] = useState<IFaq[]>([]);
  const [pagerList, setPagerList] = useState<IFaq[]>([]);
  const [searchedText, setSearchedText] = useState<string>("");
  // ! page total no
  const [pagerNum, setPagerNum] = useState<number>(1);
  // ! page current no
  const [pagerCnt, setPagerCnt] = useState<number>(1);
  const handleSearchFaq = async () => {
    const res = await helpApi.getSearchNotice();
    if (res && res.status === 200) {
      let faqList: INotice[] = [];
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].notice_type === "faq") {
          const f = {
            notice_id: res.data[i].notice_id,
            notice_type: res.data[i].notice_type,
            if_faq_type: res.data[i].if_faq_type,
            notice_title: res.data[i].notice_title, // faq질문
            notice_contents: res.data[i].notice_contents, // faq답변
            notice_date: getFormattedDate(res.data[i].created),
          };
          faqList.push(f);
        }
      }
      setAllFaq(faqList);
    }
  };

  useEffect(() => {
    handleSearchFaq();
  }, []);

  useEffect(() => {
    setFilteredList(allFaq);
  }, [allFaq]);

  useEffect(() => {
    if (filteredList) setSearchedList(filteredList);
  }, [filteredList]);

  // ! title 클릭 시 답변 열림
  const toggleFaqOpen = (item: any) => {
    for (let i = 0; i < faqs.length; i++) {
      if (faqs[i] === item) {
        faqs[i].isOpen = !faqs[i].isOpen;
        if (faqs[i].isOpen) {
          document.getElementById("desc_" + i).style.display = "block";
        } else {
          document.getElementById("desc_" + i).style.display = "none";
        }
      } else {
        faqs[i].isOpen = false;
        document.getElementById("desc_" + i).style.display = "none";
      }
    }
    return;
  };

  useEffect(() => {
    if (filteredList) setSearchedList(filteredList);
  }, [filteredList]);

  const handleTab = (tab: string) => {
    const selectedBtn = document.getElementById(tab);
    const btnList = document.getElementsByClassName("fnq-btn");
    for (let i = 0; i < btnList.length; i++) {
      if (btnList[i] === selectedBtn) {
        selectedBtn.style.background = "#1b5994";
        selectedBtn.style.color = "#fff";
      } else {
        (btnList[i] as HTMLElement).style.color = "#1b5994";
        (btnList[i] as HTMLElement).style.background = "#fff";
      }
    }
    setSelectedTab(tab);
  };

  useEffect(() => {
    switch (selectedTab) {
      case "all":
        setFilteredList(
          allFaq.filter((element) =>
            searchedText !== ""
              ? element.notice_title.includes(searchedText)
              : element
          )
        );
        break;
      case "member":
        setFilteredList(
          allFaq.filter((element) => {
            if (searchedText !== "") {
              if (
                element.if_faq_type === "member" &&
                element.notice_title.includes(searchedText)
              ) {
                return setSearchedList;
              } else if (!element.notice_title.includes(searchedText))
                return setSearchedList([]);
            } else {
              return element.if_faq_type === "member";
            }
          })
        );
        break;
      case "service":
        setFilteredList(
          allFaq.filter((element) => {
            if (searchedText !== "") {
              if (
                element.if_faq_type === "service" &&
                element.notice_title.includes(searchedText)
              ) {
                return setSearchedList;
              } else if (!element.notice_title.includes(searchedText))
                return setSearchedList([]);
            } else {
              return element.if_faq_type === "service";
            }
          })
        );
        break;
      case "price":
        setFilteredList(
          allFaq.filter((element) => {
            if (searchedText !== "") {
              if (
                element.if_faq_type === "price" &&
                element.notice_title.includes(searchedText)
              ) {
                return setSearchedList;
              } else if (!element.notice_title.includes(searchedText))
                return setSearchedList([]);
            } else {
              return element.if_faq_type === "price";
            }
          })
        );
        break;
      case "solution":
        setFilteredList(
          allFaq.filter((element) => {
            if (searchedText !== "") {
              if (
                element.if_faq_type === "solution" &&
                element.notice_title.includes(searchedText)
              ) {
                return setSearchedList;
              } else if (!element.notice_title.includes(searchedText))
                return setSearchedList([]);
            } else {
              return element.if_faq_type === "solution";
            }
          })
        );
        break;
      case "error":
        setFilteredList(
          allFaq.filter((element) => {
            if (searchedText !== "") {
              if (
                element.if_faq_type === "error" &&
                element.notice_title.includes(searchedText)
              ) {
                return setSearchedList;
              } else if (!element.notice_title.includes(searchedText))
                return setSearchedList([]);
            } else {
              return element.if_faq_type === "error";
            }
          })
        );
        break;
      case "etc":
        setFilteredList(
          allFaq.filter((element) => {
            if (searchedText !== "") {
              if (
                element.if_faq_type === "etc" &&
                element.notice_title.includes(searchedText)
              ) {
                return setSearchedList;
              } else if (!element.notice_title.includes(searchedText))
                return setSearchedList([]);
            } else {
              return element.if_faq_type === "etc";
            }
          })
        );
        break;
    }
  }, [selectedTab]);

  const setSearchText = (e: any) => {
    const txt = e.target.value;
    if (!txt || txt === "") {
      let tabTxt = "";
      if (selectedTab === "member") tabTxt = "member";
      if (selectedTab === "service") tabTxt = "service";
      if (selectedTab === "price") tabTxt = "price";
      if (selectedTab === "solution") tabTxt = "solution";
      if (selectedTab === "error") tabTxt = "error";
      if (selectedTab === "etc") tabTxt = "etc";
      if (tabTxt === "") {
        setFilteredList(allFaq);
      } else {
        setFilteredList(
          faqs.filter((element) => element.if_faq_type === tabTxt)
        );
      }
    }
    setSearchedText(txt);
  };

  // ! 검색어 입력
  const handleSearch = () => {
    setSearchedList(
      filteredList.filter((element) =>
        element.notice_title.includes(searchedText)
      )
    );
  };

  useEffect(() => {
    if (searchedList) {
      const dataArr = [];
      searchedList.map((element, index) => {
        dataArr.push({
          tag: element.if_faq_type,
          title: element.notice_title,
          date: element.notice_date,
          desc: element.notice_contents,
          isOpen: false,
        });
      });
      setFaqs([...dataArr]);
    }
    handleSearch;
  }, [searchedList]);
  console.log(faqs);

  // ! pagination
  useEffect(() => {
    if (searchedList && searchedList.length > 0) {
      const num = (searchedList.length - 1) / 10;
      setPagerNum(num + 1);
      setPagerList(
        searchedList.filter((element, index) => {
          return index >= (pagerCnt - 1) * 10 && index < pagerCnt * 10;
        })
      );
    }
  }, [searchedList]);

  const _setPagerCnt = (index: number) => {
    setPagerCnt(index);
  };

  const handlePrevPager = () => {
    if (pagerCnt <= 1) {
      toast.error("첫번째 페이지입니다.");
      return;
    }
    setPagerCnt(pagerCnt - 1);
  };
  const handleNextPager = () => {
    if (pagerCnt >= Math.floor(pagerNum)) {
      toast.error("마지막 페이지입니다.");
      return;
    }
    setPagerCnt(pagerCnt - 1);
  };

  useEffect(() => {
    const selectedPager = document.getElementById("pagenum" + pagerCnt);
    selectedPager.style.background = "#1B5994";
    selectedPager.style.color = "#fff";
    const pageNums = document.getElementsByClassName("page_num");
    for (let i = 0; i < pageNums.length; i++) {
      if (pageNums[i] !== selectedPager) {
        (pageNums[i] as HTMLElement).style.background = "#fff";
        (pageNums[i] as HTMLElement).style.color = "#1B5994";
      }
    }
    setPagerList(
      searchedList.filter((element, index) => {
        return index >= (pagerCnt - 1) * 10 && index < pagerCnt * 10;
      })
    );
  }, [pagerCnt]);

  useEffect(() => {
    if (pagerList && pagerList.length > 0) {
      setFaqs(pagerList);
    }
  }, [pagerList]);

  return (
    <SsloFaqPresenter
      faqs={faqs}
      pagerNum={pagerNum}
      handleTab={handleTab}
      setSearchText={setSearchText}
      handleSearch={handleSearch}
      toggleFaqOpen={toggleFaqOpen}
      _setPagerCnt={_setPagerCnt}
      handlePrevPager={handlePrevPager}
      handleNextPager={handleNextPager}
    />
  );
};

export default SsloFaqContainer;
