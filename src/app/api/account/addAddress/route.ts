// src/app/api/account/addAddress/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createCustomerAddress } from '@/lib/shopify';
import { NewAddressInput } from '@/types/shopify'; // Import the type

export async function POST(request: Request) {
    const cookieStore = cookies();
    const token = cookieStore.get('swambasic_customer_token')?.value;

    // 1. Check if user is authenticated
    if (!token) {
        // Return a proper JSON error
        return NextResponse.json({ error: 'Not authenticated. Please log in.' }, { status: 401 });
    }

    try {
        // 2. Get the address data from the request
        const addressData: NewAddressInput = await request.json();

        // Optional: Add server-side validation here if needed
        if (!addressData.address1 || !addressData.city || !addressData.country || !addressData.zip || !addressData.province) {
            return NextResponse.json({ error: 'Missing required address fields.' }, { status: 400 });
        }

        // 3. Call the Shopify function to create the address
        const result = await createCustomerAddress(token, addressData);

        // 4. Check for errors from Shopify and return them as JSON
        if (result.customerUserErrors && result.customerUserErrors.length > 0) {
            return NextResponse.json({ error: result.customerUserErrors[0].message }, { status: 400 });
        }

        // 5. If successful, return a success response
        return NextResponse.json({ success: true, address: result.customerAddress }, { status: 200 });

    } catch (error) {
        // Handle unexpected errors
        console.error('Add Address API Error:', error);
        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
}