import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {
  publicRoutes,
  authRoutes,
  apiAuthPrefix,
  DEFAULT_LOGIN_REDIRECT,
} from "./routes";

// Initialize NextAuth with the Edge-compatible config (no Prisma adapter)
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // 1. Always allow API auth routes (NextAuth handlers)
  if (isApiAuthRoute) {
    return;
  }

  // 2. Auth routes (e.g. /auth/sign-in)
  //    - If logged in, redirect away to dashboard
  //    - If not logged in, allow access
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  // 3. Protected routes — redirect unauthenticated users to sign-in
  if (!isLoggedIn && !isPublicRoute) {
    // Preserve the original URL so we can redirect back after sign-in
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return Response.redirect(
      new URL(`/auth/sign-in?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  // 4. Public routes — allow access
  return;
});

/**
 * Matcher config — run middleware on all routes EXCEPT:
 * - Static files (_next/static)
 * - Image optimization (_next/image)
 * - Favicon
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (svg, png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
