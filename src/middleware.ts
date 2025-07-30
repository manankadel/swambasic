// src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the names of our cookies for clarity
const SITE_ACCESS_TOKEN_NAME = 'swambasic_session';
const CUSTOMER_TOKEN_COOKIE_NAME = 'swambasic_customer_token';

// Define which paths are protected and require a user to be logged in
const PROTECTED_ROUTES = ['/account', '/cart'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // --- Protection Mechanism #1: The Main Site Password ---
    // This runs for ALL pages EXCEPT the entry page itself (`/`).
    if (pathname !== '/') {
        const siteAccessToken = request.cookies.get(SITE_ACCESS_TOKEN_NAME);
        
        // If there's no site access token, force the user back to the entry page.
        if (!siteAccessToken) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // --- Protection Mechanism #2: Customer Login ---
    // This checks if the user is trying to access a route defined in PROTECTED_ROUTES.
    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

    if (isProtectedRoute) {
        const customerToken = request.cookies.get(CUSTOMER_TOKEN_COOKIE_NAME);

        // If it's a protected route and the user is NOT logged in, redirect to the login page.
        if (!customerToken) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // --- Protection Mechanism #3: Prevent Logged-in Users from seeing Login Page ---
    // If a user is already logged in, they shouldn't be able to see the /login page again.
    if (pathname === '/login') {
        const customerToken = request.cookies.get(CUSTOMER_TOKEN_COOKIE_NAME);

        // If they are logged in, redirect them to their account dashboard.
        if (customerToken) {
            return NextResponse.redirect(new URL('/account', request.url));
        }
    }

    // If none of the above rules apply, allow the request to proceed.
    return NextResponse.next();
}

// This config ensures the middleware runs on all paths EXCEPT for static files and API routes.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}