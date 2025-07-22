import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, phone } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const adminApiToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  
  // Use REST API instead of GraphQL
  const restApiUrl = `https://${storeDomain}/admin/api/2024-04/customers.json`;

  const customerData = {
    customer: {
      email: email,
      phone: phone,
      tags: "waitlist,pre-launch",
      verified_email: false,
      marketing_opt_in_level: null
    }
  };

  try {
    const response = await fetch(restApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminApiToken!,
      },
      body: JSON.stringify(customerData),
    });

    const responseText = await response.text();
    console.log('Shopify REST API Response Status:', response.status);
    console.log('Shopify REST API Response:', responseText);

    // Parse the response
    let data;
    try {
        data = JSON.parse(responseText);
    } catch (e) {
        console.error("Failed to parse Shopify response as JSON:", responseText);
        return NextResponse.json({ error: 'Invalid response from Shopify.' }, { status: 500 });
    }

    // Success case (201 Created or 200 OK)
    if (response.status === 201 || response.status === 200) {
        const customer = data.customer;
        if (customer && customer.id) {
            console.log('Customer created successfully:', customer.id);
            return NextResponse.json({ 
                success: true, 
                message: "Successfully joined the waitlist!"
            }, { status: 200 });
        }
    }

    // Handle specific error cases
    if (response.status === 422 && data.errors) {
        // Validation errors
        console.error('Shopify validation errors:', data.errors);
        
        // Check for duplicate email
        if (data.errors.email && data.errors.email.includes('has already been taken')) {
            return NextResponse.json({ 
                success: true, 
                message: 'You are already on our waitlist!' 
            }, { status: 200 });
        }
        
        // Other validation errors
        const errorMessage = Object.values(data.errors)[0] as string;
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Other error cases
    if (response.status === 401) {
        return NextResponse.json({ error: 'Authentication failed. Check your access token.' }, { status: 500 });
    }

    if (response.status === 403) {
        return NextResponse.json({ error: 'Permission denied. Check your app permissions.' }, { status: 500 });
    }

    // General failure
    return NextResponse.json({ 
        error: `Failed to create customer: ${response.status}` 
    }, { status: 500 });

  } catch (error) {
    console.error('API Route Crashed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}