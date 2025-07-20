"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const accountNavLinks = [
  { name: 'Order History', href: '/account/orders' },
  { name: 'Profile Details', href: '/account/profile' },
  { name: 'Addresses', href: '/account/addresses' },
  { name: 'Logout', href: '/account/logout' },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-black pt-40 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-display text-5xl font-bold mb-12">Personal Hub</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Left Column: Navigation */}
          <aside className="md:col-span-1">
            <nav className="flex flex-col gap-4">
              {accountNavLinks.map(link => {
                const isActive = pathname.includes(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`font-sans uppercase tracking-wider text-sm border-l-2 pl-4 transition-colors ${
                      isActive
                        ? 'text-white border-white'
                        : 'text-white/50 border-white/20 hover:text-white hover:border-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </aside>
          {/* Right Column: Content */}
          <section className="md:col-span-3">
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}