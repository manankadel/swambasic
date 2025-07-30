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
  NewAddressInput,
  ShopifyProductDetailed, 
  ShopifyProductDetailedResponseBody
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

      // THE FIX: Instead of 'no-store', we use revalidation.
      // This tells Next.js to cache the result but consider it "stale"
      // after 600 seconds (10 minutes). The next visitor after 10 minutes
      // will trigger a fresh data fetch in the background.
      next: { revalidate: 600 }

    });

    const body = await result.json();

    if (body.errors) {
      throw new Error(body.errors[0].message);
    }

    return { status: result.status, body };

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
// Fetches a single product by its handle
const getProductByHandleQuery = `
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      descriptionHtml
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
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;


export async function getProductByHandle(handle: string): Promise<ShopifyProductDetailed | null> {
  const res = await shopifyFetch<ShopifyProductDetailedResponseBody>({
    query: getProductByHandleQuery,
    variables: { handle },
  });
  return res.body.data.product;
}


// ADD THIS ENTIRE BLOCK OF CODE TO THE END OF src/lib/shopify.ts

const getProductsDetailedQuery = `
  query getProductsDetailed($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          handle
          title
          descriptionHtml
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
          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getProductsDetailed(count: number): Promise<ShopifyProductDetailed[]> {
  const res = await shopifyFetch<{ data: { products: { edges: { node: ShopifyProductDetailed }[] } } }>({
    query: getProductsDetailedQuery,
    variables: { first: count },
  });
  return res.body.data.products.edges.map((edge) => edge.node);
}