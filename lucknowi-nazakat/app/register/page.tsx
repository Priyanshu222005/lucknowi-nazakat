'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        alert('Account created successfully!');
        router.push('/login');
      } else {
        alert(data.error || 'Registration failed.');
      }
    } catch (err) {
      alert('Something went wrong during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white p-8 rounded-lg border border-stone-200 shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <h1 className="font-serif text-2xl font-bold text-[#6B1D2F]">Create Account</h1>
            <p className="text-xs text-stone-500">Join Lucknowi Nazakat</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="w-full border border-stone-300 rounded p-2.5 text-xs focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full border border-stone-300 rounded p-2.5 text-xs focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full border border-stone-300 rounded p-2.5 text-xs focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6B1D2F] text-white py-3 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#521624] transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Register'}
            </button>
          </form>

          <p className="text-center text-xs text-stone-600">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-[#6B1D2F] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}