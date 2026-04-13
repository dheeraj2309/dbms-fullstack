// Rule 1 → Already logged in + visiting /login = waste of time, redirect home
// Rule 2 → Not logged in + visiting protected page = go login first  
// Rule 3 → Logged in but OTP not done = must verify before doing anything
// Rule 4 → Student trying to sneak into /admin = nope, back to dashboard
// Rule 5 → Admin visiting /dashboard = wrong place, send to admin dashboard
// What the matcher does:
// Without the matcher, middleware runs on literally every single request — including Next.js internal requests for fonts, images, and static files. That's wasteful and can break things. The regex pattern says:
// Run on everything EXCEPT:
//   - /api/*         (your API routes handle their own auth)
//   - /_next/static  (CSS, JS bundles)
//   - /_next/image   (Next.js image optimization)
//   - favicon.ico
// import { auth } from "@/lib/auth"
// import { NextResponse } from "next/server"

// export default auth((req) => {
//   const session = req.auth
//   const pathname = req.nextUrl.pathname

//   const isLoggedIn = !!session
//   const isVerified = session?.user?.isEmailVerified
//   const role = session?.user?.role

//   // Define route types
//   const isAuthRoute = pathname.startsWith("/login") || 
//                       pathname.startsWith("/verify-otp")
//   const isStudentRoute = pathname.startsWith("/dashboard")
//   const isAdminRoute = pathname.startsWith("/admin")

//   // 1. If logged in and verified, block access to auth pages
//   //    (no point visiting /login if already logged in)
//   if (isLoggedIn && isVerified && isAuthRoute) {
//     if (role === "ADMIN") return NextResponse.redirect(new URL("/admin/dashboard", req.url))
//     return NextResponse.redirect(new URL("/dashboard", req.url))
//   }

//   // 2. If not logged in, block protected routes
//   if (!isLoggedIn && (isStudentRoute || isAdminRoute)) {
//     return NextResponse.redirect(new URL("/login", req.url))
//   }

//   // 3. If logged in but OTP not verified yet, force to verify-otp
//   if (isLoggedIn && !isVerified && !isAuthRoute) {
//     return NextResponse.redirect(new URL("/verify-otp", req.url))
//   }

//   // 4. If logged in as USER trying to access admin routes, block them
//   if (isLoggedIn && isVerified && isAdminRoute && role !== "ADMIN") {
//     return NextResponse.redirect(new URL("/dashboard", req.url))
//   }

//   // 5. If logged in as ADMIN trying to access student routes, redirect to admin
//   if (isLoggedIn && isVerified && isStudentRoute && role === "ADMIN") {
//     return NextResponse.redirect(new URL("/admin/dashboard", req.url))
//   }

//   return NextResponse.next()
// })

// // Tell Next.js which routes this middleware should run on
// // Without this, middleware runs on EVERY request including _next, static files etc.
// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// }
import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"  // ← NOT auth.ts
import { NextResponse } from "next/server"

// Use only the edge-safe config here — no Prisma involved
const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const session = req.auth
  const pathname = req.nextUrl.pathname

  const isLoggedIn = !!session
  const isVerified = session?.user?.isEmailVerified
  const role = session?.user?.role

  const isAuthRoute = pathname.startsWith("/login") ||
                      pathname.startsWith("/verify-otp")
  const isStudentRoute = pathname.startsWith("/dashboard")
  const isAdminRoute = pathname.startsWith("/admin")

  if (isLoggedIn && isVerified && isAuthRoute) {
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin/dashboard", req.url))
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  if (!isLoggedIn && (isStudentRoute || isAdminRoute)) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (isLoggedIn && !isVerified && !isAuthRoute) {
    return NextResponse.redirect(new URL("/verify-otp", req.url))
  }

  if (isLoggedIn && isVerified && isAdminRoute && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  if (isLoggedIn && isVerified && isStudentRoute && role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}