import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import helpApi from "../../../../api/helpApi";
import userApi from "../../../../api/userApi";
import { useAppSelector } from "../../../../hooks";
import SsloInquiryPresenter from "./SsloInquiryPresenter";
export interface IInquiry {
  partnership_inquiry_type: string;
  partnership_inquiry_title: string;
  partnership_inquiry_contents: string;
  partnership_inquiry_company_classification: string;
  partnership_inquiry_company_name: string;
  partnership_inquiry_creator_name: string; //제안자명
  partnership_inquiry_company_number: string;
  partnership_inquiry_company_email: string;
  partnership_inquiry_company_website_url: string;
  partnership_inquiry_proposal: string;
  partnership_inquiry_company_introduction: string;
}

const SsloInquiryContainer = () => {
  const loggedInUser = useAppSelector((state) => state.userReducer);

  const [inquiryInfo, setInquiryInfo] = useState<IInquiry>({
    partnership_inquiry_type: "",
    partnership_inquiry_title: "",
    partnership_inquiry_contents: "",
    partnership_inquiry_company_classification: "",
    partnership_inquiry_company_name: "",
    partnership_inquiry_creator_name: "",
    partnership_inquiry_company_number: "",
    partnership_inquiry_company_email: "",
    partnership_inquiry_company_website_url: "",
    partnership_inquiry_proposal: "",
    partnership_inquiry_company_introduction: "",
  });
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  // ! 이용약관 동의 체크박스
  const [InfoCheck, setInfoCheck] = useState<boolean>(false);
  // ! "partnership_inquiry_proposal" 파일
  const [proposalFile, setProposalFile] = useState<any>();
  // ! "partnership_inquiry_company_introduction" 파일
  const [introductionFile, setIntroductionFile] = useState<any>();
  // ! "partnership_inquiry_proposal" 파일 type
  const [proposalFileType, setProposalFileType] = useState<any>();
  // ! "partnership_inquiry_company_introduction" 파일 type
  const [introductionFileType, setIntroductionFileType] = useState<any>();

  const getUserName = async () => {
    const res = await userApi.getUserInfo({
      user_id: loggedInUser.id,
    });
    if (res && res.status === 200) {
      const name = res.data.user_display_name;
      const email = res.data.user_email;
      setUserName(name);
      setUserEmail(email);
    }
  };
  useEffect(() => {
    if (loggedInUser || loggedInUser.isLoggedIn) {
      getUserName();
    }
  }, []);
  const infoCheckBox = () => {
    setInfoCheck((prev) => !prev);
  };
  const changeProposalFile = (e: any) => {
    const pFile = e.target.files[0];
    setProposalFile(pFile);
    setProposalFileType(pFile.type);
  };
  const changeIntroductionFile = (e: any) => {
    const iFile = e.target.files[0];
    setIntroductionFile(iFile);
    setIntroductionFileType(iFile.type);
  };

  const onChangeInfo = (e: any) => {
    setInquiryInfo({ ...inquiryInfo, [e.target.name]: e.target.value });
  };

  const onSubmit = async () => {
    if (inquiryInfo.partnership_inquiry_type === "") {
      toast.error("제휴유형을 선택해주세요.");
      return;
    } else if (inquiryInfo.partnership_inquiry_title === "") {
      toast.error("제휴제목을 입력해주세요.");
      return;
    } else if (
      inquiryInfo.partnership_inquiry_title.length < 1 ||
      inquiryInfo.partnership_inquiry_title.length > 100
    ) {
      toast.error("제목필드 입력 범위는 1자 이상 100자 이하입니다.");
      return;
    } else if (inquiryInfo.partnership_inquiry_contents === "") {
      toast.error("문의내용을 입력해주세요.");
      return;
    } else if (
      inquiryInfo.partnership_inquiry_contents.length < 1 ||
      inquiryInfo.partnership_inquiry_contents.length > 500
    ) {
      toast.error("문의내용 입력 범위는 1자 이상 500자 이하입니다.");
      return;
    } else if (
      proposalFile &&
      proposalFile.name !== "" &&
      proposalFile.type !== "application/pdf"
    ) {
      toast.error(".pdf 확장자 파일만 가능합니다.");
      return;
    } else if (inquiryInfo.partnership_inquiry_company_classification === "") {
      toast.error("기업구분을 선택해주세요.");
      return;
    } else if (inquiryInfo.partnership_inquiry_company_name === "") {
      toast.error("회사명을 입력해주세요.");
      return;
    } else if (
      inquiryInfo.partnership_inquiry_company_name.length < 1 ||
      inquiryInfo.partnership_inquiry_company_name.length > 100
    ) {
      toast.error("회사명 필드 입력 범위는 1자 이상 100자 이하입니다.");
      return;
    } else if (
      loggedInUser.id === null &&
      inquiryInfo.partnership_inquiry_creator_name === ""
    ) {
      toast.error("제안자명을 입력해주세요.");
      return;
    } else if (
      loggedInUser.id === null &&
      (inquiryInfo.partnership_inquiry_creator_name.length < 1 ||
        inquiryInfo.partnership_inquiry_creator_name.length > 50)
    ) {
      toast.error("제안자명 입력 범위는 1자 이상 50자 이하입니다.");
      return;
    } else if (inquiryInfo.partnership_inquiry_company_number === "") {
      toast.error("전화번호를 입력해주세요.");
      return;
    } else if (!/^[\d]/.test(inquiryInfo.partnership_inquiry_company_number)) {
      toast.error("전화번호는 숫자만 입력해주세요.");
      return;
    } else if (
      inquiryInfo.partnership_inquiry_company_number.length < 9 ||
      inquiryInfo.partnership_inquiry_company_number.length > 12
    ) {
      toast.error("전화번호 입력 범위는 9자 이상 12자 이하입니다. (‘-’제외)");
      return;
    } else if (
      loggedInUser.id === null &&
      inquiryInfo.partnership_inquiry_company_email === ""
    ) {
      toast.error("이메일을 입력해주세요.");
      return;
    } else if (
      loggedInUser.id === null &&
      !/^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/.test(
        inquiryInfo.partnership_inquiry_company_email
      )
    ) {
      toast.error("유효한 이메일 주소를 입력해주세요.");
      return;
    } else if (
      inquiryInfo.partnership_inquiry_company_website_url !== "" &&
      !/((http|https)?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w_\.-]*)*\/?$/.test(
        inquiryInfo.partnership_inquiry_company_website_url
      )
    ) {
      toast.error("유효한 홈페이지 주소를 입력해주세요.");
      return;
    } else if (
      introductionFile &&
      introductionFile.name !== "" &&
      introductionFile.type !== "application/pdf"
    ) {
      toast.error(".pdf 확장자 파일만 가능합니다.");
      return;
    } else if (InfoCheck === false) {
      toast.error("체크박스 동의는 필수입니다.");
      return;
    } else {
      // ! api
      let form = new FormData();
      form.append("user_id", loggedInUser ? loggedInUser.id : "");
      form.append(
        "partnership_inquiry_type",
        inquiryInfo.partnership_inquiry_type
      );
      form.append(
        "partnership_inquiry_title",
        inquiryInfo.partnership_inquiry_title
      );
      form.append(
        "partnership_inquiry_contents",
        inquiryInfo.partnership_inquiry_contents
      );
      form.append(
        "partnership_inquiry_company_classification",
        inquiryInfo.partnership_inquiry_company_classification
      );
      form.append(
        "partnership_inquiry_company_name",
        inquiryInfo.partnership_inquiry_company_name
      );
      form.append(
        "partnership_inquiry_creator_name",
        loggedInUser.isLoggedIn
          ? userName
          : inquiryInfo.partnership_inquiry_creator_name
      );
      form.append(
        "partnership_inquiry_company_number",
        inquiryInfo.partnership_inquiry_company_number
      );
      form.append(
        "partnership_inquiry_company_email",
        loggedInUser.isLoggedIn
          ? userEmail
          : inquiryInfo.partnership_inquiry_company_email
      );
      form.append(
        "partnership_inquiry_company_website_url",
        inquiryInfo.partnership_inquiry_company_website_url
      );
      form.append("partnership_inquiry_proposal", proposalFile);
      form.append("partnership_inquiry_company_introduction", introductionFile);

      const res = await helpApi.createInquiry(form);
      if (res && res.status === 200) {
        toast.success("제휴문의가 정상 처리되었습니다.", { autoClose: 3000 });
        setTimeout(function() {
          window.location.reload();
        }, 3000);
      } else {
        console.log(res);
      }
    }
  };

  return (
    <SsloInquiryPresenter
      proposalFile={proposalFile}
      introductionFile={introductionFile}
      InfoCheck={InfoCheck}
      userName={userName}
      userEmail={userEmail}
      infoCheckBox={infoCheckBox}
      onChangeInfo={onChangeInfo}
      onSubmit={onSubmit}
      changeProposalFile={changeProposalFile}
      changeIntroductionFile={changeIntroductionFile}
    />
  );
};
export default SsloInquiryContainer;
