import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { AuthState, DecodedToken } from "./authType";

const getInitialState = (): AuthState => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      return {
        accessToken: token,
        refreshToken: localStorage.getItem("refreshToken"),
        user: decoded,
        isAuthenticated: true,
      };
    } catch {
      return {
        accessToken: null,
        refreshToken: null,
        user: null,
        isAuthenticated: false,
      };
    }
  }

  return {
    accessToken: null,
    refreshToken: null,
    user: null,
    isAuthenticated: false,
  };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      const { accessToken, refreshToken } = action.payload;
      const decoded: DecodedToken = jwtDecode(accessToken);

      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.user = decoded;
      state.isAuthenticated = true;

      // Keep localStorage in sync for page-refresh hydration
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    },

    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;