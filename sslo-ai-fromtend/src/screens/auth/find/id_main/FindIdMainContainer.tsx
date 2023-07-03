import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import userApi from "../../../../api/userApi";
import FindIdMainPresenter from "./FindIdMainPresenter";

const FindIdMainContainer = () => {
  const [userEmail, setUserEmail] = useState<string>("");
  const [checkEmail, setCheckEmail] = useState<boolean>(true);
  const [userId, setUserId] = useState<string>("");
  const [findAlert, setFindAlert] = useState<boolean>(false);

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setUserEmail(email);
    const emailCheck = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    emailCheck.test(email) ? setCheckEmail(false) : setCheckEmail(true);
  };

  const navigate = useNavigate();
  const handleConfirm = () => {};

  const getFindId = async () => {
    if (!userEmail) {
      toast.error("이메일을 입력해주세요.");
      return;
    }
    const res = await userApi.getFindId({
      user_email: userEmail,
    });

    if (res && res.status === 200) {
      console.log(res.data);
      setUserId(res.data);
      setFindAlert(true);
      if (findAlert) {
        navigate("/find/id/mail", { state: userId });
        return;
      }
    } else {
      toast.error("등록된 정보를 찾을 수 없습니다.", { autoClose: 3000 });
      setFindAlert(false);
      setTimeout(function() {
        window.location.reload();
      }, 3000);
    }
  };

  return (
    <FindIdMainPresenter
      userEmail={userEmail}
      checkEmail={checkEmail}
      handleConfirm={handleConfirm}
      handleChangeEmail={handleChangeEmail}
      getFindId={getFindId}
    />
  );
};

export default FindIdMainContainer;
