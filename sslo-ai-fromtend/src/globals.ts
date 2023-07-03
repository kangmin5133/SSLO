import { createGlobalStyle } from 'styled-components';

// scoped 파일은 root 접근하려면 index.ts 에 지정해줘야 하는데, 그렇게 되면 전체적으로 override가 되기 때문에 페이지마다 만약 root에 상속해주는 컬러가 있으면 아래와 같이 함

export const ResetGlobalStyles = createGlobalStyle`
  p,a,b,span,h1,h2,h3,h4,h5,h6{transform: skew(-0.3deg);}

  html,body{margin: 0; padding: 0; height: 100%; width: 100%;}
  #root { width: 100%; height: 100%}
  body,p,h1,h2,h3,h4,h5,h6,ul,ol,li,dl,dt,dd,table,th,td,form,fieldset,legend,input,textarea,button,select{margin:0; padding:0;}
  body,input,textarea,select,table,button{ font-family: 'NanumSquare', sans-serif; letter-spacing: -0.3px; font-size: 13px;}
  h1,h2,h3,h4,h5,h6{font-size: 100%;}
  img{vertical-align: bottom;}
  a{color: inherit;text-decoration: none;}
  address{font-style: normal;}
  table{padding: 0;margin: 0; border-spacing: 0; border-collapse: collapse;}
  th,td{padding: 0;}
  ol,ul,li{list-style: none;}
  button{background: transparent; border: none; outline: none;}
`;

// LoginPage는 signup_login.css 파일에서 색상 상속을 오버라이딩
export const AuthGlobalStyles = createGlobalStyle`
:root {
  --white: #fff;
  --blue: #1B5994;
  --navy: #243654;
  --ne50: #FF9F46;
  --po50: #4CCEAF;
  --po70: #2EA090;
  --gr20: #EBEBEB;
  --gr40: #B5B5B5;
  --gr50: #888;
  --guidance: #6F16B6;
}
`;

// 다수의 페이지에서 common.css 파일을 오버라이딩
// DashboardDetailCleaningPage, DashboardDetailCollectPage ... StudioPreprocessingPage
export const CommonGlobalStyles = createGlobalStyle`
    :root { /* 색상 */
 /* SSLO blue */
 --blue5: #F7FAFE; --blue10: #ECF3FB; --blue20: #CCDFF8; --blue30: #AECCF4; --blue40: #97BDF1; --blue50: #77ACF8; --blue70: #3580E3; --blue80: #2871D9; --blue90: #1C63CF; --blue100: #1154C4; /* SSLO navy */
 --navy40: #6B78A1; --navy100: #243654; /* SSLO red */
 --red5: #FFF9F9; --red10: #FFEFEF; --red20: #FFBFBF; --red30: #FF9393; --red40: #FF7171; --red50: #FF4343; --red60: #CC3636; --red70: #A32B2B; --red80: #832222; --red90: #681B1B; --red100: #541616; /* SSLO grey */
 --grey0: #FFF; --grey5: #FFF9F9; --grey10: #F9FAFB; --grey20: #E2E4E7; --grey30: #CFD1D4; --grey40: #C0C3C7; --grey50: #A4A8AD; --grey60: #737680; --grey70: #5F6164; --grey80: #414244; --grey90: #212122; --grey100: #000000; /* SSLO positive */
 --positive5: #F8FFFC; --positive10: #C3F5E5; --positive20: #A5EBD8; --positive30: #88E2CA; --positive40: #6AD8BD; --positive50: #3DB79F; --positive60: #2EA090; --positive70: #2EA090; --positive80: #1E8980; --positive90: #0F7271; --positive100: #005B61; /* SSLO negative */
 --negative5: #FFFCF6; --negative10: #FFDFB2; --negative20: #FFD29C; --negative30: #FFB971; --negative40: #FFAC5C; --negative50: #FF9F46; --negative60: #F28F40; --negative70: #E2772A; --negative80: #CC611C; --negative90: #BA5317; --negative100: #AC440E; /* SSLO guidance */
 --guidance5: #F9F2FF; --guidance10: #E9D1FD; --guidance20: #D8B1F9; --guidance30: #C790F5; --guidance40: #B56DEF; --guidance50: #A248E9; --guidance60: #8219D4; --guidance70: #6F16B6; --guidance80: #5D1297; --guidance90: #4A0F79; --guidance100: #380B5B; } 
`;
