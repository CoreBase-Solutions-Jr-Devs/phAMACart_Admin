import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { AuthState, DecodedToken } from "./authType";

const getInitialState = (): AuthState => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (accessToken) {
    try {
      const decoded: DecodedToken = jwtDecode(accessToken);

      // Check if token is expired
      const isExpired = decoded.exp ? decoded.exp * 1000 < Date.now() : false;

      if (isExpired) {
        // Access token expired but keep refreshToken so baseQueryWithReauth can use it
        return {
          accessToken: null,
          refreshToken, // ← retain so reauth can attempt refresh on first load
          user: decoded,
          isAuthenticated: false,
        };
      }

      return {
        accessToken,
        refreshToken,
        user: decoded,
        isAuthenticated: true,
      };
    } catch {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
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
    refreshToken,  // ← retain refresh token even if access token is absent
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

      try {
        const decoded: DecodedToken = jwtDecode(accessToken);

        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.user = decoded;
        state.isAuthenticated = true;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      } catch {
        // If token is malformed, treat as logout
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
        state.isAuthenticated = false;

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    },

    // Called by baseQueryWithReauth after a successful token refresh
    updateAccessToken: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      const { accessToken, refreshToken } = action.payload;

      try {
        const decoded: DecodedToken = jwtDecode(accessToken);

        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.user = decoded;
        state.isAuthenticated = true;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      } catch {
        state.isAuthenticated = false;
      }
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

export const { setCredentials, updateAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;