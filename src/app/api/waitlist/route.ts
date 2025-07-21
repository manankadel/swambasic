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

    const responseText = await response.text();

    // First, check if the response is even valid JSON
    let data;
    try {
        data = JSON.parse(responseText);
    } catch (e) {
        console.error("Failed to parse Shopify response as JSON:", responseText);
        return NextResponse.json({ error: 'Invalid response from Shopify.' }, { status: 500 });
    }
    
    // ==================================================================
    // STEP 1: LOG THE RESPONSE
    // This will print the full Shopify response into your Vercel logs.
    // ==================================================================
    console.log("SHOPIFY_API_RESPONSE:", JSON.stringify(data, null, 2));


    // Check for top-level GraphQL errors that indicate a problem with the query itself
    if (data.errors) {
        console.error('GraphQL Errors:', data.errors);
        return NextResponse.json({ error: 'Failed to join waitlist due to a GraphQL error.' }, { status: 500 });
    }
    
    // Check for user-specific errors returned by the mutation (e.g., "Email has already been taken")
    const userErrors = data.data?.customerCreate?.userErrors;
    if (userErrors && userErrors.length > 0) {
        console.error('Shopify User Errors:', userErrors);
        return NextResponse.json({ error: userErrors[0].message }, { status: 400 });
    }

    // ==================================================================
    // STEP 2: THE NEW SUCCESS CONDITION
    // If we have passed all the error checks, we can confidently say it was a success.
    // ==================================================================
    return NextResponse.json({ success: true, customer: data.data?.customerCreate?.customer || 'Customer created' }, { status: 201 });

  } catch (error) {
    console.error('API Route Crashed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}