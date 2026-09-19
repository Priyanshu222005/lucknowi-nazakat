'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: 'Gulab Taskari',
    description: 'Good Quality of Cotton',
    price: '4999',
    originalPrice: '6999',
    category: 'Men',
    imageUrl: '',
    stock: '10',
    isNewArrival: true,
    isBestSeller: false,
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const finalImage = formData.imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80';

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
          images: [finalImage],
          stock: parseInt(formData.stock),
          isNewArrival: formData.isNewArrival,
          isBestSeller: formData.isBestSeller,
        }),
      });

      if (res.ok) {
        alert('Product created successfully!');
        router.push('/admin/products');
      } else {
        const error = await res.json();
        alert(`Error: ${error.message || 'Failed to create product'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-stone-200 pb-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#6B1D2F]">Add New Apparel</h1>
            <p className="text-stone-500 text-sm mt-1">Create a new product listing in your boutique catalog.</p>
          </div>
          <Link
            href="/admin/products"
            className="p-2 border border-stone-300 rounded-lg hover:bg-stone-100 transition text-stone-700 font-semibold"
          >
            ← Back
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
            <h2 className="text-xl font-serif font-bold text-[#6B1D2F] mb-4 pb-2 border-b border-stone-100">
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 tracking-wider mb-2">
                  PRODUCT NAME
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-stone-300 rounded-lg font-semibold text-stone-900 bg-white outline-none focus:ring-2 focus:ring-[#6B1D2F]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-700 tracking-wider mb-2">
                    CATEGORY
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 border border-stone-300 rounded-lg font-semibold text-stone-900 bg-white outline-none focus:ring-2 focus:ring-[#6B1D2F]"
                  >
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Kids">Kids</option>
                    <option value="Sale">Sale</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-stone-700 tracking-wider mb-2">
                    SKU CODE
                  </label>
                  <input
                    type="text"
                    defaultValue="Lkn-09-54-54"
                    className="w-full p-3 border border-stone-300 rounded-lg font-semibold text-stone-900 bg-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 tracking-wider mb-2">
                  DESCRIPTION
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 border border-stone-300 rounded-lg font-semibold text-stone-900 bg-white outline-none focus:ring-2 focus:ring-[#6B1D2F]"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Fabric Details */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
            <h2 className="text-xl font-serif font-bold text-[#6B1D2F] mb-4 pb-2 border-b border-stone-100">
              Pricing & Fabric Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 tracking-wider mb-2">
                  SELLING PRICE (₹)
                </label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full p-3 border border-stone-300 rounded-lg font-semibold text-stone-900 bg-white outline-none focus:ring-2 focus:ring-[#6B1D2F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 tracking-wider mb-2">
                  ORIGINAL PRICE (₹)
                </label>
                <input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  className="w-full p-3 border border-stone-300 rounded-lg font-semibold text-stone-900 bg-white outline-none focus:ring-2 focus:ring-[#6B1D2F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 tracking-wider mb-2">
                  MATERIAL / FABRIC
                </label>
                <input
                  type="text"
                  defaultValue="Cotton / Chikankari"
                  className="w-full p-3 border border-stone-300 rounded-lg font-semibold text-stone-900 bg-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Product Media / Photo Upload Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
            <h2 className="text-xl font-serif font-bold text-[#6B1D2F] mb-4 pb-2 border-b border-stone-100">
              Product Photo & Media
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 tracking-wider mb-2">
                  Upload Photo From Device
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full p-2 border border-stone-300 rounded-lg font-semibold text-stone-900 bg-white cursor-pointer"
                />
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-stone-200"></div>
                <span className="flex-shrink mx-4 text-xs uppercase font-bold text-stone-400">OR Image URL</span>
                <div className="flex-grow border-t border-stone-200"></div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 tracking-wider mb-2">
                  IMAGE URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full p-3 border border-stone-300 rounded-lg font-semibold text-stone-900 bg-white outline-none focus:ring-2 focus:ring-[#6B1D2F]"
                />
              </div>

              {formData.imageUrl && (
                <div className="mt-4">
                  <p className="text-xs font-bold uppercase text-stone-500 mb-2">Photo Preview:</p>
                  <div className="w-32 h-40 relative rounded-lg border border-stone-300 overflow-hidden shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#6B1D2F] hover:bg-[#521624] text-[#D4AF37] px-8 py-3 rounded-lg font-bold transition shadow-md disabled:opacity-50"
            >
              {loading ? 'Publishing Product...' : 'Publish Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}