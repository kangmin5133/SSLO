import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import helpApi from "../../../../api/helpApi";
import userApi from "../../../../api/userApi";
import { useAppSelector } from "../../../../hooks";
import SsloQnAPresenter from "./SsloQnAPresenter";

export interface IInquiry {
  user_id?: string;
  inquiry_type: string;
  inquiry_title: string;
  inquiry_user_display_name: string;
  inquiry_user_number: string;
  inquiry_user_email: string;
  inquiry_contents: string;
}

const SsloQnAContainer = () => {
  const loggedInUser = useAppSelector((state) => state.userReducer);
  const [userName, setUserName] = useState<string>("");
  const [qnaInfo, setQnaInfo] = useState<IInquiry>({
    user_id: "",
    inquiry_type: "",
    inquiry_title: "",
    inquiry_user_display_name: "",
    inquiry_user_number: "",
    inquiry_user_email: "",
    inquiry_contents: "",
  });
  const [ageCheck, setAgeCheck] = useState<boolean>(false);
  const [useCheck, setUseCheck] = useState<boolean>(false);

  const ageCheckBox = () => {
    setAgeCheck((prev) => !prev);
  };
  const useCheckBox = () => {
    setUseCheck((prev) => !prev);
  };

  const getUserName = async () => {
    const res = await userApi.getUserInfo({
      user_id: loggedInUser.id,
    });
    if (res && res.status === 200) {
      const name = res.data.user_display_name;
      setUserName(name);
    }
  };
  useEffect(() => {
    if (loggedInUser || loggedInUser.isLoggedIn) {
      getUserName();
    }
  }, []);
  const onChangeContent = (e: any) => {
    setQnaInfo({ ...qnaInfo, [e.target.name]: e.target.value });
  };
  const onSubmit = async () => {
    if (qnaInfo.inquiry_type === "") {
      toast.error("문의유형을 선택해주세요.");
      return;
    } else if (qnaInfo.inquiry_title === "") {
      toast.error("문의제목을 입력해주세요.");
      return;
    } else if (
      qnaInfo.inquiry_title.length < 1 ||
      qnaInfo.inquiry_title.length > 100
    ) {
      toast.error("제목필드 입력 범위는 1자 이상 100자 이하입니다.");
      return;
    } else if (
      loggedInUser.id === null &&
      qnaInfo.inquiry_user_display_name === ""
    ) {
      toast.error("이름을 입력해주세요.");
      return;
    } else if (
      loggedInUser.id === null &&
      (qnaInfo.inquiry_user_display_name.length < 1 ||
        qnaInfo.inquiry_user_display_name.length > 50)
    ) {
      toast.error("이름 입력 범위는 1자 이상 50자 이하입니다.");
      return;
    } else if (qnaInfo.inquiry_user_number === "") {
      toast.error("전화번호를 입력해주세요.");
      return;
    } else if (!/^[\d]/.test(qnaInfo.inquiry_user_number)) {
      toast.error("전화번호는 숫자만 입력해주세요.");
      return;
    } else if (
      qnaInfo.inquiry_user_number.length < 9 ||
      qnaInfo.inquiry_user_number.length > 12
    ) {
      toast.error("전화번호 입력 범위는 9자 이상 12자 이하입니다. (‘-’제외)");
      return;
    } else if (qnaInfo.inquiry_user_email === "") {
      toast.error("이메일을 입력해주세요.");
      return;
    } else if (
      !/^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/.test(
        qnaInfo.inquiry_user_email
      )
    ) {
      toast.error("유효한 이메일 주소를 입력해주세요.");
      return;
    } else if (qnaInfo.inquiry_contents === "") {
      toast.error("문의내용을 입력해주세요.");
      return;
    } else if (
      qnaInfo.inquiry_contents.length < 1 ||
      qnaInfo.inquiry_contents.length > 500
    ) {
      toast.error("문의내용의 입력 범위는 1자 이상 500자 이하입니다.");
      return;
    } else if (ageCheck === false || useCheck === false) {
      toast.error("체크박스 동의는 필수입니다.");
      return;
    } else {
      // ! api
      const form = {
        user_id: loggedInUser ? loggedInUser.id : "",
        inquiry_type: qnaInfo.inquiry_type,
        inquiry_title: qnaInfo.inquiry_title,
        inquiry_user_display_name: loggedInUser.isLoggedIn
          ? userName
          : qnaInfo.inquiry_user_display_name,
        inquiry_user_number: qnaInfo.inquiry_user_number,
        inquiry_user_email: qnaInfo.inquiry_user_email,
        inquiry_contents: qnaInfo.inquiry_contents,
      };
      const res = await helpApi.createQna(form);
      if (res && res.status === 200) {
        toast.success("1:1문의가 정상 처리되었습니다.", { autoClose: 3000 });
        setTimeout(function() {
          window.location.reload();
        }, 3000);
      } else {
        console.log(res);
      }
    }
  };

  return (
    <SsloQnAPresenter
      onChangeContent={onChangeContent}
      onSubmit={onSubmit}
      ageCheckBox={ageCheckBox}
      useCheckBox={useCheckBox}
      userName={userName}
      ageCheck={ageCheck}
      useCheck={useCheck}
    />
  );
};

export default SsloQnAContainer;
