import MyPageContactPresenter from "./MyPageContactPresenter";
import { useState, useEffect } from "react";
import { IContactByTag } from "../../../../components/sslo/ContactData";
import { useAppSelector } from "../../../../hooks";
import helpApi from "../../../../api/helpApi";
import { useNavigate } from "react-router-dom";

const MyPageContactContainer = () => {
  const loggedInUser = useAppSelector((state) => state.userReducer);
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<IContactByTag[]>([]);
  // Todo: 서버 연결시 Api로 contactDataList 호출 구현 필요
  const [contactDataList, setContactDataList] = useState<IContactByTag[]>();
  const [filteredList, setFilteredList] = useState<IContactByTag[]>([]);
  const [searchedList, setSearchedList] = useState<IContactByTag[]>([]);
  const [pagerList, setPagerList] = useState<IContactByTag[]>([]);
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchedText, setSearchedText] = useState<string>("");
  const [pagerNum, setPagerNum] = useState<number>(1);
  const [pagerCnt, setPagerCnt] = useState<number>(1);

  useEffect(() => {
    if(!loggedInUser || !loggedInUser.isLoggedIn) {
      navigate("/login");
      return;
    }
    getContactList();
    setUnderLine();
  }, []);

  const getContactList = async () => {
    /* const inquiryList = (await getInquiryList()).sort((a, b) => {
      if(a.contact.date > b.contact.date) return 1;
      if(a.contact.date < b.contact.date) return -1;
      return 0;
    });
    const partnershipList = (await getPartnershipList()).sort((a, b) => {
      if(a.contact.date > b.contact.date) return 1;
      if(a.contact.date < b.contact.date) return -1;
      return 0;
    }); */
    // const userContactList: IContactByTag[] = [...await getInquiryList(), ...await getPartnershipList()];
    const userContactList: IContactByTag[] = [...await getInquiryList(), ...await getPartnershipList()];
    console.log("contact: ", userContactList);
    setContactDataList(userContactList);
    /* setContactDataList(userContactList.sort((a, b) => {
      if(a.contact.date > b.contact.date) return 1;
      if(a.contact.date < b.contact.date) return -1;
      return 0;
    })); */
  };

  useEffect(() => {
    console.log("sort: ", contactDataList);

    setFilteredList(contactDataList);
  }, [contactDataList]);

  const getInquiryList = async () => {
    const result: IContactByTag[] = [];
    const res = await helpApi.searchQnaByUser({user_id: loggedInUser.id});
    if(res && res.status === 200) {
      res.data.forEach((element) => {
        result.push({
          tag: "inquiry",
          contact: {
            id: element.inquiry_id,
            type: element.inquiry_type,
            title: element.inquiry_title,
            date: element.created,
            status: element.inquiry_status,
            userName: element.inquiry_user_display_name,
            phone: element.inquiry_user_number,
            email: element.inquiry_user_email,
            content: element.inquiry_contents,
            userId: element.user_id,
          },
        });
      })
    }
    return result;
  };
  const getPartnershipList = async () => {
    const result: IContactByTag[] = [];
    const res = await helpApi.searchPartnershipByUser({user_id: loggedInUser.id});
    if(res && res.status === 200) {
      res.data.forEach((element) => {
        result.push({
          tag: "partnership",
          contact: {
            id: element.partnership_inquiry_id,
            type: element.partnership_inquiry_type,
            title: element.partnership_inquiry_title,
            date: element.created,
            userName: element.partnership_inquiry_creator_name,
            phone: element.partnership_inquiry_company_number,
            email: element.partnership_inquiry_company_email,
            content: element.partnership_inquiry_contents,
            userId: element.user_id,
            file: element.partnership_inquiry_proposal,
            companyName: element.partnership_inquiry_company_name,
            classification: element.partnership_inquiry_company_classification,
            url: element.partnership_inquiry_company_website_url,
            introduction: element.partnership_inquiry_company_introduction,
          },
        });
      })
    }
    return result;
  };

  useEffect(() => {
    if(filteredList)
      setSearchedList(filteredList);
  }, [filteredList]);

  const setUnderLine = () => {
    const tab = document.getElementById("tab_contact");
    const line = document.getElementById("line_now");
    line.style.left = tab.offsetLeft + "px";
  };

  const setTab = (tab: string) => {
    const selectedBtn = document.getElementById("btn_" + tab);
    const btnList = document.getElementsByClassName("btn-contact");
    for(let i=0; i < btnList.length; i++) {
      if(btnList[i] === selectedBtn) {
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
    setListByTab(selectedTab);
  }, [selectedTab]);

  const setListByTab = (tab: string) => {
    if(!contactDataList) return;
    const userContactList = contactDataList.filter(element => element.contact.userId && element.contact.userId === loggedInUser.id);
      switch(tab) {
        case "all":
          setFilteredList(
            userContactList.filter((element) =>
              searchedText !== "" ? element.contact.title.includes(searchedText) : element
            )
          );
          break;
        case "inquiry":
          setFilteredList(userContactList.filter(element => 
            (searchedText !== "" ? element.contact.title.includes(searchedText) : true)
            && element.tag === tab
            ));
          break;
        case "partnership":
          setFilteredList(userContactList.filter(element =>
            (searchedText !== "" ? element.contact.title.includes(searchedText) : true)
            && element.tag === tab
            ));
          break;
        default:
          setFilteredList(userContactList.filter(element =>
            (searchedText !== "" ? element.contact.title.includes(searchedText) : true)
            && element.tag === tab
            ));
          break;
      }
  }

  const [isResetTxt, setIsResetTxt] = useState(true);

  const setSearchTxt = (e: any) => {
    const txt = e.target.value;
    if(!txt || txt === "") {
      const userContactList = contactDataList.filter(element => element.contact.userId && element.contact.userId === loggedInUser.id);
      if (selectedTab === "all") {
        setFilteredList(userContactList);
      } else {
        setFilteredList(userContactList.filter((element) => 
          element.tag === selectedTab
        ));
      }
      setIsResetTxt(true);
    }
    setSearchedText(txt);
    setIsResetTxt(false);
  };

  const handleSearch = (e: any) => {
    if(isResetTxt)
      setSearchedList(filteredList.filter(element => element.contact.title.includes(searchedText)));
    else {
      setListByTab(selectedTab);
    }
  };

  useEffect(() => {
    if(searchedList && searchedList.length > 0) {
      const num = (searchedList.length - 1) / 10;
      setPagerNum(num + 1);
      setPagerList(searchedList.sort((a, b) => { return b.contact.date - a.contact.date }).filter((element, index) => { return index >= ((pagerCnt - 1) * 10) && index < (pagerCnt * 10) }));
    }
  }, [searchedList]);

  const _setPagerCnt = (index: number) => {
    setPagerCnt(index);
  };

  const handlePrevPage = () => {
    if(pagerCnt > 1)
      _setPagerCnt(pagerCnt - 1);
  };

  const handleNextPage = () => {
    if(pagerCnt < pagerNum)
      _setPagerCnt(pagerCnt + 1);
  };

  useEffect(() => {
    const selectedPager = document.getElementById("pagenum"+pagerCnt);
    selectedPager.style.background = "#1B5994";
    selectedPager.style.color = "#fff";
    const pageNums = document.getElementsByClassName("page_num");
    for(let i=0; i<pageNums.length; i++) {
      if(pageNums[i] !== selectedPager) {
        (pageNums[i] as HTMLElement).style.background = "#fff";
        (pageNums[i] as HTMLElement).style.color = "#1B5994";
      }
    }
    setPagerList(searchedList.sort((a, b) => { return b.contact.date - a.contact.date }).filter((element, index) => { return index >= ((pagerCnt - 1) * 10) && index < (pagerCnt * 10) }));
  }, [pagerCnt]);

  useEffect(() => {
    if(pagerList && pagerList.length > 0) {
      // setContacts(pagerList.sort((a, b) => { return b.contact.date - a.contact.date }));
      setContacts(pagerList);
    }
  }, [pagerList]);

  return (
    <MyPageContactPresenter 
      contacts={contacts}
      setTab={setTab}
      setSearchTxt={setSearchTxt}
      handleSearch={handleSearch}
      pagerNum={pagerNum}
      _setPagerCnt={_setPagerCnt}
      handlePrevPage={handlePrevPage}
      handleNextPage={handleNextPage}
    />
  );
}

export default MyPageContactContainer;