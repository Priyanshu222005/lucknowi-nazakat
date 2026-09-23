'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      document.cookie = 'admin_token=authenticated_admin; path=/';
      window.location.href = '/admin/orders';
    } else {
      setError('Galat Password! Kripya sahi password enter karein.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      <main className="max-w-md mx-auto px-4 py-16 flex-1 w-full">
        <div className="bg-white p-8 border border-stone-200 rounded-lg shadow-sm">
          <h1 className="font-serif text-2xl font-bold text-[#6B1D2F] mb-2 text-center">
            Admin Control Center
          </h1>
          <p className="text-xs text-stone-500 text-center mb-6">
            Lucknowi Nazakat Store Management Access
          </p>

          {error && (
            <div className="mb-4 text-xs bg-rose-50 text-rose-700 p-2.5 rounded border border-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">
                Admin Access Key / Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full text-xs p-2.5 border border-stone-300 rounded focus:outline-none focus:border-[#6B1D2F]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#6B1D2F] text-white py-3 rounded text-xs font-bold uppercase hover:bg-[#521624] transition cursor-pointer"
            >
              Login to Admin Panel
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}