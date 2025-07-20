// Defines the structure of the data we expect back from the Storefront API

interface ShopifyImage {
  url: string;
  altText: string;
  width: number;
  height: number;
}

interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  priceRange: {
    minVariantPrice: ShopifyPrice;
  };
  featuredImage: ShopifyImage;
}

// Defines the structure of the entire API response body for the products query
export interface ShopifyProductsResponseBody {
  data: {
    products: {
      edges: {
        node: ShopifyProduct;
      }[];
    };
  };
}