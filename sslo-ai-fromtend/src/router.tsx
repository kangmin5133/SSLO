import { createBrowserRouter, useRouteError } from "react-router-dom";
import SsloHome from "./components/sslo/SsloHome";
import SsloMain from "./screens/sslo/home";
import Login from "./screens/auth/login/main";
import Signup from "./screens/auth/signup/main";
import SignupWait from "./screens/auth/signup/wait";
import Root from "./screens/Root";
import SignupMail from "./screens/auth/signup/mail";
import LoginMail from "./screens/auth/login/mail";
import FailEmail from "./screens/auth/login/fail_email_verification";
import CompleteEmail from "./screens/auth/login/complete_email_verification";
import Trial from "./screens/studio/trial";
import PreProcessing from "./screens/studio/preprocessing";
import Labeling from "./screens/studio/labeling";
import Cleansing from "./screens/studio/cleansing";
import CollectInspection from "./screens/studio/collectInspection";
import SignupFailTimeout from "./screens/auth/signup/fail_timeout";
import SignupComplete from "./screens/auth/signup/complete";
import SignupFailOK from "./screens/auth/signup/fail_ok";
import LoginFailMail from "./screens/auth/login/fail_mail";
import LoginFailMailComplete from "./screens/auth/login/fail_mail_complete";
import FindIdMain from "./screens/auth/find/id_main";
import FindPwMain from "./screens/auth/find/pw_main";
import FindIdMail from "./screens/auth/find/id_mail";
import FindPwMail from "./screens/auth/find/pw_mail";
import ResetPwMain from "./screens/auth/find/pw_reset";
import CoreRoot from "./screens/main/MainRoot";
import AllProject from "./screens/main/project/all";
import ProjectCreate from "./screens/main/project/create";
import StudioRoot from "./screens/studio/Root";
import ProjectDetail from "./screens/main/project/detail";
import Dashboard from "./screens/main/dashboard";
import NetworkErrorPage from "./components/NetworkErrorPage";
import NotFound from "./components/404";
import Service from "./screens/sslo/service/SsloService";
import Solution from "./screens/sslo/solution/SsloSolution";
import Price from "./screens/sslo/price/SsloPrice";
import Intro from "./screens/sslo/intro/SsloIntro";
import MyWorks from "./screens/main/myworks";
import SettingGroup from "./screens/main/setting/group_setting";
import SettingMember from "./screens/main/setting/member_setting";
import QnA from "./screens/sslo/help/qna";
import Notice from "./screens/sslo/help/notice";
import NoticeDetail from "./screens/sslo/help/notice/noticeDetail";
import Inquiry from "./screens/sslo/help/inquiry";
import Faq from "./screens/sslo/help/faq";
import MypageContact from "./screens/sslo/mypage/contact";
import MypageContactDetail from "./screens/sslo/mypage/contact/contactDetail";
import MypageContactDetailModify from "./screens/sslo/mypage/contact/contactDetail/contactDetailModify";
import MypagePrivacy from "./screens/sslo/mypage/privacy";
import MypagePassword from "./screens/sslo/mypage/privacy/password";

function ErrorBoundary() {
  const error: any = useRouteError();
  console.log(error);
  switch (error.status) {
    case 404:
      return <NotFound />;
    default:
      return <NetworkErrorPage />;
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <SsloHome />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: "", element: <SsloMain /> },
      { path: "/sslo/service", element: <Service /> },
      { path: "/sslo/solution", element: <Solution /> },
      { path: "/sslo/price", element: <Price /> },
      { path: "/sslo/intro", element: <Intro /> },
      { path: "/sslo/help/notice", element: <Notice /> },
      { path: "/sslo/help/notice/detail/:nId", element: <NoticeDetail /> },
      { path: "/sslo/help/qna", element: <QnA /> },
      { path: "/sslo/help/inquiry", element: <Inquiry /> },
      { path: "/sslo/help/faq", element: <Faq /> },
      { path: "/sslo/mypage/contact", element: <MypageContact /> },
      { path: "/sslo/mypage/privacy", element: <MypagePrivacy /> },
      { path: "/sslo/mypage/contact/detail/:cId", element: <MypageContactDetail /> },
      { path: "/sslo/mypage/contact/detail/:cId/modify", element: <MypageContactDetailModify /> },
      { path: "/sslo/mypage/privacy/password", element: <MypagePassword /> },
    ],
  },
  {
    path: "/login",
    element: <Root />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: "", element: <Login /> },
      { path: "fail/mail", element: <LoginFailMail /> },
      { path: "fail/mail/complete", element: <LoginFailMailComplete /> },
      { path: "mail", element: <LoginMail /> },
      { path: "fail/email", element: <FailEmail /> },
      { path: "complete/email", element: <CompleteEmail /> },
    ],
  },
  {
    path: "/signup",
    element: <Root />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: "", element: <Signup /> },
      { path: "wait", element: <SignupWait /> },
      { path: "mail", element: <SignupMail /> },
      { path: "fail/timeout", element: <SignupFailTimeout /> },
      { path: "complete", element: <SignupComplete /> },
      { path: "fail/ok", element: <SignupFailOK /> },
    ],
  },
  {
    path: "/find",
    element: <Root />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: "id", element: <FindIdMain /> },
      { path: "id/mail", element: <FindIdMail /> },
      { path: "pw", element: <FindPwMain /> },
      { path: "pw/mail", element: <FindPwMail /> },
      { path: "pw/reset", element: <ResetPwMain /> },
    ],
  },
  {
    path: "/main",
    element: <CoreRoot />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "projects", element: <AllProject /> },
      { path: "projects/create", element: <ProjectCreate /> },
      { path: "projects/:pId", element: <ProjectDetail /> },
      { path: "myworks", element: <MyWorks /> },
      { path: "setting/group", element: <SettingGroup /> },
      { path: "setting/member", element: <SettingMember /> },
    ],
  },
  {
    path: "/studio",
    element: <StudioRoot />,
    children: [
      { path: "collect/:pId", element: <CollectInspection /> },
      { path: "preprocessing/:pId", element: <PreProcessing /> },
      { path: "labeling/:pId", element: <Labeling /> },
      { path: "cleansing/:pId", element: <Cleansing /> },
    ],
  },
  { 
    path: "/studio/trial", 
    element: <Trial /> },
  {
    path: "/networkerror",
    element: <NetworkErrorPage />,
  },
]);
export default router;
