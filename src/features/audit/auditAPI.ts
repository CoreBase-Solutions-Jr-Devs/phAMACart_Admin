import { apiClient } from "@/app/api-client";
import { ADMIN } from "@/app/api-paths";
import type { PaginatedResult } from "@/features/users/usersType";

/** Mirrors Audit.Contracts.Enums.AuditEntityType. */
export const AUDIT_ENTITY_TYPES: Record<number, string> = {
  1: "User",
  2: "Role",
  3: "Permission",
  4: "Role permission",
  5: "User role",
  6: "Integration",
  7: "Tenant",
  8: "Company profile",
  9: "Prescription",
  10: "Banner",
  11: "Delivery settings",
  12: "Store location",
  13: "Brand",
  14: "Category",
  15: "Product",
  16: "Inventory reservation",
  17: "Payment",
};

/** Mirrors Audit.Contracts.Enums.AuditAction. */
export const AUDIT_ACTIONS: Record<number, string> = {
  1: "Created",
  2: "Updated",
  3: "Deleted",
  4: "Deactivated",
  5: "Reactivated",
  6: "Role assigned",
  7: "Role removed",
  8: "Permission assigned",
  9: "Permission removed",
  10: "Sign-in succeeded",
  11: "Sign-in failed",
  12: "Password reset",
  13: "Profile updated",
  14: "Password reset requested",
  15: "Password reset completed",
  16: "Password changed",
  17: "Email confirmed",
  18: "Signed in",
  19: "Signed out",
  20: "Created",
  21: "Saved",
  22: "Updated",
  23: "Approved",
  24: "Rejected",
  25: "Deleted",
  26: "Requested",
  27: "Submitted",
};

export interface AuditLog {
  id: string;
  entityType: number;
  entityId: string;
  entityDisplayName?: string | null;
  action: number;
  changes?: string | null;
  performedByUserId?: string | null;
  performedByUserName: string;
  occurredAt: string;
}

export interface AuditLogQuery {
  entityType?: number;
  entityId?: string;
  from?: string;
  to?: string;
  pageIndex: number;
  pageSize: number;
}

export const auditApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    /** Needs the Audit.View permission. */
    searchAuditLogs: builder.query<PaginatedResult<AuditLog>, AuditLogQuery>({
      query: ({ entityType, entityId, from, to, pageIndex, pageSize }) => ({
        url: `${ADMIN}/audit-logs`,
        params: {
          EntityType: entityType,
          EntityId: entityId || undefined,
          From: from,
          To: to,
          PageIndex: pageIndex,
          PageSize: pageSize,
        },
      }),
      providesTags: ["audit"],
    }),
  }),
});

export const { useSearchAuditLogsQuery } = auditApi;
