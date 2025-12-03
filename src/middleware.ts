import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: '/admin/:path*',
}

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization')
  const url = req.nextUrl

  // If basic auth env vars are not set, skip the middleware to avoid blocking access.
  const expectedUser = process.env.BASIC_AUTH_USER
  const expectedPassword = process.env.BASIC_AUTH_PASSWORD
  if (!expectedUser || !expectedPassword) {
    console.warn('Basic Auth not configured; skipping admin auth middleware.')
    return NextResponse.next()
  }

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    // Decode base64 credentials
    // Added Buffer check for environments where it might not be globally available
    const [user, pwd] = typeof Buffer !== 'undefined' 
      ? Buffer.from(authValue, 'base64').toString().split(':')
      : atob(authValue).split(':') // Fallback for environments like Cloudflare Workers Edge

    // Validate credentials
    if (user === expectedUser && pwd === expectedPassword) {
      return NextResponse.next()
    } else {
      console.warn('Basic auth failed for admin route access attempt.')
    }
  }

  // Request Basic Authentication
  url.pathname = '/api/auth_error' // Redirect to an error route or return directly
  // Returning a 401 response directly to prompt for credentials
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  })
} 
