import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../../../../hooks";
import MyPageContactDetailPresenter from "./MyPageContactDetailPresenter";
import { IContactByTag } from "../../../../../components/sslo/ContactData";
import { useLocation } from "react-router-dom";

const MyPageContactDetailContainer = () => {
  const loggedInUser = useAppSelector((state) => state.userReducer);
  const location = useLocation();
  const navigate = useNavigate();

  const [contactInfo, setContactInfo] = useState<IContactByTag>();

  const [contactType, setContactType] = useState<string>("");

  // ! contact ID를 URL로부터 Get
  const { cId } = useParams();
  useEffect(() => {
    if (!loggedInUser || !loggedInUser.isLoggedIn) {
      navigate("/login");
      return;
    }
    setUnderLine();
  }, []);

  const setUnderLine = () => {
    const tab = document.getElementById("tab_contact");
    const line = document.getElementById("line_now");
    line.style.left = tab.offsetLeft + "px";
  };

  useEffect(() => {
    console.log(cId);
    if (cId && location.state) getContactInfo();
  }, [cId]);

  const getContactInfo = () => {
    const c = location.state.item;
    console.log(c);
    let type = "";
    if (c.tag === "inquiry") {
      switch (c.contact.type) {
        case "website":
          type = "사이트 문의";
          break;
        case "account":
          type = "계정 문의";
          break;
        case "solution":
          type = "솔루션 문의";
          break;
        default:
          type = "기타 문의";
          break;
      }
      setContactType(type);
    } else {
      switch (c.contact.type) {
        case "technology":
          type = "기술 제휴";
          break;
        case "sales":
          type = "판매 제휴";
          break;
        case "advertisement":
          type = "광고 제휴";
          break;
        case "buisness":
          type = "사업 제휴";
          break;
        default:
          type = "기타 제휴";
          break;
      }
      setContactType(type);
    }
    setContactInfo(c);
  };

  const handleModify = (e: any) => {};

  return (
    <MyPageContactDetailPresenter
      contactInfo={contactInfo}
      contactType={contactType}
      handleModify={handleModify}
    />
  );
};

export default MyPageContactDetailContainer;
