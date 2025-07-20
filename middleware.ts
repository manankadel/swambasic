import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_TOKEN_NAME = 'swambasic_session';
const PROTECTED_ROUTES = ['/home', '/catalog', '/account', '/cart', '/contact']; // Add any other pages that need protection

export function middleware(request: NextRequest) {
  // Get the session cookie from the user's request
  const sessionCookie = request.cookies.get(SESSION_TOKEN_NAME);
  
  // Get the pathname of the requested page (e.g., "/home")
  const { pathname } = request.nextUrl;

  // Check if the user is trying to access one of our protected routes
  const isAccessingProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

  // THE SECURITY LOGIC:
  // IF the user is trying to access a protected route AND they do NOT have a session cookie...
  if (isAccessingProtectedRoute && !sessionCookie) {
    // ...forcefully redirect them back to the root password page.
    return NextResponse.redirect(new URL('/', request.url));
  }

  // OPTIONAL BUT RECOMMENDED:
  // IF the user HAS a session cookie AND they try to visit the password page again...
  if (sessionCookie && pathname === '/') {
    // ...send them directly to the homepage.
    return NextResponse.redirect(new URL('/home', request.url));
  }
  
  // If none of the above rules match, let the user proceed.
  return NextResponse.next();
}

// This config ensures the middleware runs on all relevant pages.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};