import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Add custom middleware logic here
  // For example: authentication, redirects, etc.

  // Get the member token from cookies
  const memberToken = request.cookies.get('member_token')?.value

  const pathname = request.nextUrl.pathname

  // Public routes that don't require authentication
  const publicRoutes = [
    '/sign-in',
    '/sign-up',
  ]

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // If user is not authenticated and trying to access protected route
  // Allow access to root path (landing page)
  if (!memberToken && !isPublicRoute && pathname !== '/') {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (memberToken && (pathname.includes('sign-in') || pathname.includes('sign-up'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect root path to dashboard if authenticated, otherwise to sign-in
  // Redirect root path to dashboard if authenticated
  if (pathname === '/' && memberToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Allow public access to root (Landing Page)
  if (pathname === '/') {
    return NextResponse.next()
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public files (images, fonts, etc.)
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$|.*\\.avif$|.*\\.svg$|.*\\.mp4$).*)',
  ],
}
