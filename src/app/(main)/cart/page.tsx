"use client";
import Link from 'next/link';
import Image from 'next/image';

// Placeholder data - we will replace this with real cart items from Shopify
const placeholderCartItems = [
  { id: 1, name: 'Obsidian Hoodie', variant: 'Size L', price: '250.00', quantity: 1, image: '/placeholder-product.png' },
  { id: 2, name: 'Onyx Tee', variant: 'Size L', price: '120.00', quantity: 1, image: '/placeholder-product.png' },
];

// Set this to true to see the filled cart, or false to see the empty state
const hasItems = true; 

const CartPage = () => {
  if (!hasItems) {
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Section: Cart Items */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {placeholderCartItems.map(item => (
              <div key={item.id} className="flex gap-6 items-center">
                <div className="w-24 h-32 bg-white/5 rounded-md flex-shrink-0">
                  {/* <Image src={item.image} alt={item.name} /> */}
                </div>
                <div className="flex-grow">
                  <h3 className="font-sans font-semibold">{item.name}</h3>
                  <p className="font-sans text-sm text-white/50">{item.variant}</p>
                </div>
                <div className="font-mono text-center">
                  {/* Quantity Selector - To be made functional later */}
                  x{item.quantity}
                </div>
                <div className="font-mono text-lg text-right">
                  ${item.price}
                </div>
              </div>
            ))}
          </div>

          {/* Right Section: Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-40 p-6 rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm">
              <h2 className="font-display text-2xl font-bold">Summary</h2>
              <div className="mt-6 space-y-2 font-mono text-sm text-white/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>$370.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-xs">Calculated at next step</span>
                </div>
              </div>
              <div className="mt-6 border-t border-white/10 pt-4 flex justify-between font-mono font-bold">
                <span>Total</span>
                <span>$370.00</span>
              </div>
              <button className="mt-6 w-full py-4 bg-white text-black font-sans font-bold uppercase tracking-widest">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CartPage;