// auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: { signIn: "/login" },

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

      if (isOnDashboard) {
        return isLoggedIn ? true : false;
      }

      if (isLoggedIn) {
        const role = (auth?.user as any)?.role;
        const target = role === "ADMIN" ? "/admin/dashboard" : "/dashboard";
        return Response.redirect(new URL(target, nextUrl));
      }
      return true;
    },
  },

  providers: [],
};
