import React, { useState, ChangeEvent, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import userApi, { ISignUpPayload } from "../../../../api/userApi";
import SignupMainPresenter from "./SignupMainPresenter";

const SignupMainContainer = () => {
  const location = useLocation();
  const [email, setEmail] = useState<string>("");
  const [emailDoubleCheck, setEmailDoubleCheck] = useState<boolean>(true);
  const [emailCheckResult, setEmailCheckResult] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [idDoubleCheck, setIdDoubleCheck] = useState<boolean>(true);
  const [idCheckResult, setIdCheckResult] = useState<string>("");
  const [pw, setPw] = useState<string>("");
  const [confirmPw, setConfirmPw] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [organization, setOrganization] = useState<string>("");
  const [writeEmail, setWriteEmail] = useState<boolean>(true);
  const [writeId, setWriteId] = useState<boolean>(true);
  const [writePw, setWritePw] = useState<boolean>(true);
  const [writeConfirmPw, setWriteConfirmPw] = useState<boolean>(true);
  const [writeName, setWriteName] = useState<boolean>(true);
  const [writeOrganization, setWriteOrganization] = useState<boolean>(true);
  const [pwType1, setPwType1] = useState({ type: "password", visible: false });
  const [pwType2, setPwType2] = useState({ type: "password", visible: false });
  const [serviceCheck, setServiceCheck] = useState<boolean>(false);
  const [useCheck, setUseCheck] = useState<boolean>(false);

  // ! 조직 ID state
  const [organizationId, setOrganizationId] = useState<number>(0);

  // ! 초대링크로 들어왔을 때,url통해 데이터 가져옴
  useEffect(() => {
    const query = location.search.split("?")[1];
    if (query) {
      const userInfo = query.split("&");
      if (userInfo && userInfo.length > 0) {
        setOrganizationId(parseInt(userInfo[0].split("=")[1]));
        setEmail(userInfo[1].split("=")[1]);
      }
      setEmailDoubleCheck(true);
    }
    setEmailDoubleCheck(true)
  }, [organizationId]);

  const getOrganizationName = async () => {
    const res = await userApi.getOrganizationInfo({
      organization_id: organizationId,
    });
    if (res && res.status === 200) {
      setOrganization(res.data.organization_name);
    }
  };

  useEffect(() => {
    if (organizationId > 0) getOrganizationName();
  }, [organizationId]);

  const serviceCheckBox = () => {
    setServiceCheck(true);
  };
  const useCheckBox = () => {
    setUseCheck(true);
  };

  // ! 서비스이용약관 팝업창 open state
  const [openPolicy, setOpenPolicy] = useState<boolean>(false);
  // ! 개인정보 수집 팝업창 open state
  const [openPolicy2, setOpenPolicy2] = useState<boolean>(false);

  const onOpenPolicy = () => {
    setOpenPolicy(true);
  };
  const onCancelPolicy = () => {
    setOpenPolicy(false);
  };
  const onOpenPolicy2 = () => {
    setOpenPolicy2(true);
  };
  const onCancelPolicy2 = () => {
    setOpenPolicy2(false);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value;
    setEmail(email);
    const emailCheck = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    emailCheck.test(email) ? setWriteEmail(false) : setWriteEmail(true);
  };
  const handleIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    const id = event.target.value;
    setId(id);
    // "/d"는 숫자 [0-9]을 말함
    const idCheck = /^(?=.*[A-Za-z])(?=.*\d)(?=.*)[A-Za-z\d]{6,12}$/;
    idCheck.test(id) ? setWriteId(false) : setWriteId(true);
  };
  const handlePwChange = (event: ChangeEvent<HTMLInputElement>) => {
    const pw = event.target.value;
    setPw(pw);
    const pwCheck = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$/;
    pwCheck.test(pw) ? setWritePw(false) : setWritePw(true);
    pw === confirmPw ? setWriteConfirmPw(false) : setWriteConfirmPw(true);
  };
  const handleConfirmPwChange = (event: ChangeEvent<HTMLInputElement>) => {
    const confirmPw = event.target.value;
    setConfirmPw(confirmPw);
    pw === confirmPw ? setWriteConfirmPw(false) : setWriteConfirmPw(true);
  };
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setName(name);
    name.length > 1 && name.length < 11
      ? setWriteName(false)
      : setWriteName(true);
  };
  const handleOrganizationChange = (event: ChangeEvent<HTMLInputElement>) => {
    const organization = event.target.value;
    setOrganization(organization);
    organization.length > 0 && organization.length < 51
      ? setWriteOrganization(false)
      : setWriteOrganization(true);
  };

  const handlePwView1 = () => {
    setPwType1(() => {
      if (!pwType1.visible) {
        return { type: "text", visible: true };
      } else {
        return { type: "password", visible: false };
      }
    });
  };
  const handlePwView2 = () => {
    setPwType2(() => {
      if (!pwType2.visible) {
        return { type: "text", visible: true };
      } else {
        return { type: "password", visible: false };
      }
    });
  };

  const handleEmailDoubleCheck = async () => {
    const res: any = await userApi.getAllUsers({
      maxResults: 5000,
    });
    console.log(res.data.datas);
    if (res && res.status === 200) {
      for (let i = 0; i < res.data.datas.length; i++) {
        if (email !== res.data.datas[i].user_email) {
          setEmailDoubleCheck(true);
          setEmailCheckResult("사용 가능");

          continue;
        } else {
          setEmailDoubleCheck(false);
          setEmailCheckResult("이메일 중복");
          return;
        }
      }
    }
  };
  const handleIdDoubleCheck = async () => {
    const res: any = await userApi.getAllUsers({
      maxResults: 5000,
    });
    console.log(res.data.datas);
    if (res && res.status === 200) {
      for (let i = 0; i < res.data.datas.length; i++) {
        if (id !== res.data.datas[i].user_id) {
          setIdDoubleCheck(true);
          setIdCheckResult("사용 가능");

          continue;
        } else {
          setIdDoubleCheck(false);
          setIdCheckResult("아이디 중복");
          return;
        }
      }
    }
  };
  const navigate = useNavigate();
  const handleSignUp = async () => {
    if (writePw === true) {
      toast.error("비밀번호를 확인해주세요.", { position: "top-center" });
      return;
    } else if (pw !== confirmPw) {
      toast.error("비밀번호가 일치하지 않습니다.", { position: "top-center" });
      return;
    } else if (!organizationId && emailDoubleCheck === false) {
      toast.error("이메일 중복을 확인해주세요.", {
        position: "top-center",
      });
      return;
    } else if (idDoubleCheck === false) {
      toast.error("아이디 중복을 확인해주세요.", {
        position: "top-center",
      });
      return;
    } else if (serviceCheck === false || useCheck === false) {
      toast.error("체크박스 동의는 필수입니다.", {
        position: "top-center",
      });
      return;
    } else {
      const form: ISignUpPayload = {
        user_id: id,
        user_password: pw,
        user_display_name: name,
        user_email: email,
        organization_name: organization,
      };
      console.log(form);
      const res = await userApi.signUp(form);
      if (
        res &&
        res.status === 200 &&
        idDoubleCheck === true
      ) {
        toast.success("회원가입을 완료하였습니다.", { position: "top-center" });
        navigate("/signup/mail", { state: email });
        return;
      } else {
        console.log("error");
      }
    }
  };
  useEffect(() => {
    setEmailDoubleCheck(false);
    setEmailCheckResult("중복체크 필요");
  }, [email]);
  useEffect(() => {
    setIdDoubleCheck(false);
    setIdCheckResult("중복체크 필요");
  }, [id]);
  return (
    <SignupMainPresenter
      id={id}
      email={email}
      emailDoubleCheck={emailDoubleCheck}
      emailCheckResult={emailCheckResult}
      writeEmail={writeEmail}
      idDoubleCheck={idDoubleCheck}
      idCheckResult={idCheckResult}
      writeId={writeId}
      pwType1={pwType1}
      pwType2={pwType2}
      writeConfirmPw={writeConfirmPw}
      writeName={writeName}
      writeOrganization={writeOrganization}
      writePw={writePw}
      serviceCheck={serviceCheck}
      useCheck={useCheck}
      openPolicy={openPolicy}
      openPolicy2={openPolicy2}
      organizationId={organizationId}
      organization={organization}
      handlePwView1={handlePwView1}
      handlePwView2={handlePwView2}
      handleEmailChange={handleEmailChange}
      handleEmailDoubleCheck={handleEmailDoubleCheck}
      handleIdChange={handleIdChange}
      handleIdDoubleCheck={handleIdDoubleCheck}
      handlePwChange={handlePwChange}
      handleConfirmPwChange={handleConfirmPwChange}
      handleNameChange={handleNameChange}
      handleOrganizationChange={handleOrganizationChange}
      handleSignUp={handleSignUp}
      onOpenPolicy={onOpenPolicy}
      onCancelPolicy={onCancelPolicy}
      onOpenPolicy2={onOpenPolicy2}
      onCancelPolicy2={onCancelPolicy2}
      serviceCheckBox={serviceCheckBox}
      useCheckBox={useCheckBox}
    />
  );
};

export default SignupMainContainer;
