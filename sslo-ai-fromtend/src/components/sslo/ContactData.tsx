
export interface IContact {
  id: number;
  type: string;
  title: string;
  date: number;
  file?: string;
  status?: string;
  userName: string;
  phone: string;
  email: string;
  content: string;
  userId?: string;
  classification?: string;
  companyName?: string;
  url?: string;
  introduction?: string;
}

export interface IContactByTag {
  tag: string;
  contact: IContact;
}

export interface IInquiry {
  inquiry_id: number;
  user_id: string;
  inquiry_type: string;
  inquiry_title: string;
  created: string;
  file?: string;
  inquiry_status: string;
  inquiry_user_display_name: string;
  inquiry_user_number: string;
  inquiry_user_email: string;
  inquiry_contents: string;
}

export interface IPatnership {
  partnership_inquiry_id: number;
  user_id: string;
  partnership_inquiry_type: string;
  partnership_inquiry_title: string;
  partnership_inquiry_contents: string;
  partnership_inquiry_proposal?: string;  //제안서
  partnership_inquiry_company_classification?: string;  //기업구분
  partnership_inquiry_company_name: string;
  partnership_inquiry_creator_name: string;  //담당자
  partnership_inquiry_company_number: string;
  partnership_inquiry_company_email: string;
  partnership_inquiry_company_website_url?: string; //홈페이지 주소
  partnership_inquiry_company_introduction?: string;  //회사 소개서
  status:number
  created: string;
}

export type inquiryType = "website" | "account" | "solution" | "etc";
export type partnershipType = "technology" | "sales" | "advertisement" | "business" | "etc";
export type classificationType = "public" | "large corporation" | "medium-sized enterprise" | "SME" | "Startup" | "SMB";

const inquiryRowList: IContact[] = [
  {
    id: 0,
    type: "solution",
    title: "문의1",
    date: 0,
    status: "true",
    userName: "어드민01",
    email: "admin01@tbell.co.kr",
    phone: "01012341234",
    content: "문의입니다.",
    userId: "admin01",
  },
  {
    id: 1,
    type: "website",
    title: "문의2",
    date: 0,
    status: "false",
    userId: "admin01",
    userName: "어드민01",
    email: "admin01@tbell.co.kr",
    phone: "01012341234",
    content: "문의입니다.",
  },
  {
    id: 2,
    type: "website",
    title: "문의3",
    date: 0,
    status: "false",
    userId: "user02",
    userName: "유저02",
    email: "user02@tbell.co.kr",
    phone: "01012341234",
    content: "문의입니다.",
  },
  {
    id: 3,
    type: "etc",
    title: "문의4",
    date: 0,
    status: "false",
    userName: "홍길동",
    email: "gildong@abc.co.kr",
    phone: "01012341234",
    content: "문의입니다.",
  },
  {
    id: 4,
    type: "etc",
    title: "문의5",
    date: 0,
    status: "false",
    userId: "admin01",
    userName: "어드민01",
    email: "admin01@tbell.co.kr",
    phone: "01012341234",
    content: "문의입니다.",
  },
  {
    id: 5,
    type: "website",
    title: "문의6",
    date: 0,
    status: "false",
    userId: "admin01",
    userName: "어드민01",
    email: "admin01@tbell.co.kr",
    phone: "01012341234",
    content: "문의입니다.",
  },
  {
    id: 6,
    type: "website",
    title: "문의7",
    date: 0,
    status: "false",
    userId: "admin01",
    userName: "어드민01",
    email: "admin01@tbell.co.kr",
    phone: "01012341234",
    content: "문의입니다.",
  },
  {
    id: 7,
    type: "website",
    title: "문의8",
    date: 0,
    status: "false",
    userId: "admin01",
    userName: "어드민01",
    email: "admin01@tbell.co.kr",
    phone: "01012341234",
    content: "문의입니다.",
  },
  {
    id: 8,
    type: "website",
    title: "문의9",
    date: 0,
    status: "false",
    userId: "admin01",
    userName: "어드민01",
    email: "admin01@tbell.co.kr",
    phone: "01012341234",
    content: "문의입니다.",
  },
  {
    id: 9,
    type: "website",
    title: "문의10",
    date: 0,
    status: "false",
    userId: "admin01",
    userName: "어드민01",
    email: "admin01@tbell.co.kr",
    phone: "01012341234",
    content: "문의입니다.",
  },
  {
    id: 10,
    type: "website",
    title: "문의11",
    date: 0,
    status: "false",
    userId: "admin01",
    userName: "어드민01",
    email: "admin01@tbell.co.kr",
    phone: "01012341234",
    content: "문의입니다.",
  },
  {
    id: 11,
    type: "website",
    title: "문의12",
    date: 0,
    status: "false",
    userId: "admin01",
    userName: "어드민01",
    email: "admin01@tbell.co.kr",
    phone: "01012341234",
    content: "문의입니다.",
  },
  {
    id: 12,
    type: "website",
    title: "문의13",
    date: 0,
    status: "false",
    userId: "admin01",
    userName: "어드민01",
    email: "admin01@tbell.co.kr",
    phone: "01012341234",
    content: "문의입니다.",
  },
];

const partnershipRowList: IContact[] = [
  {
    id: 0,
    type: "business",
    title: "문의1",
    date: 0,
    file: "file.pdf",
    userName: "어드민01",
    email: "admin01@tbell.co.kr",
    phone: "01012341234",
    content: "문의입니다.",
    userId: "admin01",
    classification: "public",
    companyName: "회사1",
    url: "https://aaa.com",
    introduction: "introduction.pdf",
  },
  {
    id: 1,
    type: "technology",
    title: "문의2",
    date: 0,
    file: "file.pdf",
    userId: "admin01",
    userName: "어드민01",
    email: "admin01@tbell.co.kr",
    phone: "01012341234",
    content: "문의입니다.",
    classification: "large corporation",
    companyName: "회사1",
    url: "https://aaa.com",
    introduction: null,
  },
  {
    id: 2,
    type: "technology",
    title: "문의3",
    date: 0,
    file: null,
    userId: "user02",
    userName: "유저02",
    email: "user02@tbell.co.kr",
    phone: "01012341234",
    content: "문의입니다.",
    classification: "medium-sized enterprise",
    companyName: "회사1",
    url: "https://aaa.com",
    introduction: null,
  },
  {
    id: 3,
    type: "sales",
    title: "문의4",
    date: 0,
    file: "file.pdf",
    userName: "홍길동",
    email: "gildong@abc.co.kr",
    phone: "01012341234",
    content: "문의입니다.",
    classification: "medium-sized enterprise",
    companyName: "회사1",
    url: "https://aaa.com",
    introduction: null,
  },
  {
    id: 4,
    type: "sales",
    title: "문의5",
    date: 0,
    file: null,
    userId: "admin01",
    userName: "어드민01",
    email: "admin01@tbell.co.kr",
    phone: "01012341234",
    content: "문의입니다.",
    classification: "medium-sized enterprise",
    companyName: "회사1",
    url: "https://aaa.com",
    introduction: null,
  },
  {
    id: 5,
    type: "advertisement",
    title: "문의6",
    date: 0,
    file: null,
    userId: "admin01",
    userName: "어드민01",
    email: "admin01@tbell.co.kr",
    phone: "01012341234",
    content: "문의입니다.",
    classification: "SME",
    companyName: "회사1",
    url: "https://aaa.com",
    introduction: null,
  },
  {
    id: 6,
    type: "advertisement",
    title: "문의7",
    date: 0,
    file: "file.pdf",
    userId: "admin01",
    userName: "어드민01",
    email: "admin01@tbell.co.kr",
    phone: "01012341234",
    content: "문의입니다.",
    classification: "SME",
    companyName: "회사1",
    url: "https://aaa.com",
    introduction: null,
  },
  {
    id: 7,
    type: "buisness",
    title: "문의8",
    date: 0,
    file: "file.pdf",
    userId: "admin01",
    userName: "어드민01",
    email: "admin01@tbell.co.kr",
    phone: "01012341234",
    content: "문의입니다.",
    classification: "Startup",
    companyName: "회사2",
    url: "https://bbb.com",
    introduction: null,
  },
  {
    id: 8,
    type: "buisness",
    title: "문의9",
    date: 0,
    file: "file.pdf",
    userId: "admin01",
    userName: "어드민01",
    email: "admin01@tbell.co.kr",
    phone: "01012341234",
    content: "문의입니다.",
    classification: "Startup",
    companyName: "회사2",
    url: "https://bbb.com",
    introduction: null,
  },
  {
    id: 9,
    type: "buisness",
    title: "문의10",
    date: 0,
    file: "file.pdf",
    userId: "admin01",
    userName: "어드민01",
    email: "admin01@tbell.co.kr",
    phone: "01012341234",
    content: "문의입니다.",
    classification: "SMB",
    companyName: "회사2",
    url: "https://bbb.com",
    introduction: null,
  },
  {
    id: 10,
    type: "etc",
    title: "문의11",
    date: 0,
    file: "file.pdf",
    userId: "admin01",
    userName: "어드민01",
    email: "admin01@tbell.co.kr",
    phone: "01012341234",
    content: "문의입니다.",
    classification: "SMB",
    companyName: "회사2",
    url: "https://bbb.com",
    introduction: null,
  },
  {
    id: 11,
    type: "etc",
    title: "문의12",
    date: 0,
    file: "file.pdf",
    userId: "admin01",
    userName: "어드민01",
    email: "admin01@tbell.co.kr",
    phone: "01012341234",
    content: "문의입니다.",
    classification: "public",
    companyName: "회사2",
    url: "https://bbb.com",
    introduction: null,
  },
  {
    id: 12,
    type: "buisness",
    title: "문의13",
    date: 0,
    file: "file.pdf",
    userId: "admin01",
    userName: "어드민01",
    email: "admin01@tbell.co.kr",
    phone: "01012341234",
    content: "문의입니다.",
    classification: "public",
    companyName: "회사2",
    url: "",
    introduction: null,
  },
];

export {
  inquiryRowList,
  partnershipRowList,
};