"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const accountNavLinks = [
  { name: 'Order History', href: '/account/orders' },
  { name: 'Profile Details', href: '/account/profile' },
  { name: 'Addresses', href: '/account/addresses' },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Logout ka function
  const handleLogout = async () => {
    try {
      // API call to delete the cookie
      await fetch('/api/auth/logout', { method: 'POST' });
      // Redirect to login page
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <main className="min-h-screen bg-black pt-40 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-8 md:mb-12">Personal Hub</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
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
              {/* Yeh hai Logout button */}
              <button
                onClick={handleLogout}
                className="text-left font-sans uppercase tracking-wider text-sm border-l-2 pl-4 transition-colors text-white/50 border-white/20 hover:text-white hover:border-white"
              >
                Logout
              </button>
            </nav>
          </aside>
          <section className="md:col-span-3">
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}