/**
 * API surfaces (Krafthaus Spec 08 §11). The backend maps every endpoint under
 * one of these prefixes; the unversioned URLs are deprecated aliases that
 * answer with a `Deprecation` header and will be removed.
 *
 * - CLIENT: storefront + shared endpoints (sign-in, notifications, public catalogue reads)
 * - ADMIN:  back-office endpoints (SuperAdminOnly / DevOnly / permission-gated)
 */
export const CLIENT = "/v1/client";
export const ADMIN = "/v1/admin";
