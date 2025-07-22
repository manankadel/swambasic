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

    // ==================================================================
    // IMPROVED ERROR HANDLING: Only fail on CRITICAL GraphQL errors
    // ==================================================================
    // Check for critical GraphQL errors (authentication, malformed query, etc.)
    if (data.errors) {
        console.error('GraphQL Errors:', data.errors);
        
        // Check if these are critical errors that prevent execution
        const hasCriticalErrors = data.errors.some((error: any) => 
            error.extensions?.code === 'ACCESS_DENIED' ||
            error.message?.includes('Parse error') ||
            error.message?.includes('Field') ||
            error.message?.includes('Unknown')
        );
        
        if (hasCriticalErrors || !data.data) {
            return NextResponse.json({ error: 'Failed to join waitlist due to a critical GraphQL error.' }, { status: 500 });
        }
        
        // If there are non-critical errors but we still got data, log them but continue
        console.warn('Non-critical GraphQL errors, but continuing since data exists:', data.errors);
    }
    
    // Check for user-specific errors returned by the mutation (e.g., "Email has already been taken")
    const userErrors = data.data?.customerCreate?.userErrors;
    if (userErrors && userErrors.length > 0) {
        console.error('Shopify User Errors:', userErrors);
        
        // Handle duplicate email case more gracefully
        const duplicateEmailError = userErrors.find((error: any) => 
            error.message?.toLowerCase().includes('taken') || 
            error.message?.toLowerCase().includes('already exists')
        );
        
        if (duplicateEmailError) {
            // For duplicate emails, we can consider this a "success" since they're already on the list
            return NextResponse.json({ 
                success: true, 
                message: 'You are already on our waitlist!' 
            }, { status: 200 });
        }
        
        // For other user errors, return them to the user
        return NextResponse.json({ error: userErrors[0].message }, { status: 400 });
    }

    // ==================================================================
    // STEP 2: THE SUCCESS CONDITION
    // Check if we actually got a customer back OR if the mutation was successful
    // ==================================================================
    const customer = data.data?.customerCreate?.customer;
    
    if (customer && customer.id) {
        // We got a customer with an ID - definite success
        return NextResponse.json({ 
            success: true, 
            customer: customer,
            message: "Successfully joined the waitlist!"
        }, { status: 200 });
    } else if (data.data?.customerCreate !== null) {
        // The mutation executed without userErrors, assume success even without customer object
        return NextResponse.json({ 
            success: true, 
            message: "Successfully joined the waitlist!"
        }, { status: 200 });
    } else {
        // Something went wrong
        console.error('Unexpected response structure:', data);
        return NextResponse.json({ error: 'Unexpected response from Shopify' }, { status: 500 });
    }

  } catch (error) {
    console.error('API Route Crashed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}