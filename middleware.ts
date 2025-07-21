import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_TOKEN_NAME = 'swambasic_session';
const PROTECTED_ROUTES = ['/home', '/catalog', '/account', '/cart', '/contact'];
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Simple session validation function
function isValidSession(sessionValue: string): boolean {
  try {
    // Decode the session (base64 encoded with timestamp|token|secret)
    const decoded = atob(sessionValue);
    const [timestamp, token, secret] = decoded.split('|');
    
    // Check if session hasn't expired (24 hours)
    const sessionTime = parseInt(timestamp);
    const now = Date.now();
    
    if (now - sessionTime > SESSION_DURATION) {
      return false; // Session expired
    }
    
    // Validate that all parts exist and token has minimum length
    return token && token.length > 10 && secret && secret.length > 0;
  } catch (error) {
    return false; // Invalid session format
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow access to static assets and Next.js internal routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/public/') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.gif') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.js')
  ) {
    return NextResponse.next();
  }
  
  // Allow API routes to handle their own auth
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // Get the session cookie
  const sessionCookie = request.cookies.get(SESSION_TOKEN_NAME);
  const hasValidSession = sessionCookie && isValidSession(sessionCookie.value);
  
  // Check if accessing protected route
  const isAccessingProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  // CRITICAL SECURITY: Block access to protected routes without valid session
  if (isAccessingProtectedRoute && !hasValidSession) {
    // Clear invalid session cookie if it exists
    const response = NextResponse.redirect(new URL('/', request.url));
    if (sessionCookie) {
      response.cookies.delete(SESSION_TOKEN_NAME);
    }
    return response;
  }
  
  // If user has valid session and tries to visit password page, redirect to home
  if (hasValidSession && pathname === '/') {
    return NextResponse.redirect(new URL('/home', request.url));
  }
  
  return NextResponse.next();
}

// Enhanced config to ensure middleware runs on all relevant pages
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)  
     * - favicon.ico (favicon file)
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};