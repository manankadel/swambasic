import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { updateCustomer } from '@/lib/shopify';

export async function POST(request: Request) {
    const cookieStore = cookies();
    const token = cookieStore.get('swambasic_customer_token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        const { firstName, lastName } = await request.json();

        if (!firstName || !lastName) {
            return NextResponse.json({ error: 'First and last name are required.' }, { status: 400 });
        }

        const result = await updateCustomer(token, { firstName, lastName });

        if (result.customerUserErrors && result.customerUserErrors.length > 0) {
            return NextResponse.json({ error: result.customerUserErrors[0].message }, { status: 400 });
        }

        return NextResponse.json({ success: true, customer: result.customer }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
}