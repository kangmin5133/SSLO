import callApi from "./module";

export interface IUserWorkStatics {
  stepOneCount: number;
  stepTwoCount: number;
  lastUpdated: number;
}

export interface IUser {
  index?: number;
  userId: string;
  userDisplayName: string;
  userEmail: string;
  created: any;
  workStatics?: IUserWorkStatics;
  member_permission?: number; // 1:admin/2:manager/3:member
}

export interface ILoginRequestPayload {
  user_id: string;
  user_password: string;
}

export interface IGetUserRoleParams {
  user_id: string;
}

export interface ILoginResponsePayload {
  accessToken: string;
  refreshToken: string;
  id: string;
  isAdmin: boolean;
  organizationId: number;
}

export interface ISignUpPayload {
  user_id?: string;
  organization_id?: number;
  user_password?: string;
  user_email?: string;
  user_display_name?: string;
  organization_name?: string;
}

export interface IProjectUser {
  pId: number;
  taskId: number;
  userId: string;
  userDisplayName: string;
  userEmail: string;
  isValidator?: boolean;
  isWorker?: boolean;
}

// eslint-disable-next-line
export default {
  login: (form: ILoginRequestPayload) => callApi("post", "/auth/login", form),
  logout: (jwt?: string) => callApi("get", "/auth/logout", null, jwt),
  getUserRole: (param: IGetUserRoleParams, jwt?: string) =>
    callApi("get", "/auth/user/role", null, jwt, param),
  getAllUsers: (param: any, jwt?: string) =>
    callApi("get", "/auth/user/search", null, jwt, param),
  signUp: (form: ISignUpPayload) => callApi("post", "/auth/admin/create", form),
  getUserInfo: (param: any, jwt?: string) =>
    callApi("get", "/auth/user", null, jwt, param),
  deleteUser: (param: any, jwt?: string) =>
    callApi("delete", "/auth/user/delete", null, jwt, param),
  updateUser: (payload: any) =>
    callApi("post", "/auth/user/update", payload, undefined, null),
  getOrganizationInfo: (param: any) =>
    callApi("get", "/auth/organization/search", null, undefined, param),
  getOrganizationMember: (param: any) =>
    callApi("get", "/auth/organization/member", null, undefined, param),
  getInviteMember: (param: any) =>
    callApi("post", "/auth/email/invite", null, undefined, param),
  getFindId: (param: any) =>
    callApi("get", "/auth/user/find/id", null, undefined, param),
  getFindPw: (param: any) =>
    callApi("get", "/auth/user/find/passwd", null, undefined, param),
  updateOrganizaton: (payload: any) =>
    callApi("post", "/auth/organization/update", payload, undefined, null),
  updatePermission: (payload: any) =>
    callApi("post", "/auth/user/update/permission", payload, undefined, null),
};
