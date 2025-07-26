import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CUSTOMER_TOKEN_COOKIE_NAME = 'swambasic_customer_token';

export function middleware(request: NextRequest) {
  // Yeh line ab chalegi aur aapko terminal mein dikhegi.
  console.log('✅ Middleware is running for path:', request.nextUrl.pathname);

  const customerToken = request.cookies.get(CUSTOMER_TOKEN_COOKIE_NAME);

  // Agar token nahi hai, toh login page par redirect kar do.
  if (!customerToken) {
    console.log('🚫 No token found, redirecting to /login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Agar token hai, toh user ko page dekhne do.
  return NextResponse.next();
}

// THE FINAL, CORRECT MATCHER
// This will correctly run the middleware on ONLY the /account/* paths.
export const config = {
  // Using a regular expression to match all paths starting with /account
  matcher: '/account/:path*',
};