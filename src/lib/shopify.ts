// src/lib/shopify.ts

import { 
  ShopifyProductsResponseBody, 
  ShopifyProduct,
  ShopifyCustomerLoginResponseBody,
  CustomerLoginPayload,
  ShopifyCustomerDataResponseBody,
  ShopifyCustomer,
  ShopifyAddressCreateResponseBody,
  ShopifyCustomerUpdateResponseBody,
  NewAddressInput
} from '@/types/shopify';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

// The core function to communicate with Shopify's GraphQL API
async function shopifyFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<{ status: number; body: T }> {
  try {
    const endpoint = `https://${domain}/api/2024-07/graphql.json`;

    const result = await fetch(endpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken 
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
    });

    const body = await result.json();

    if (body.errors) {
      throw new Error(body.errors[0].message);
    }

    return { status: result.status, body }; // This return statement is crucial

  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Shopify API call failed: ${e.message}`);
    }
    throw new Error('An unknown error occurred during the Shopify API call.');
  }
}

// Fetches a list of products
const getProductsQuery = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          handle
          title
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;
export async function getProducts(count: number): Promise<ShopifyProduct[]> {
  const res = await shopifyFetch<ShopifyProductsResponseBody>({
    query: getProductsQuery,
    variables: { first: count },
  });
  return res.body.data.products.edges.map((edge) => edge.node);
}

// Logs a customer in by creating an access token
const customerLoginMutation = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerUserErrors { code field message }
      customerAccessToken { accessToken expiresAt }
    }
  }
`;
export async function loginCustomer(input: Record<string, unknown>): Promise<CustomerLoginPayload> {
    const res = await shopifyFetch<ShopifyCustomerLoginResponseBody>({
        query: customerLoginMutation,
        variables: { input }
    });
    return res.body.data.customerAccessTokenCreate;
}

// Fetches the full data for an authenticated customer
const getCustomerQuery = `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      addresses(first: 10) {
        edges { node { id address1 address2 city province zip country } }
      }
      orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
        edges { node { id orderNumber processedAt financialStatus totalPriceV2 { amount currencyCode } } }
      }
    }
  }
`;
export async function getCustomer(customerAccessToken: string): Promise<ShopifyCustomer | null> {
    const res = await shopifyFetch<ShopifyCustomerDataResponseBody>({
        query: getCustomerQuery,
        variables: { customerAccessToken }
    });
    return res.body.data.customer;
}

// Updates a customer's profile details
const customerUpdateMutation = `
  mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer { id firstName lastName }
      customerUserErrors { code field message }
    }
  }
`;
export async function updateCustomer(token: string, customerData: { firstName: string, lastName: string }): Promise<any> {
    const res = await shopifyFetch<ShopifyCustomerUpdateResponseBody>({
        query: customerUpdateMutation,
        variables: {
            customerAccessToken: token,
            customer: customerData
        }
    });
    return res.body.data.customerUpdate;
}

// Creates a new address for an authenticated customer
const customerAddressCreateMutation = `
  mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
    customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
      customerAddress { id }
      customerUserErrors { code field message }
    }
  }
`;
export async function createCustomerAddress(token: string, address: NewAddressInput): Promise<any> {
    const res = await shopifyFetch<ShopifyAddressCreateResponseBody>({
        query: customerAddressCreateMutation,
        variables: {
            customerAccessToken: token,
            address: address
        }
    });
    return res.body.data.customerAddressCreate;
}