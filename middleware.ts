import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('🔥 MIDDLEWARE RUNNING:', request.nextUrl.pathname)
  
  // Block /home specifically
  if (request.nextUrl.pathname === '/home') {
    console.log('🚫 BLOCKING /home - redirecting to /')
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/home']
}