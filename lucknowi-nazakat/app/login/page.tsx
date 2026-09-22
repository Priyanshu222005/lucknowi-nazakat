'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        alert(`Welcome back, ${data.user.name}!`);
        if (data.user.role === 'ADMIN') {
          router.push('/admin/products');
        } else {
          router.push('/account');
        }
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-[#6B1D2F]">Customer Login</h2>
          <p className="text-stone-500 text-sm mt-1">Access your Lucknowi Nazakat account</p>
        </div>

        {error && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-lg text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-700 mb-2">Email Address</label>
            <input
              type="email"
              required
              placeholder="ananya@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 border border-stone-300 rounded-lg text-stone-900 bg-white font-semibold outline-none focus:ring-2 focus:ring-[#6B1D2F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-stone-700 mb-2">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-3 border border-stone-300 rounded-lg text-stone-900 bg-white font-semibold outline-none focus:ring-2 focus:ring-[#6B1D2F]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6B1D2F] hover:bg-[#521624] text-[#D4AF37] py-3.5 rounded-lg font-bold transition shadow-md disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-stone-500 mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-[#6B1D2F] font-bold underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}