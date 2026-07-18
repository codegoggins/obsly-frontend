import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TOKEN_COOKIE, AUTH_ROUTES } from "@/lib/auth";

// route guard: no token means you only get the auth pages
export function proxy(req: NextRequest) {
  const token = req.cookies.get(TOKEN_COOKIE)?.value;
  const { pathname } = req.nextUrl;
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  // signed out on a protected page -> send to login
  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // signed in but on an auth page -> send to the app
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// run on everything except static assets
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
};
