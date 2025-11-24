/* eslint-disable @typescript-eslint/no-explicit-any */
// auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        const email = String(creds?.email || "").trim();
        const password = String(creds?.password || "");

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.password) {
          // no user or no password hash stored
          return null;
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        // Values you want available in JWT + session
        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    // Just allow sign in if credentials are valid
    async signIn() {
      return true;
    },

    // Put id/email/role onto the token
    async jwt({ token, user }) {
      if (user) {
        (token as any).uid = (user as any).id;
        token.email = user.email;
        (token as any).role = (user as any).role ?? (token as any).role;
      }
      return token;
    },

    // Expose id + role on session.user
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = (token as any).uid as string;
        (session.user as any).role = (token as any).role ?? null;
      }
      return session;
    },
  },
});
