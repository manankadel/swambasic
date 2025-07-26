import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const CUSTOMER_TOKEN_COOKIE_NAME = 'swambasic_customer_token';

export async function POST(request: Request) {
    try {
        const cookieStore = cookies();
        
        // Delete the cookie by setting its maxAge to 0
        cookieStore.set(CUSTOMER_TOKEN_COOKIE_NAME, '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'strict',
            maxAge: 0, // This effectively deletes the cookie
        });

        return NextResponse.json({ success: true, message: 'Logged out successfully.' }, { status: 200 });

    } catch (error) {
        console.error('Logout API error:', error);
        return NextResponse.json({ error: 'An unexpected error occurred during logout.' }, { status: 500 });
    }
}