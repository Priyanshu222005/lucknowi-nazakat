'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      name: 'Priyanshu',
      phone: '+91 9876543210',
      address: 'Hazratganj Main Market',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      pincode: '226001',
      isDefault: true,
    },
  ]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-stone-200 pb-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#6B1D2F]">Saved Addresses</h1>
            <p className="text-stone-500 text-sm mt-1">Manage delivery locations for quick orders</p>
          </div>
          <Link href="/account" className="text-stone-600 hover:text-[#6B1D2F] font-semibold text-sm transition">
            ← Back to Account
          </Link>
        </div>

        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-stone-900">{addr.name}</h3>
                  {addr.isDefault && (
                    <span className="bg-[#6B1D2F] text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-stone-600 text-sm mt-2">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                <p className="text-stone-500 text-xs mt-1">Phone: {addr.phone}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}