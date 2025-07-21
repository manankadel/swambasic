import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // 1. Extract both email and the new phone field
  const { email, phone } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  // 2. Prepare the data for Shopify
  const adminApiToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  
  // ==================================================================
  // THE FIX IS HERE: Changed the API version to the stable '2024-04'.
  // ==================================================================
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

  // 3. Make the API call
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

    // 4. Handle response
    if (data.errors) {
        console.error('GraphQL Errors:', data.errors);
        return NextResponse.json({ error: 'Failed to join waitlist.' }, { status: 500 });
    }
    
    const userErrors = data.data.customerCreate.userErrors;
    if (userErrors && userErrors.length > 0) {
      return NextResponse.json({ error: userErrors[0].message }, { status: 400 });
    }

    // 5. Success
    return NextResponse.json({ success: true, customer: data.data.customerCreate.customer }, { status: 201 });

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}