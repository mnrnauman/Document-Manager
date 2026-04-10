import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PROTECTED = ["/letterhead", "/invoice", "/quotation"]

export function middleware(request: NextRequest) {
  const auth = request.cookies.get("gencoreAuth")?.value
  const { pathname } = request.nextUrl

  // Skip Next.js internal requests (_next/static, _next/image, api routes, etc.)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  if (!auth && PROTECTED.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (auth === "true" && pathname === "/") {
    return NextResponse.redirect(new URL("/letterhead", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
