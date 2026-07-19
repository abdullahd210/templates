import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import argon2 from "argon2";
import { db } from "@/lib/db";
import { loginSchema } from "@/validation/auth.schema";
import type { RoleKey, PermissionKey } from "@/lib/rbac-constants";
import { ROLE_PERMISSIONS } from "@/lib/rbac-constants";

/**
 * Auth.js (NextAuth v5) configuration. Session strategy is JWT (required for
 * the Credentials provider — the Prisma adapter still persists Users/
 * Accounts so a future OAuth provider can be added without a schema change).
 * Role/permission claims are embedded in the token at sign-in so every
 * request can authorize without an extra DB round-trip — see
 * docs/05-technical-architecture.md §4 and §6.
 */
export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = loginSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const user = await db.user.findUnique({
          where: { email, deletedAt: null },
          include: { roles: { include: { role: true } } },
        });
        if (!user?.passwordHash || !user.isActive) return null;

        const passwordValid = await argon2.verify(user.passwordHash, password);
        if (!passwordValid) return null;

        await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          roles: user.roles.map((r) => r.role.key) as RoleKey[],
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const roles = (user as { roles?: RoleKey[] }).roles ?? [];
        token.roles = roles;
        token.permissions = derivePermissions(roles);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.roles = (token.roles as RoleKey[]) ?? [];
        session.user.permissions = (token.permissions as PermissionKey[]) ?? [];
      }
      return session;
    },
  },
};

/** Union of every permission granted by any of the given roles. */
function derivePermissions(roles: RoleKey[]): PermissionKey[] {
  const set = new Set<PermissionKey>();
  for (const role of roles) {
    for (const permission of ROLE_PERMISSIONS[role] ?? []) {
      set.add(permission);
    }
  }
  return Array.from(set);
}
