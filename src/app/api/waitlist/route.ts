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

    // Handle top-level GraphQL errors
    if (data.errors) {
        console.error('GraphQL Errors:', data.errors);
        return NextResponse.json({ error: 'Failed to join waitlist.' }, { status: 500 });
    }
    
    // ==================================================================
    // THE DEFINITIVE FIX IS HERE:
    // We are now using `?.` (optional chaining) to safely check the response.
    // This prevents the code from crashing if `customerCreate` is null.
    // ==================================================================
    const customerCreate = data.data?.customerCreate;
    const userErrors = customerCreate?.userErrors;

    if (userErrors && userErrors.length > 0) {
      // This handles specific validation errors from Shopify (e.g., email taken)
      return NextResponse.json({ error: userErrors[0].message }, { status: 400 });
    }

    // If customerCreate exists and there are no errors, it's a success.
    if (customerCreate?.customer) {
        return NextResponse.json({ success: true, customer: customerCreate.customer }, { status: 201 });
    }
    
    // If we get here, something unexpected happened with Shopify's response.
    console.error("Unexpected Shopify Response:", data);
    return NextResponse.json({ error: 'An unexpected error occurred with Shopify.' }, { status: 500 });


  } catch (error) {
    // This catches errors if the API route itself crashes.
    console.error('API Route Crashed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}