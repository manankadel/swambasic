// src/app/(main)/layout.tsx
"use client";
import { Header } from "@/components/core/Header";
import { Footer } from "@/components/core/Footer";
import { CartProvider, ShopifyProvider } from '@shopify/hydrogen-react';
import { CartToast } from '@/hooks/useCartNotification'; // Import the new toast component

export default function MainLayout({ children }: { children: React.ReactNode; }) {
  return (
    <ShopifyProvider
      storeDomain={process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!}
      storefrontToken={process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!}
      storefrontApiVersion="2024-07"
      countryIsoCode="US"
      languageIsoCode="EN"
    >
      <CartProvider>
        <div>
          <Header />
          {children}
          <Footer />
          <CartToast /> {/* Add the global toast component here */}
        </div>
      </CartProvider>
    </ShopifyProvider>
  );
}