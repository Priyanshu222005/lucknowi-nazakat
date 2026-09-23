'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'KURTIS',
    image: '',
    stock: '10',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (res.ok && result.url) {
        setFormData((prev) => ({ ...prev, image: result.url }));
        alert('✅ Image upload ho gayi!');
      } else {
        alert('Image upload nahi ho paayi.');
      }
    } catch (err) {
      console.error(err);
      alert('Upload error.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      alert('Kripya pehle product photo upload karein!');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock, 10),
        }),
      });

      if (res.ok) {
        alert('✨ Naya product photo ke sath store par publish ho gaya!');
        window.location.href = '/shop';
      } else {
        alert('Product add karne mein dikkat aayi.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-10 flex-1 w-full">
        <div className="bg-white border border-stone-200 rounded-lg p-8 shadow-sm">
          <h1 className="font-serif text-2xl font-bold text-[#6B1D2F] mb-6 text-center">
            Add New Lucknowi Collection
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Royal Chanderi Silk Chikankari Kurti"
                className="w-full text-xs p-2.5 border border-stone-300 rounded focus:outline-none focus:border-[#6B1D2F]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="3500"
                  className="w-full text-xs p-2.5 border border-stone-300 rounded focus:outline-none focus:border-[#6B1D2F]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded bg-white focus:outline-none focus:border-[#6B1D2F]"
                >
                  <option value="KURTIS">Kurtis</option>
                  <option value="SAREES">Sarees</option>
                  <option value="SUITS">Suits</option>
                  <option value="DUPATTAS">Dupattas</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">
                Product Image * {uploading && <span className="text-amber-600 font-normal">(Uploading...)</span>}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full text-xs p-2 border border-stone-300 rounded file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#6B1D2F] file:text-white hover:file:bg-[#521624]"
              />
              {formData.image && (
                <div className="mt-2 text-xs text-emerald-700 font-bold flex items-center gap-2">
                  <span>✓ Photo Uploaded:</span>
                  <span className="text-stone-500 font-normal">{formData.image}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Stock Quantity</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full text-xs p-2.5 border border-stone-300 rounded focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Description</label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Fabric details, embroidery style..."
                className="w-full text-xs p-2.5 border border-stone-300 rounded focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>

            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full bg-[#6B1D2F] text-white py-3 rounded text-xs font-bold uppercase hover:bg-[#521624] transition cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Product to Store'}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AddProductPage;