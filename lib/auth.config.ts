import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible auth config for middleware.
 * Does NOT import any Node.js modules.
 */
export const authConfig: NextAuthConfig = {
  trustHost: true,
  providers: [],
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      if (pathname.startsWith("/portal")) {
        if (!isLoggedIn) return false;

        if (pathname.startsWith("/portal/users")) {
          return auth?.user?.role === "ADMIN";
        }

        if (pathname.startsWith("/portal/banking")) {
          return (
            auth?.user?.role === "ADMIN" || auth?.user?.role === "EXECUTIVE"
          );
        }

        return true;
      }

      if (pathname.startsWith("/auth/") && isLoggedIn) {
        return Response.redirect(new URL("/portal", nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as
          | "ADMIN"
          | "EXECUTIVE"
          | "ANALYST"
          | "VIEWER";
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
};
