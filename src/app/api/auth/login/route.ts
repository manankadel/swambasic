import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { loginCustomer } from '@/lib/shopify';

const CUSTOMER_TOKEN_COOKIE_NAME = 'swambasic_customer_token';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
        }

        const loginResult = await loginCustomer({ email, password });

        // Handle Shopify errors (e.g., incorrect password)
        if (loginResult.customerUserErrors && loginResult.customerUserErrors.length > 0) {
            return NextResponse.json({ error: loginResult.customerUserErrors[0].message }, { status: 401 });
        }

        // Handle successful login
        if (loginResult.customerAccessToken) {
            const { accessToken, expiresAt } = loginResult.customerAccessToken;
            const cookieStore = cookies();
            
            cookieStore.set(CUSTOMER_TOKEN_COOKIE_NAME, accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                sameSite: 'strict',
                expires: new Date(expiresAt),
            });
            
            return NextResponse.json({ success: true }, { status: 200 });
        }
        
        // Fallback error
        return NextResponse.json({ error: 'An unknown error occurred during login.' }, { status: 500 });

    } catch (error) {
        console.error('Login API error:', error);
        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
}