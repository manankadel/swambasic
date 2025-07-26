// src/app/api/auth/register/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { loginCustomer } from '@/lib/shopify';

const CUSTOMER_TOKEN_COOKIE_NAME = 'swambasic_customer_token';

export async function POST(request: Request) {
    console.time("REGISTER_API_TOTAL_TIME"); // Start total timer

    try {
        const { firstName, lastName, email, password } = await request.json();

        if (!firstName || !lastName || !email || !password) {
            return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
        }

        const adminApiToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
        const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
        const adminApiUrl = `https://${storeDomain}/admin/api/2024-07/customers.json`;

        const customerData = {
            customer: {
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password,
                password_confirmation: password,
                verified_email: true,
            }
        };

        // 1. Create the customer using the Admin API
        console.time("SHOPIFY_ADMIN_CREATE_CALL");
        const createResponse = await fetch(adminApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': adminApiToken! },
            body: JSON.stringify(customerData),
        });
        console.timeEnd("SHOPIFY_ADMIN_CREATE_CALL"); // End Admin API timer

        const createData = await createResponse.json();

        if (!createResponse.ok) {
            const errorMessage = createData.errors ? Object.values(createData.errors).flat().join(', ') : 'Failed to create account.';
            return NextResponse.json({ error: errorMessage }, { status: 400 });
        }

        // 2. Automatically log them in
        console.time("SHOPIFY_STOREFRONT_LOGIN_CALL");
        const loginResult = await loginCustomer({ email, password });
        console.timeEnd("SHOPIFY_STOREFRONT_LOGIN_CALL"); // End Storefront API timer

        if (loginResult.customerAccessToken) {
            const { accessToken, expiresAt } = loginResult.customerAccessToken;
            cookies().set(CUSTOMER_TOKEN_COOKIE_NAME, accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                sameSite: 'strict',
                expires: new Date(expiresAt),
            });
            
            console.timeEnd("REGISTER_API_TOTAL_TIME"); // End total timer
            return NextResponse.json({ success: true }, { status: 201 });
        }

        return NextResponse.json({ error: 'Account created, but failed to log in.' }, { status: 500 });

    } catch (error) {
        console.error('Register API error:', error);
        console.timeEnd("REGISTER_API_TOTAL_TIME"); // End total timer in case of error
        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
}