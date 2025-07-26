// src/app/(main)/catalog/page.tsx

import { getProducts } from '@/lib/shopify';
import { ProductCard } from '@/components/modules/products/ProductCard';

// This is a Server Component, so it can be async and fetch data directly.
export default async function CatalogPage() {
  
  // Fetch all available products. We'll fetch the first 24 for this example.
  // You can implement pagination later if you have more.
  const products = await getProducts(24);

  return (
    <main className="min-h-screen bg-black pt-40 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
            <h1 className="font-display text-5xl md:text-6xl font-bold">The Collection</h1>
            <p className="font-sans text-white/60 mt-4 max-w-xl mx-auto">
                Explore the complete inaugural collection. A study in form, function, and perspective.
            </p>
        </div>

        {/* Responsive grid for the products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </div>
    </main>
  );
}