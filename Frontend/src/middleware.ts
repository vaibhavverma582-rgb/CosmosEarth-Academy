import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/profile", "/settings"];

export function middleware(req: NextRequest) {
  try {
    // For now, let NextAuth handle auth via session only
    // Don't run the full auth middleware on every request
    return NextResponse.next();
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!api|uploads|_next/static|_next/image|favicon.ico|.*\\.svg$).*)",
  ],
};
