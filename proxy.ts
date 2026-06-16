import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getAppAccessCookieName,
  isAppAccessPasswordConfigured,
  verifyAccessSessionToken,
} from "@/lib/app-auth";

const PUBLIC_PATH_PREFIXES = [
  "/login",
  "/api/app-auth/login",
  "/api/app-auth/logout",
  "/api/health",
  "/api/schwab/auth/login",
  "/api/schwab/auth/callback",
  "/_next",
  "/favicon.ico",
];

function isPublicPath(pathname: string) {
  return PUBLIC_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export async function proxy(request: NextRequest) {
  if (!isAppAccessPasswordConfigured() || isPublicPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const accessCookie = request.cookies.get(getAppAccessCookieName())?.value;
  const hasValidSession = await verifyAccessSessionToken(accessCookie);
  if (hasValidSession) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!.*\\..*).*)"],
};
