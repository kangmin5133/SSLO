// for userSlice types

export interface IUserState {
  isLoggedIn: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  id: string | null;
  isAdmin: boolean;
  organizationId: number;
}
