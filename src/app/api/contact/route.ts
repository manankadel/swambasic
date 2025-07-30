// src/app/api/contact/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { name, email, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }

  const adminApiToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  
  const adminApiUrl = `https://${storeDomain}/admin/api/2024-07/customers.json`;

  // We create a customer with a specific note and tag to identify them as a contact inquiry.
  // They are not subscribed to marketing.
  const customerData = {
    customer: {
      first_name: name.split(' ')[0],
      last_name: name.split(' ').slice(1).join(' ') || name.split(' ')[0], // Handle single names
      email: email,
      verified_email: false,
      note: `Contact Form Submission:\n\n${message}`,
      tags: "contact-form-inquiry",
    }
  };

  try {
    const response = await fetch(adminApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminApiToken!,
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Shopify API Error:', errorData);
        return NextResponse.json({ error: 'Failed to submit message.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Message received. We'll be in touch." }, { status: 201 });

  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}