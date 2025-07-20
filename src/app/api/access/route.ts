import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// We'll use a simple token for the session
const SESSION_TOKEN_NAME = 'swambasic_session';

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
      // Correct password. Set a secure cookie to grant access.
      const cookieStore = cookies();
      
      // The value can be simple, its existence is what matters. We'll sign it later for more security.
      const sessionValue = `access_granted::${sessionSecret}`;

      cookieStore.set(SESSION_TOKEN_NAME, sessionValue, {
        httpOnly: true, // Prevents client-side JS from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
        path: '/',      // Available to the entire site
        sameSite: 'strict', // Helps prevent CSRF attacks
        maxAge: 60 * 60 * 24 * 7, // Cookie expires in 7 days
      });
      
      return NextResponse.json({ success: true }, { status: 200 });

    } else {
      // Incorrect password
      return NextResponse.json({ error: 'Invalid access code' }, { status: 401 });
    }

  } catch (error) {
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}