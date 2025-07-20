import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// The name of the session cookie we set in the /api/access route.
const SESSION_TOKEN_NAME = 'swambasic_session';

export function middleware(request: NextRequest) {
  // 1. Get the session cookie from the user's request.
  const sessionCookie = request.cookies.get(SESSION_TOKEN_NAME);
  
  // 2. Get the required session value from our environment variables.
  //    This must be the exact same secret you use in the access API.
  const sessionSecret = process.env.SESSION_SECRET;
  const expectedSessionValue = `access_granted::${sessionSecret}`;

  // 3. Check if the cookie exists and if its value is correct.
  if (!sessionCookie || sessionCookie.value !== expectedSessionValue) {
    // If the cookie is missing or wrong, the user is not authenticated.
    // We redirect them back to the password page (the root URL).
    // new URL('/', request.url) correctly builds the absolute URL for the redirect.
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 4. If the cookie is present and correct, let the user proceed to the requested page.
  return NextResponse.next();
}

// ==================================================================
// This config specifies which pages the middleware should protect.
// We want to protect every page EXCEPT the password page itself.
// ==================================================================
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - The root path '/' (the password page itself)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|$).*)',
  ],
};