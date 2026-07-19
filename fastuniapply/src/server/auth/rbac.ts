import "server-only";
import type { Session } from "next-auth";
import type { PermissionKey, RoleKey } from "@/lib/rbac-constants";
import { AppError } from "@/lib/errors";

/**
 * Server-side authorization helpers. These check the session's `roles` /
 * `permissions` claims (populated by the JWT callback in
 * src/server/auth/config.ts at sign-in). Route-group middleware only does a
 * coarse "is this user in the right area" redirect — every service function
 * that reads or writes a specific record must call one of these (or an
 * ownership check) before acting. See docs/05-technical-architecture.md §4
 * and docs/02-roles-and-permissions.md §3.
 */

export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to perform this action.") {
    super("FORBIDDEN", message);
    this.name = "ForbiddenError";
  }
}

export function hasRole(session: Session | null, ...roles: RoleKey[]): boolean {
  if (!session?.user) return false;
  return roles.some((role) => session.user.roles.includes(role));
}

export function hasPermission(session: Session | null, ...permissions: PermissionKey[]): boolean {
  if (!session?.user) return false;
  return permissions.some((permission) => session.user.permissions.includes(permission));
}

/** Throws ForbiddenError if the session lacks every one of the given roles. */
export function requireRole(session: Session | null, ...roles: RoleKey[]): void {
  if (!hasRole(session, ...roles)) {
    throw new ForbiddenError();
  }
}

/** Throws ForbiddenError if the session lacks every one of the given permissions. */
export function requirePermission(session: Session | null, ...permissions: PermissionKey[]): void {
  if (!hasPermission(session, ...permissions)) {
    throw new ForbiddenError();
  }
}

/**
 * Ownership check helper for "view_own" / "manage" style permissions: grants
 * access if the session has the broader `manage`-style permission, OR if the
 * record belongs to the acting user per `isOwner`. Use this in service
 * functions instead of permission checks alone whenever a resource has an
 * owner (e.g. a consultant's assigned students, a student's own documents).
 */
export function canAccessOwned(
  session: Session | null,
  broadPermission: PermissionKey,
  ownPermission: PermissionKey,
  isOwner: boolean,
): boolean {
  if (hasPermission(session, broadPermission)) return true;
  return isOwner && hasPermission(session, ownPermission);
}
