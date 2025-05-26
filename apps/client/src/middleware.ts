import { NextRequest, NextResponse } from "next/server";
import { AUTH_STATUS_COOKIE } from "./utils/auth-cookies";

// Define routes that require authentication
const PROTECTED_ROUTES = [
  "/dashboard",
  "/notes",
  "/profile",
  "/settings",
  "/video",
];

// Define public routes that should always be accessible
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

// Define the API routes prefix to exclude from middleware
const API_ROUTES_PREFIX = "/api";

/**
 * Middleware function to check authentication status and protect routes
 *
 * @param request - The incoming request
 * @returns NextResponse object that either allows the request or redirects to login
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes, static files, and public assets
  if (
    pathname.startsWith(API_ROUTES_PREFIX) ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Get authentication status from cookies
  const authStatus = request.cookies.get(AUTH_STATUS_COOKIE)?.value;
  const isAuthenticated = authStatus === "authenticated";

  // Check if the route requires authentication
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if it's a public route (login, register, etc.)
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // If it's a protected route and user is not authenticated, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL("/login", request.url);

    // Add the original path as a "returnUrl" parameter
    url.searchParams.set("returnUrl", pathname);

    return NextResponse.redirect(url);
  }

  // If user is authenticated and trying to access login/register pages,
  // redirect to dashboard (prevents authenticated users from seeing auth pages)
  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

/**
 * Configure which paths the middleware should run on
 */
export const config = {
  // Match all paths except those with static files or Next.js internals
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (browser favicon)
     * - public assets (e.g. robots.txt)
     * - API routes (which handle their own auth)
     */
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};
