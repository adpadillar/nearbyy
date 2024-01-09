import { authMiddleware } from "@clerk/nextjs";

// We want to call authMiddleware with the public routes, so we
// can call auth() on each of them.
const publicApiRoutes = ["/api/:name*"];

// Public Routes: Means we call the middleware, but we still allow anonymous access
// Ignored Routes: Means we don't call the middleware at all
export default authMiddleware({
  publicRoutes: ["/", ...publicApiRoutes],
  ignoredRoutes: [],
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!brand|_next/static|_next/image|favicon.ico).*)",
  ],
};
