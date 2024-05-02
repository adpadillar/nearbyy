import type { NextMiddleware } from "next/server";
import { NextResponse } from "next/server";
import { authMiddleware } from "@clerk/nextjs";

// We want to call authMiddleware with the public routes, so we
// can call auth() on each of them.
const publicApiRoutes = ["/api/trpc/:name*"];
const ignoredResources = [
  "/brand/:name*",
  "/example/:name*",
  "/api/files",
  "/api/chunks",
  "/api/clerk",
  "/api/files/get-upload-url",
];

// Public Routes: Means we call the middleware, but we still allow anonymous access
// Ignored Routes: Means we don't call the middleware at all
const middleware: NextMiddleware = authMiddleware({
  beforeAuth: (req) => {
    const newHeaders = new Headers(req.headers);
    newHeaders.set("x-url", req.url);

    return NextResponse.next({
      headers: newHeaders,
    });
  },
  publicRoutes: ["/", ...publicApiRoutes],
  ignoredRoutes: ignoredResources,
});

export default middleware;

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
