import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import helpApi, { INotice } from "../../../../api/helpApi";
import { getFormattedDate } from "../../../../utils";
import SsloNoticePresenter from "./SsloNoticePresenter";

const SsloNoticeContainer = () => {
  // ! 전체 notice list
  const [allNotice, setAllNotice] = useState<INotice[]>([]);
  // ! notice list
  const [notices, setNotices] = useState<INotice[]>([]);
  // ! 필터링된 notice list
  const [filteredList, setFilteredList] = useState<INotice[]>([]);
  // ! notice search list
  const [searchedList, setSearchedList] = useState<INotice[]>([]);
  // ! 상단 tab
  const [selectedTab, setSelectedTab] = useState<string>("all");
  // ! 상단 검색어
  const [searchedText, setSearchedText] = useState<string>("");

  const [pagerList, setPagerList] = useState<INotice[]>([]);
  // ! page total no
  const [pagerNum, setPagerNum] = useState<number>(1);
  // ! page current no
  const [pagerCnt, setPagerCnt] = useState<number>(1);

  const handleSearchNotice = async () => {
    const res = await helpApi.getSearchNotice();
    if (res && res.status === 200) {
      let noticeList: INotice[] = [];
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].notice_type !== "faq") {
          const n = {
            notice_id: res.data[i].notice_id,
            notice_type: res.data[i].notice_type,
            notice_title: res.data[i].notice_title,
            notice_date: getFormattedDate(res.data[i].created),
          };
          noticeList.push(n);
        }
      }
      setAllNotice(noticeList);
    }
  };

  useEffect(() => {
    handleSearchNotice();
  }, []);

  useEffect(() => {
    setFilteredList(allNotice);
  }, [allNotice]);

  useEffect(() => {
    if (filteredList) setSearchedList(filteredList);
  }, [filteredList]);

  const handleTab = (tab: string) => {
    const selectedBtn = document.getElementById(tab);
    const btnList = document.getElementsByClassName("notice-btn");
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
          allNotice.filter((element) =>
            searchedText !== ""
              ? element.notice_title.includes(searchedText)
              : element
          )
        );
        break;
      case "service":
        setFilteredList(
          allNotice.filter((element) => {
            if (searchedText !== "") {
              if (
                element.notice_type === "service" &&
                element.notice_title.includes(searchedText)
              ) {
                return setSearchedList;
              } else if (!element.notice_title.includes(searchedText))
                return setSearchedList([]);
            } else {
              return element.notice_type === "service";
            }
          })
        );
        console.log(searchedList);
        break;
      case "work":
        setFilteredList(
          allNotice.filter((element) => {
            if (searchedText !== "") {
              if (
                element.notice_type === "work" &&
                element.notice_title.includes(searchedText)
              ) {
                return setSearchedList;
              } else if (!element.notice_title.includes(searchedText))
                return setSearchedList([]);
            } else {
              return element.notice_type === "work";
            }
          })
        );
        break;
    }
  }, [selectedTab]);

  const setSearchTxt = (e: any) => {
    const txt = e.target.value;
    if (!txt || txt === "") {
      let tabTxt = "";
      if (selectedTab === "service") tabTxt = "service";
      if (selectedTab === "work") tabTxt = "work";
      if (tabTxt === "") {
        setFilteredList(allNotice);
      } else {
        setFilteredList(
          notices.filter((element) => element.notice_type === tabTxt)
        );
      }
    }
    setSearchedText(txt);
  };

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
          type: element.notice_type,
          title: element.notice_title,
          date: element.notice_date,
          isOpen: false,
        });
      });
      setNotices([...dataArr]);
    }
    handleSearch;
  }, [searchedList]);

  useEffect(() => {
    if (searchedList && searchedList.length > 0) {
      const num = (searchedList.length - 1) / 10;
      setPagerNum(num + 1);
      setPagerList(
        // ! pagerCnt가 현재 페이지 번호,index는 게시물 번호로 한페이지당 10개의 게시물 보여줌
        searchedList.filter((element, index) => {
          return index >= (pagerCnt - 1) * 10 && index < pagerCnt * 10;
        })
      );
    }
  }, [searchedList]);

  const _setPagerCnt = (index: number) => {
    // if (pagerCnt <= 0) {
    //   console.log("error");
    //   return;
    // }
    // if (pagerNum < index) {
    //   console.log("error");
    //   return;
    // }
    setPagerCnt(index);
  };

  console.log(pagerCnt);
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
      console.log(pagerList);
      setNotices(pagerList);
    }
  }, [pagerList]);

  const handlePrevPager = () => {
    if (pagerCnt <= 1) {
      toast.error("첫번째 페이지입니다.");
      return;
    }
    setPagerCnt(pagerCnt - 1);
  };

  const handleNextPager = () => {
    console.log(pagerCnt + ", " + pagerNum);
    if (pagerCnt >= Math.floor(pagerNum)) {
      toast.error("마지막 페이지입니다.");
      return;
    }
    setPagerCnt(pagerCnt + 1);
  };

  return (
    <SsloNoticePresenter
      pagerNum={pagerNum}
      notices={notices}
      handleTab={handleTab}
      setSearchTxt={setSearchTxt}
      handleSearch={handleSearch}
      _setPagerCnt={_setPagerCnt}
      handlePrevPager={handlePrevPager}
      handleNextPager={handleNextPager}
    />
  );
};

export default SsloNoticeContainer;
