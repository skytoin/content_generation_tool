import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect dashboard routes - require authentication
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return !!token
        }
        // Allow all other routes
        return true
      },
    },
    pages: {
      signIn: '/login',
    },
  }
)

export const config = {
  matcher: [
    // Protect dashboard and its sub-routes
    '/dashboard/:path*',
    // Protect API routes that require auth (except auth routes)
    '/api/projects/:path*',
    '/api/user/:path*',
  ],
}
