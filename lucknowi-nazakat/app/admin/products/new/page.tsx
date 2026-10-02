'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Kurtis',
    description: '',
    imageUrl: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      } else {
        alert('Image upload failed!');
      }
    } catch (err) {
      console.error('Upload Error:', err);
      alert('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          category: formData.category,
          description: formData.description,
          image: formData.imageUrl || '/images/placeholder.jpg',
          imageUrl: formData.imageUrl || '/images/placeholder.jpg',
          stock: 10,
          inStock: true,
        }),
      });

      if (res.ok) {
        alert('Product added successfully!');
        router.push('/admin/products');
        router.refresh();
      } else {
        alert('Failed to add product.');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error saving product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#6B1D2F]">
            Add New Product
          </h1>
          <p className="text-xs text-stone-500">
            Create a new Lucknowi Chikankari item in database
          </p>
        </div>
        <Link
          href="/admin/products"
          className="text-xs font-bold text-[#6B1D2F] uppercase tracking-wider hover:underline"
        >
          ← Back to Manage Products
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-stone-200 p-6 md:p-8 shadow-sm space-y-5"
      >
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
            Product Title *
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Georgette Hand-Embroidered Kurti"
            className="w-full text-xs p-3 border border-stone-300 rounded-lg focus:outline-none focus:border-[#6B1D2F]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Price (INR) *
            </label>
            <input
              type="number"
              name="price"
              required
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. 2499"
              className="w-full text-xs p-3 border border-stone-300 rounded-lg focus:outline-none focus:border-[#6B1D2F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full text-xs p-3 border border-stone-300 rounded-lg focus:outline-none focus:border-[#6B1D2F] bg-white"
            >
              <option value="Kurtis">Kurtis</option>
              <option value="Sarees">Sarees</option>
              <option value="Men Wear">Men Wear</option>
              <option value="Dupattas">Dupattas</option>
              <option value="Unstitched Suit">Unstitched Suit</option>
            </select>
          </div>
        </div>

        {/* File Upload Field */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
            Product Image Upload
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="w-full text-xs p-2 border border-stone-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#6B1D2F] file:text-white hover:file:bg-[#521624]"
          />
          {uploading && (
            <p className="text-[11px] text-amber-600 mt-1 font-medium">
              Uploading image to server...
            </p>
          )}

          {formData.imageUrl && (
            <div className="mt-3 flex items-center gap-3 bg-stone-50 p-2 rounded border border-stone-200">
              <div className="relative w-12 h-12 rounded overflow-hidden bg-stone-200">
                <Image
                  src={formData.imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold truncate">
                Image Uploaded Successfully!
              </span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Authentic Lucknowi hand-embroidered details..."
            className="w-full text-xs p-3 border border-stone-300 rounded-lg focus:outline-none focus:border-[#6B1D2F]"
          />
        </div>

        <div className="pt-3">
          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-[#6B1D2F] hover:bg-[#521624] text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded-lg shadow transition disabled:opacity-50"
          >
            {loading ? 'Saving to Database...' : 'Save & Publish Product'}
          </button>
        </div>
      </form>
    </div>
  );
}