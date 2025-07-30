// src/app/(main)/cart/page.tsx

"use client";
import Link from 'next/link';
import Image from 'next/image';
// 1. IMPORT `useCart` and the main `Cart` type.
import { useCart, type Cart } from '@shopify/hydrogen-react';

// === THE DEFINITIVE TYPE FIX ===
// 2. The `lines` property is a DIRECT ARRAY. There is no `.nodes`.
// This is the correct way to get the type of a single cart line.
type ArrayElement<T> = T extends readonly (infer U)[] ? U : T;
type CartLine = ArrayElement<Cart['lines']>;

const CartLineItem = ({ line }: { line: CartLine }) => {
    return (
        <div className="flex gap-6 items-center">
            <div className="w-24 h-32 bg-white/5 rounded-md flex-shrink-0 overflow-hidden">
                {line && line.merchandise && line.merchandise.image && (
                    <Image
                        src={line.merchandise.image.url ?? ""}
                        alt={line.merchandise.image.altText || line.merchandise.product?.title || ""}
                        width={96}
                        height={128}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>
            <div className="flex-grow">
                <h3 className="font-sans font-semibold">{line?.merchandise?.product?.title ?? ""}</h3>
                <p className="font-sans text-sm text-white/50">
                    {line?.merchandise?.title}
                </p>
            </div>
            <div className="font-mono text-center">
                {line ? `x${line.quantity}` : null}
            </div>
            <div className="font-mono text-lg text-right">
                ${parseFloat(line?.cost?.totalAmount?.amount ?? "0").toFixed(2)}
            </div>
        </div>
    );
};


const CartPage = () => {
  const { lines, cost, checkoutUrl, status } = useCart();

  if (status === 'fetching') {
      return (
          <main className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-6">
              <h1 className="font-display text-5xl font-bold">Loading Cart...</h1>
          </main>
      );
  }

  // 3. THE ROBUST EMPTY CART CHECK
  if (!lines || lines.length === 0 || !cost) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-display text-5xl font-bold">The Canvas Is Blank.</h1>
        <Link href="/catalog">
          <button className="mt-8 px-8 py-4 bg-white text-black font-sans font-bold uppercase tracking-widest">
            Discover The Collection
          </button>
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black pt-40 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-display text-5xl font-bold mb-12">Your Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 flex flex-col gap-6">
            {lines.map(line => (
              line ? <CartLineItem key={line.id} line={line} /> : null
            ))}
          </div>
          <div className="lg:col-span-1">
             <div className="lg:sticky top-40 p-6 rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm">
              <h2 className="font-display text-2xl font-bold">Summary</h2>
              <div className="mt-6 space-y-2 font-mono text-sm text-white/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  {/* Because of the robust check above, `cost` is guaranteed to exist here. */}
                  <span>${parseFloat(cost.subtotalAmount?.amount ?? "0").toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-xs">Calculated at next step</span>
                </div>
              </div>
              <div className="mt-6 border-t border-white/10 pt-4 flex justify-between font-mono font-bold">
                <span>Total</span>
                <span>${parseFloat(cost.totalAmount?.amount ?? "0").toFixed(2)}</span>
              </div>
              <a 
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center mt-6 w-full py-4 bg-white text-black font-sans font-bold uppercase tracking-widest"
              >
                Proceed to Checkout
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CartPage;