import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-100 text-stone-800">
      <header className="bg-[#6B1D2F] text-white p-4 shadow flex justify-between items-center">
        <h1 className="font-serif text-xl font-bold tracking-wider uppercase text-[#F3E5AB]">
          Lucknowi Nazakat Admin Panel
        </h1>
        <a href="/" className="text-xs bg-[#521624] px-3 py-1.5 rounded hover:bg-[#3D0C17] text-[#F3E5AB]">
          ← Back To Store
        </a>
      </header>
      <main className="p-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}