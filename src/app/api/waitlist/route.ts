import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, phone } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const adminApiToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const adminApiUrl = `https://${storeDomain}/admin/api/2024-04/graphql.json`;

  const mutation = {
    query: `
      mutation customerCreate($input: CustomerInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
            phone
            tags
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    variables: {
      input: {
        email: email,
        phone: phone,
        tags: ["waitlist", "pre-launch"],
      },
    },
  };

  try {
    const response = await fetch(adminApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminApiToken!,
      },
      body: JSON.stringify(mutation),
    });

    const data = await response.json();

    // Log the full response for debugging
    console.log('Shopify API Response:', JSON.stringify(data, null, 2));

    // Handle top-level GraphQL errors
    if (data.errors) {
      console.error('GraphQL Errors:', data.errors);
      return NextResponse.json({ error: 'Not yet, please try again in some time.' }, { status: 500 });
    }

    // Check if we have the expected data structure
    if (!data.data || !data.data.customerCreate) {
      console.error('Unexpected response structure:', data);
      return NextResponse.json({ error: 'Not yet, please try again in some time.' }, { status: 500 });
    }

    const customerCreate = data.data.customerCreate;
    const userErrors = customerCreate.userErrors || [];

    // DETAILED LOGGING FOR DEBUGGING
    console.log('=== DETAILED SHOPIFY RESPONSE DEBUG ===');
    console.log('customerCreate exists:', !!customerCreate);
    console.log('customerCreate.customer exists:', !!customerCreate?.customer);
    console.log('userErrors:', userErrors);
    console.log('userErrors.length:', userErrors.length);
    console.log('Full customerCreate object:', customerCreate);
    console.log('=======================================');

    // Check for user errors first (these are validation errors, not system errors)
    if (userErrors.length > 0) {
      console.log('Shopify validation errors:', userErrors);
      return NextResponse.json({ error: userErrors[0].message }, { status: 400 });
    }

    // SIMPLIFIED SUCCESS CHECK - if customerCreate exists and no userErrors, it's success
    if (customerCreate) {
      console.log('✅ SUCCESS: Customer operation completed successfully');
      return NextResponse.json({ 
        success: true, 
        message: 'You are on the waitlist!',
        customer: customerCreate.customer || null
      }, { status: 201 });
    }

    // If we get here, something unexpected happened
    console.error("Unexpected Shopify Response Structure:", data);
    return NextResponse.json({ error: 'Not yet, please try again in some time.' }, { status: 500 });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Not yet, please try again in some time.' }, { status: 500 });
  }
}