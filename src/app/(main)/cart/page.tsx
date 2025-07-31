// src/app/(main)/cart/page.tsx

"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useCart, type Cart } from '@shopify/hydrogen-react';

type ArrayElement<T> = T extends readonly (infer U)[] ? U : T;
type CartLine = ArrayElement<Cart['lines']>;

// --- THIS IS THE FIX: The type for 'status' is now correct and matches the hook ---
type CartStatus = 'uninitialized' | 'fetching' | 'idle' | 'creating' | 'updating';

const CartLineItem = ({ 
    line,
    linesRemove,
    status 
}: { 
    line: CartLine,
    linesRemove: (lineIds: string[]) => void,
    status: CartStatus
}) => {
    return (
        <div className="flex gap-6 items-center">
            <div className="w-24 h-32 bg-white/5 rounded-md flex-shrink-0 overflow-hidden">
                {line?.merchandise?.image && (
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
                <button 
                    // --- THIS IS THE FIX: We check if line.id exists before calling the function ---
                    onClick={() => {
                        if (line?.id) {
                            linesRemove([line.id]);
                        }
                    }}
                    disabled={status === 'updating'}
                    className="text-xs font-sans text-white/50 hover:text-red-400 transition-colors mt-2 disabled:opacity-50"
                >
                    Remove
                </button>
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
  const { lines, cost, checkoutUrl, status, linesRemove } = useCart();

  // --- THIS IS THE FIX: We now check for both loading states ---
  if (status === 'uninitialized' || status === 'fetching') {
      return (
          <main className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-6">
              <h1 className="font-display text-5xl font-bold">Loading Cart...</h1>
          </main>
      );
  }

  if (!lines || lines.length === 0 || !cost) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-display text-5xl font-bold">The Canvas Is Blank.</h1>
        <Link href="/catalog">
          <button className="mt-8 px-8 py-4 bg-white text-black font-sans font-bold uppercase tracking-widest rounded-full">
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
              line ? <CartLineItem key={line.id} line={line} linesRemove={linesRemove} status={status} /> : null
            ))}
          </div>
          <div className="lg:col-span-1">
             <div className="lg:sticky top-40 p-6 rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm">
              <h2 className="font-display text-2xl font-bold">Summary</h2>
              <div className="mt-6 space-y-2 font-mono text-sm text-white/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
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
              <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" className="block text-center mt-6 w-full py-4 bg-white text-black font-sans font-bold uppercase tracking-widest rounded-full">
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