import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = new Set(["/login", "/setup", "/forgot-password"]);
const SETUP_ROUTES = new Set(["/setup", "/setup/wizard"]);

const ROLE_HOME: Record<string, string> = {
  coordinator: "/dashboard",
  student: "/student",
  lecturer: "/lecturer",
  external_panelist: "/panelist",
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Static assets and API routes pass through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Root page: no token check needed — the page itself redirects
  if (pathname === "/") return NextResponse.next();

  // Reset-password route is public
  if (pathname.startsWith("/reset-password")) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Public auth routes: redirect already-authenticated users to their home
  if (PUBLIC_ROUTES.has(pathname) || SETUP_ROUTES.has(pathname)) {
    if (token) {
      const home = ROLE_HOME[token.role] ?? "/login";
      return NextResponse.redirect(new URL(home, req.url));
    }
    return NextResponse.next();
  }

  // Activate route: public (token-based email link)
  if (pathname.startsWith("/activate")) return NextResponse.next();

  // All other routes require authentication
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Profile completion gate: redirect before accessing any role page
  if (!token.profileCompleted && pathname !== "/complete-profile") {
    return NextResponse.redirect(new URL("/complete-profile", req.url));
  }

  // Skip gate for complete-profile if already completed
  if (token.profileCompleted && pathname === "/complete-profile") {
    const home = ROLE_HOME[token.role] ?? "/login";
    return NextResponse.redirect(new URL(home, req.url));
  }

  // Role-based route guards
  const role = token.role;

  if (pathname.startsWith("/dashboard") && role !== "coordinator") {
    return NextResponse.redirect(new URL(ROLE_HOME[role] ?? "/login", req.url));
  }
  if (pathname.startsWith("/student") && role !== "student") {
    return NextResponse.redirect(new URL(ROLE_HOME[role] ?? "/login", req.url));
  }
  if (pathname.startsWith("/lecturer") && role !== "lecturer") {
    return NextResponse.redirect(new URL(ROLE_HOME[role] ?? "/login", req.url));
  }
  if (pathname.startsWith("/panelist") && role !== "external_panelist") {
    return NextResponse.redirect(new URL(ROLE_HOME[role] ?? "/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
