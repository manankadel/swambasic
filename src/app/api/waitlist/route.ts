import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // 1. Extract the email from the request body
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  // 2. Prepare the data for the Shopify Admin API
  const adminApiToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const adminApiUrl = `https://${storeDomain}/admin/api/2025-07/graphql.json`;

  // This is the GraphQL mutation to create a new customer with tags
  const mutation = {
    query: `
      mutation customerCreate($input: CustomerInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
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
        tags: ["waitlist", "pre-launch"], // The required tags
      },
    },
  };

  // 3. Make the secure server-to-server API call
  try {
    const response = await fetch(adminApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminApiToken!, // The '!' asserts that the token exists
      },
      body: JSON.stringify(mutation),
    });

    const data = await response.json();

    // 4. Handle Shopify's response
    if (data.errors) {
        // This handles GraphQL-level errors
        console.error('GraphQL Errors:', data.errors);
        return NextResponse.json({ error: 'Failed to create customer in Shopify.' }, { status: 500 });
    }
    
    const userErrors = data.data.customerCreate.userErrors;
    if (userErrors && userErrors.length > 0) {
      // This handles validation errors like an email already being taken
      return NextResponse.json({ error: userErrors[0].message }, { status: 400 });
    }

    // 5. Success!
    return NextResponse.json({ success: true, customer: data.data.customerCreate.customer }, { status: 201 });

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}