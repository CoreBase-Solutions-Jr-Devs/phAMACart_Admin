export type loginType = { 
  identifier: string;
  password: string 
};

export type LoginRequestBody = {
  user: loginType;
};

export type LoginResponseType = {
  isSuccess: boolean;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAtUtc: string;
  user: {
    id: string;          
    userName: string;
    email: string;
    phoneNumber: string;
    roles: string[];
    currentWorkspace?: string; 
  };
};

export type DecodedToken = {
  sub: string;
  email: string;
  unique_name: string;
  role: string | string[];
  exp: number;
  iss: string;
  aud: string;
};

export type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: DecodedToken | null;
  isAuthenticated: boolean;
};

export type CurrentUserResponseType = {
  isSuccess: boolean;
  user: {
    id: string;
    userName: string;
    email: string;
    phoneNumber: string;
    roles: string[];
    currentWorkspace?: string;
  };
};

export type RefreshTokenResponseType = {
  accessToken: string;
  refreshToken: string;
};