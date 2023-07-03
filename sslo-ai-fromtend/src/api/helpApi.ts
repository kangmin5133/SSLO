import callApi from "./module";

export interface INotice {
  notice_id?: number;
  notice_type: string;
  notice_title: string;
  notice_contents?: string;
  notice_date: string;
}

export default {
  getSearchNotice: (param?: any) =>
    callApi("get", "/help/notice/search", null, undefined, param),
  createQna: (payload: any) =>
    callApi("post", "/help/inquiry/create", payload, undefined, null),
  createInquiry: (payload: FormData) =>
    callApi("post", "/help/partnership/create", payload, undefined, null),
  searchQnaByUser: (param?: any) =>
    callApi("get", "/help/inquiry/search", null, undefined, param),
  searchPartnershipByUser: (param?: any) =>
    callApi("get", "/help/partnership/search", null, undefined, param),
  updateQna: (payload: any) =>
    callApi("post", "/help/inquiry/update", payload, undefined, null),
};
