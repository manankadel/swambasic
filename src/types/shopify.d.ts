// src/types/shopify.d.ts

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

export interface ShopifyProductsResponseBody {
  data: {
    products: {
      edges: {
        node: ShopifyProduct;
      }[];
    };
  };
}

// === CUSTOMER AUTH TYPES ===

export interface CustomerUserError {
  code: string;
  field: string[];
  message: string;
}

interface CustomerAccessToken {
  accessToken: string;
  expiresAt: string;
}

export interface CustomerCreatePayload {
  customerUserErrors: CustomerUserError[];
  customer?: {
    id: string;
  };
}

export interface CustomerLoginPayload {
    customerUserErrors: CustomerUserError[];
    customerAccessToken?: CustomerAccessToken;
}

export interface ShopifyCustomerCreateResponseBody {
    data: {
        customerCreate: CustomerCreatePayload;
    }
}

export interface ShopifyCustomerLoginResponseBody {
    data: {
        customerAccessTokenCreate: CustomerLoginPayload;
    }
}

// === CUSTOMER DATA TYPES ===

export interface ShopifyOrder {
    id: string;
    orderNumber: number;
    processedAt: string;
    financialStatus: string;
    totalPriceV2: {
        amount: string;
        currencyCode: string;
    };
}

export interface ShopifyAddress {
    id: string;
    address1: string;
    address2: string | null;
    city: string;
    province: string;
    zip: string;
    country: string;
}

export interface ShopifyCustomer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    addresses: {
        edges: { node: ShopifyAddress }[];
    };
    orders: {
        edges: { node: ShopifyOrder }[];
    };
}

export interface ShopifyCustomerDataResponseBody {
    data: {
        customer: ShopifyCustomer | null;
    }
}

// === CUSTOMER MANAGEMENT TYPES ===

export interface ShopifyCustomerUpdateResponseBody {
    data: {
        customerUpdate: {
            customer: {
                id: string;
                firstName: string;
                lastName: string;
            };
            customerUserErrors: any[];
        }
    }
}

export interface ShopifyAddressCreateResponseBody {
    data: {
        customerAddressCreate: {
            customerAddress: { id: string } | null;
            customerUserErrors: any[];
        }
    }
}

// This is the input type for creating a new address
export interface NewAddressInput {
    address1: string;
    address2?: string;
    city: string;
    province: string;
    country: string;
    zip: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyPrice;
}

export interface ShopifyProductDetailed extends ShopifyProduct {
  descriptionHtml: string;
  images: {
    edges: {
      node: ShopifyImage;
    }[];
  };
  variants: {
    edges: {
      node: ShopifyProductVariant;
    }[];
  };
}

export interface ShopifyProductDetailedResponseBody {
  data: {
    product: ShopifyProductDetailed | null;
  }
}