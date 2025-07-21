import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SESSION_TOKEN_NAME = 'swambasic_session';

// Generate a secure session token
function generateSessionToken(sessionSecret: string): string {
  const timestamp = Date.now().toString();
  const randomToken = Math.random().toString(36).substring(2) + 
                     Math.random().toString(36).substring(2) + 
                     Math.random().toString(36).substring(2);
  
  // Combine timestamp, token, and secret, then base64 encode
  const sessionData = `${timestamp}|${randomToken}|${sessionSecret}`;
  return btoa(sessionData);
}

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const sitePassword = process.env.SITE_ACCESS_PASSWORD;
    const sessionSecret = process.env.SESSION_SECRET;

    if (!sitePassword || !sessionSecret) {
      console.error("Missing environment variables for site access.");
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }
    
    // Check if the password is correct
    if (password === sitePassword) {
      // Generate secure session token
      const sessionToken = generateSessionToken(sessionSecret);
      
      // Set secure cookie
      const cookieStore = cookies();
      cookieStore.set(SESSION_TOKEN_NAME, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours (reduced from 7 days for security)
      });
      
      return NextResponse.json({ success: true }, { status: 200 });

    } else {
      // Incorrect password
      return NextResponse.json({ error: 'Invalid access code' }, { status: 401 });
    }

  } catch (error) {
    console.error('Access API error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}