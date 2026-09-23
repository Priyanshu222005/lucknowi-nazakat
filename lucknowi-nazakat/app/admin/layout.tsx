import React from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-100 text-stone-800">
      <header className="bg-[#6B1D2F] text-white p-4 shadow flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="font-serif text-xl font-bold tracking-wider uppercase text-[#F3E5AB]">
          Lucknowi Nazakat Admin Panel
        </h1>

        <nav className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wide text-[#F3E5AB]">
          <Link href="/admin/orders" className="hover:underline hover:text-white transition-colors">
            Orders
          </Link>
          <Link href="/admin/products" className="hover:underline hover:text-white transition-colors">
            Products
          </Link>
          <Link href="/admin/coupons" className="hover:underline hover:text-white transition-colors">
            Coupons
          </Link>
        </nav>

        <Link href="/" className="text-xs bg-[#521624] px-3 py-1.5 rounded hover:bg-[#3D0C17] text-[#F3E5AB]">
          ← Back To Store
        </Link>
      </header>
      <main className="p-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}