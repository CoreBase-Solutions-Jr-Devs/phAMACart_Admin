export interface CreateUserRequest {
  userName: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  temporaryPassword: string;
  dateOfBirth: string;
  roleIds: string[];
  forcePasswordChange: boolean;
  accessFromAnyNetwork: boolean;
  expiryDate?: string | null;
  emailConfirmationRequired: boolean;
}

/**
 * Admin update. Omitted fields are left unchanged; roleIds, when sent,
 * replace the user's roles (and sign them out everywhere).
 */
export interface UpdateUserRequest {
  userName?: string;
  email?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string | null;
  roleIds?: string[];
  forcePasswordChange?: boolean;
  accessFromAnyNetwork?: boolean;
  expiryDate?: string | null;
  clearExpiryDate?: boolean;
}

export interface User {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;

  dateOfBirth?: string | null;

  addressLine1?: string | null;
  addressLine2?: string | null;
  landmark?: string | null;
  city?: string | null;
  county?: string | null;
  country?: string | null;

  memberNo?: string | null;
  cusCode?: string | null;

  roleIds: string[];
  roles: string[];

  isActive: boolean;

  /* Detail-only (GET /identity/users/{id}) */
  forcePasswordChange?: boolean;
  accessFromAnyNetwork?: boolean;
  expiryDate?: string | null;
  emailConfirmed?: boolean;
  isLockedOut?: boolean;
}

export interface CreateUserResponse {
  user: User;
}

export interface RoleDto {
  id: string;
  name: string;
}

export interface RoleSearchRequest {
  searchTerm?: string;
  isSystemRole?: boolean;
  isActive?: boolean;
  pageIndex?: number;
  pageSize?: number;
}

export interface UserSearchRequest {
  searchTerm?: string;
  roleName?: string;
  isActive?: boolean;
  pageIndex?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
}