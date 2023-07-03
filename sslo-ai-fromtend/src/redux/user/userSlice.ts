import { IUserState } from "./users";
import { Action, createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import userApi, {
  ILoginRequestPayload,
  ILoginResponsePayload,
} from "../../api/userApi";
import { toast } from "react-toastify";
import { Route, useNavigate } from "react-router-dom";
import path from "path";

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    accessToken: null,
    refreshToken: null,
    id: null,
    isAdmin: false,
    organizationId: 0,
  } as IUserState,
  reducers: {
    logIn(state, action: PayloadAction<ILoginResponsePayload>) {
      state.isLoggedIn = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.id = action.payload.id;
      state.isAdmin = action.payload.isAdmin;
      state.organizationId = action.payload.organizationId;
    },
    logOut(state) {
      state.isLoggedIn = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.id = null;
      state.organizationId = 0;
    },
  },
});

export const { logIn, logOut } = userSlice.actions;
// ! dispatch methods
export const userLogin = (form: ILoginRequestPayload) => async (
  dispatch: Dispatch<Action>
) => {
  try {
    const res = await userApi.login(form);
    let result = "";
    console.log(res);
    if (res && res.status === 200) {
      if (res.data.toString().includes("check")) {
        result = "check";
      } else {
        const accessToken = res.data.access_token;
        const refreshToken = res.data.refresh_token;
        const id = res.data.user_id;
        console.log(accessToken);
        console.log(res.data);
        const roleResponse = await userApi.getUserRole(
          { user_id: id },
          accessToken
        );
        if (roleResponse && roleResponse.status === 200) {
          const userRes = await userApi.getUserInfo(
            { user_id: id },
            accessToken
          );
          if (userRes && userRes.status === 200) {
            const organizationId = userRes.data.organization_id;
            const isAdmin = roleResponse.data.is_admin;
            dispatch(
              logIn({ accessToken, refreshToken, id, isAdmin, organizationId })
            );
            result = "success";
          }
        }
      }
    } else {
      if (res) {
        if (res.data === "password is wrong!") {
          toast.error("비밀번호를 다시 확인해주시기 바랍니다.");
        }
        if (res.data === "user(" + form.user_id + ") is not exist!") {
          toast.error("입력한 아이디 정보가 없습니다.");
        }
      }
      result = "error";
    }
    return result;
  } catch (e) {
    console.log(e);
  }
};

export const userLogout = (jwt: string) => async (
  dispatch: Dispatch<Action>
) => {
  try {
    const res = await userApi.logout(jwt);
    if (res && res.status === 200) {
      dispatch(logOut());
    }
  } catch (e) {
    console.log(e);
  }
};

export default userSlice.reducer;
