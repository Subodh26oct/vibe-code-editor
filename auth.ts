import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "./auth.config";
import { db } from "./lib/db";
import { getAccountByUserId, getUserById } from "./modules/auth/actions";
import { DEFAULT_LOGIN_REDIRECT } from "./routes";

export const { auth, handlers, signIn, signOut } = NextAuth({
  // Spread authConfig FIRST so providers are set,
  // then our explicit config below takes precedence for callbacks, adapter, etc.
  ...authConfig,

  callbacks: {
    async signIn({ user, account }) {
      if (!user || !account) return false;
      return true;
    },

    async jwt({ token, account }) {
      // On initial sign-in, `account` is available with the access_token
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }

      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      // If we don't have the token yet (e.g. session refresh), get it from DB
      if (!token.accessToken && existingAccount?.access_token) {
        token.accessToken = existingAccount.access_token;
      }

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;

      return token;
    },

    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.sub && session.user) {
        session.user.role = token.role;
      }

      // Expose the GitHub access token to the client session
      if (token.accessToken && session.user) {
        session.user.accessToken = token.accessToken;
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}${DEFAULT_LOGIN_REDIRECT}`;
    },
  },

  secret: process.env.AUTH_SECRET,
  debug: true,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/sign-in",
  },
});
