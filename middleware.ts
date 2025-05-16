import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { isAuthenticated } from "./lib/auth"

// Paths that don't require authentication
const publicPaths = ["/login", "/signup", "/api/auth/login", "/api/auth/signup"]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Check if the path is public
  const isPublicPath = publicPaths.some((publicPath) => path === publicPath || path.startsWith(publicPath + "/"))

  // If it's an API route that's not auth-related, check authentication
  if (path.startsWith("/api/") && !path.startsWith("/api/auth/")) {
    const authenticated = await isAuthenticated(request)

    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.next()
  }

  // For non-API routes, redirect as needed
  const authenticated = await isAuthenticated(request)

  // If the user is not authenticated and the path is not public, redirect to login
  if (!authenticated && !isPublicPath && path !== "/") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If the user is authenticated and trying to access login/signup, redirect to dashboard
  if (authenticated && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // If the user is not authenticated and trying to access the root, redirect to login
  if (!authenticated && path === "/") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
