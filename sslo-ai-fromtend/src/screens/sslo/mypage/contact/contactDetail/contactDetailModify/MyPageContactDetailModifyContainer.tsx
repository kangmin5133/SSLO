import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useAppSelector } from "../../../../../../hooks";
import { toast } from "react-toastify";
import MyPageContactDetailModifyPresenter from "./MyPageContactDetailModifyPresenter";
import { IContact } from '../../../../../../components/sslo/ContactData';
import helpApi from "../../../../../../api/helpApi";

const MyPageContactDetailModifyContainer = () => {
  const loggedInUser = useAppSelector((state) => state.userReducer);
  const location = useLocation();
  const navigate = useNavigate();

  const [contact, setContact] = useState<IContact>();
  const [contactInfo, setContactInfo] = useState<IContact>({
    id: -1,
    type: "",
    title: "",
    date: 0,
    status: "false",
    userName: "",
    phone: "",
    email: "",
    userId: "",
    content: "",
  });
  const [partnershipInfo, setPartnershipInfo] = useState<IContact>({
    id: -1,
    type: "",
    title: "",
    date: 0,
    userName: "",
    phone: "",
    email: "",
    userId: "",
    content: "",
    classification: "",
    companyName: "",
    url: "",
    introduction: "",
  });

  // ! contact ID를 URL로부터 Get
  const { cId } = useParams();
  useEffect(() => {
    if(!loggedInUser || !loggedInUser.isLoggedIn) {
      navigate("/login");
      return;
    }
    console.log(cId);
    setUnderLine();
  }, []);

  const setUnderLine = () => {
    const tab = document.getElementById("tab_contact");
    const line = document.getElementById("line_now");
    line.style.left = tab.offsetLeft + "px";
  };

  useEffect(() => {
    console.log(cId);
    if(cId && location.state)
      getContact();
  }, [cId]);

  const getContact = () => {
    const c =  location.state.contact;
    console.log(c);
    setContact(c);
    setContactInfo(c);
  };

  const onChangeContent = (e: any) => {
    setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
  };

  const handleModify = async (e: any) => {
    if (contactInfo.type === "") {
      toast.error("문의유형을 선택해주세요.");
      return;
    }
    if (contactInfo.title === "") {
      toast.error("문의제목을 입력해주세요.");
      return;
    }
    if (contactInfo.title.length < 1 || contactInfo.title.length > 100) {
      toast.error("제목필드 입력 범위는 1자 이상 100자 이하입니다.");
      return;
    }
    if (contactInfo.userName === "") {
      toast.error("이름을 입력해주세요.");
      return;
    }
    if (contactInfo.userName.length < 1 || contactInfo.userName.length > 50) {
      toast.error("이름 입력 범위는 1자 이상 50자 이하입니다.");
      return;
    }
    if (contactInfo.phone === "") {
      toast.error("전화번호를 입력해주세요.");
      return;
    }
    if (!/^[\d]{9,12}/.test(contactInfo.phone)) {
      toast.error("전화번호는 숫자만 입력해주세요.");
      return;
    }
    if (contactInfo.phone.length < 9 || contactInfo.phone.length > 12) {
      toast.error("전화번호 입력 범위는 9자 이상 12자 이하입니다. (‘-’제외)");
      return;
    }
    if (contactInfo.email === "") {
      toast.error("이메일을 입력해주세요.");
      return;
    }
    if (!/^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/.test(contactInfo.email)) {
      toast.error("유효한 이메일 주소를 입력해주세요.");
      return;
    }
    if (contactInfo.content === "") {
      toast.error("문의내용을 입력해주세요.");
      return;
    }
    if (contactInfo.content.length < 1 || contactInfo.content.length > 500) {
      toast.error("문의내용의 입력 범위는 1자 이상 500자 이하입니다.");
      return;
    }
    console.log(contactInfo);

    const res = await helpApi.updateQna({
      inquiry_id: contactInfo.id,
      user_id: contactInfo.userId,
      inquiry_type: contactInfo.type,
      inquiry_title: contactInfo.title,
      inquiry_user_display_name: contactInfo.userName,
      inquiry_user_number: contactInfo.phone,
      inquiry_user_email: contactInfo.email,
      inquiry_contents: contactInfo.content,
    });
    if(res && res.status === 200) {
      toast.success("수정이 완료되었습니다.");
      //navigate(-2);
      navigate("/sslo/mypage/contact/detail/" + cId, {state: {item : { tag:"inquiry", contact: contactInfo }}});
    } else {
      toast.error(res + "오류가 발생했습니다.");
    }
  };

  return (
    <MyPageContactDetailModifyPresenter 
      contact={contact} 
      handleModify={handleModify} 
      onChangeContent={onChangeContent}
    />
  );
}

export default MyPageContactDetailModifyContainer;