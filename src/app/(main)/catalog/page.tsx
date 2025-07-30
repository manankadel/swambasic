// src/app/(main)/catalog/page.tsx

import { getProductsDetailed } from '@/lib/shopify'; // <-- Use the detailed function
import { CatalogClientWrapper } from '@/components/modules/catalog/CatalogClientWrapper';
import { ShopifyProductDetailed } from '@/types/shopify';

export const dynamic = 'force-dynamic';

export default async function CatalogPage() {
  
  // This now fetches the DETAILED products that the wrapper needs.
  const products: ShopifyProductDetailed[] = await getProductsDetailed(10); 

  return (
    <main className="relative min-h-screen w-full">
        <CatalogClientWrapper products={products} />
    </main>
  );
}