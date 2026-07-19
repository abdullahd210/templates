import type { DefaultSession } from "next-auth";
import type { RoleKey, PermissionKey } from "@/lib/rbac-constants";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roles: RoleKey[];
      permissions: PermissionKey[];
    } & DefaultSession["user"];
  }

  interface User {
    roles?: RoleKey[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roles?: RoleKey[];
    permissions?: PermissionKey[];
  }
}
