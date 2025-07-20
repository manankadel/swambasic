import { ShopifyProductsResponseBody, ShopifyProduct } from '@/types/shopify';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

// This is our main function for making API calls.
// It is now correctly typed.
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
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    const body = await result.json();

    if (body.errors) {
      throw new Error(body.errors[0].message);
    }

    return {
      status: result.status,
      body,
    };
  } catch (e) {
    throw new Error(`Shopify API call failed: ${e.message}`);
  }
}

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

// THE FIX IS HERE:
// We now tell shopifyFetch that we expect the response body to match our ShopifyProductsResponseBody interface.
// The function is also typed to return a promise of a ShopifyProduct array.
export async function getProducts(count: number): Promise<ShopifyProduct[]> {
  const res = await shopifyFetch<ShopifyProductsResponseBody>({
    query: getProductsQuery,
    variables: { first: count },
  });

  // TypeScript now knows the exact shape of res.body, so this is safe.
  return res.body.data.products.edges.map((edge) => edge.node);
}