import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import { jwtDecode } from "jwt-decode";

import { authApi } from "./authAPI";

import {
  AuthState,
  DecodedToken,
} from "./authType";

const normalizeRoles = (
  role:
    | string
    | string[]
    | undefined,
): string[] => {
  if (!role) {
    return [];
  }

  const roles = Array.isArray(role)
    ? role
    : [role];

  return roles
    .map((item) => item.trim())
    .filter(Boolean);
};

const decodeToken = (
  accessToken: string,
): DecodedToken => {
  const decoded =
    jwtDecode<
      Omit<DecodedToken, "roles">
    >(accessToken);

  return {
    ...decoded,
    roles: normalizeRoles(decoded.role),
  };
};

const getInitialState = (): AuthState => {
  const accessToken =
    localStorage.getItem("accessToken");

  const refreshToken =
    localStorage.getItem("refreshToken");

  /**
   * No access token.
   *
   * If there is a refresh token, we still need
   * to initialize authentication before deciding
   * that the user is logged out.
   */
  if (!accessToken) {
    return {
      accessToken: null,
      refreshToken,
      user: null,
      isAuthenticated: false,
      isInitialized: !refreshToken,
    };
  }

  try {
    const decoded =
      decodeToken(accessToken);

    const isExpired =
      decoded.exp
        ? decoded.exp * 1000 <
          Date.now()
        : false;

    /**
     * Access token is expired.
     *
     * Keep the refresh token and mark auth as
     * NOT INITIALIZED.
     *
     * useAuth() will trigger a request and the
     * baseQueryWithReauth will refresh the token.
     */
    if (isExpired) {
      return {
        accessToken: null,
        refreshToken,
        user: decoded,
        isAuthenticated: false,

        // IMPORTANT
        isInitialized: !refreshToken,
      };
    }

    /**
     * Access token is valid.
     */
    return {
      accessToken,
      refreshToken,
      user: decoded,
      isAuthenticated: true,
      isInitialized: false,
    };
  } catch (error) {
    console.error(
      "Failed to decode access token:",
      error,
    );

    localStorage.removeItem(
      "accessToken",
    );

    /**
     * Don't remove the refresh token.
     */
    return {
      accessToken: null,
      refreshToken,
      user: null,
      isAuthenticated: false,
      isInitialized: !refreshToken,
    };
  }
};

const initialState: AuthState =
  getInitialState();

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
      }>,
    ) => {
      const {
        accessToken,
        refreshToken,
      } = action.payload;

      try {
        const decoded =
          decodeToken(accessToken);

        state.accessToken =
          accessToken;

        state.refreshToken =
          refreshToken;

        state.user =
          decoded;

        state.isAuthenticated =
          true;

        state.isInitialized =
          true;

        localStorage.setItem(
          "accessToken",
          accessToken,
        );

        localStorage.setItem(
          "refreshToken",
          refreshToken,
        );
      } catch (error) {
        console.error(
          "Failed to store credentials:",
          error,
        );

        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
        state.isAuthenticated = false;
        state.isInitialized = true;

        localStorage.removeItem(
          "accessToken",
        );

        localStorage.removeItem(
          "refreshToken",
        );
      }
    },

    updateAccessToken: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
      }>,
    ) => {
      const {
        accessToken,
        refreshToken,
      } = action.payload;

      try {
        const decoded =
          decodeToken(accessToken);

        state.accessToken =
          accessToken;

        state.refreshToken =
          refreshToken;

        state.user =
          decoded;

        state.isAuthenticated =
          true;

        state.isInitialized =
          true;

        localStorage.setItem(
          "accessToken",
          accessToken,
        );

        localStorage.setItem(
          "refreshToken",
          refreshToken,
        );
      } catch (error) {
        console.error(
          "Failed to update access token:",
          error,
        );

        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
        state.isAuthenticated = false;
        state.isInitialized = true;

        localStorage.removeItem(
          "accessToken",
        );

        localStorage.removeItem(
          "refreshToken",
        );
      }
    },

    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;

      state.isAuthenticated =
        false;

      state.isInitialized =
        true;

      localStorage.removeItem(
        "accessToken",
      );

      localStorage.removeItem(
        "refreshToken",
      );
    },
  },

  extraReducers: (builder) => {
    builder

      .addMatcher(
        authApi.endpoints
          .getCurrentUser
          .matchFulfilled,

        (state, action) => {
          if (!state.user) {
            return;
          }

          state.user = {
            ...state.user,
            ...action.payload.user,

            roles: normalizeRoles(
              action.payload.user.roles,
            ),
          };

          state.isAuthenticated =
            true;

          state.isInitialized =
            true;
        },
      )

      .addMatcher(
        authApi.endpoints
          .getCurrentUser
          .matchRejected,

        (state) => {
          state.isInitialized =
            true;
        },
      );
  },
});

export const {
  setCredentials,
  updateAccessToken,
  logout,
} = authSlice.actions;

export default authSlice.reducer;