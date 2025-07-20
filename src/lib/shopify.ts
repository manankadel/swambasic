import { ShopifyProductsResponseBody, ShopifyProduct } from '@/types/shopify';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

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
    // THE FIX IS HERE.
    // We now check if 'e' is an instance of Error before accessing e.message.
    if (e instanceof Error) {
        throw new Error(`Shopify API call failed: ${e.message}`);
    }
    // If it's not a standard Error object, we handle it gracefully.
    throw new Error('An unknown error occurred during the Shopify API call.');
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

export async function getProducts(count: number): Promise<ShopifyProduct[]> {
  const res = await shopifyFetch<ShopifyProductsResponseBody>({
    query: getProductsQuery,
    variables: { first: count },
  });
  return res.body.data.products.edges.map((edge) => edge.node);
}