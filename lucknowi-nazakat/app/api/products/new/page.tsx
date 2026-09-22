'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Image as ImageIcon } from 'lucide-react';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: 'Chicken Curry Kurta',
    category: 'Men',
    price: '3000',
    originalPrice: '12000',
    description: 'Authentic Lucknowi Handcrafted Chikankari Cotton Kurta',
    sku: 'LKN-CK-01',
    image: '',
    material: 'Pure Cotton / Chikankari',
    isNew: true,
    isBestSeller: false,
    isFeatured: false,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setImagePreview(data.url);
        setFormData((prev) => ({ ...prev, image: data.url }));
      } else {
        alert('Image upload failed!');
      }
    } catch (err) {
      alert('Error uploading image file.');
    } finally {
      setUploading(false);
    }
  };

  const handleBackNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/admin/products');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create product');
      }

      alert('Product published successfully!');
      router.push('/admin/products');
      router.refresh();
    } catch (error: any) {
      alert(error.message || 'Error publishing product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 px-4">
      <div className="flex items-center space-x-4 border-b border-gray-200 pb-4">
        <button 
          type="button"
          onClick={handleBackNavigation}
          className="flex items-center space-x-2 p-2 bg-white border border-stone-300 rounded hover:bg-stone-50 transition text-stone-800 font-semibold text-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-stone-600" />
          <span>Back to Products</span>
        </button>
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#6B1D2F]">Add New Apparel</h1>
          <p className="text-xs text-gray-500">Upload product image & publish to catalog</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-serif text-lg font-bold text-gray-800 border-b pb-3">Basic Information</h2>
          
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-[#6B1D2F] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border rounded text-sm bg-white outline-none"
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">SKU Code</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-[#6B1D2F] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-700 mb-2">
              Upload Product Image From PC
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border-2 border-dashed border-stone-300 rounded-lg bg-stone-50 hover:bg-stone-100 transition">
              {imagePreview ? (
                <div className="relative w-24 h-32 rounded border border-stone-300 overflow-hidden bg-white flex-shrink-0">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-32 rounded border border-stone-200 bg-stone-200 flex flex-col items-center justify-center text-stone-400 flex-shrink-0">
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-[10px] mt-1">No Image</span>
                </div>
              )}

              <div className="flex-1 text-center sm:text-left">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  id="image-upload-input"
                  className="hidden"
                  disabled={uploading}
                />
                <label
                  htmlFor="image-upload-input"
                  className="inline-flex items-center space-x-2 bg-[#6B1D2F] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#521624] transition shadow-sm"
                >
                  <Upload className="w-4 h-4" />
                  <span>{uploading ? 'Uploading...' : 'Choose Photo from Device'}</span>
                </label>
                <p className="text-[11px] text-stone-500 mt-2">
                  Photos will be saved to local server storage automatically[cite: 2].
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-[#6B1D2F] outline-none"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-serif text-lg font-bold text-gray-800 border-b pb-3">Pricing Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">Selling Price (₹)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-[#6B1D2F] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">Original Price (₹)</label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-[#6B1D2F] outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleBackNavigation}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded text-xs uppercase hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || uploading}
            className="px-8 py-3 bg-[#6B1D2F] text-white font-semibold rounded text-xs uppercase hover:bg-[#521624] transition shadow-md disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Publishing...' : 'Publish Product'}
          </button>
        </div>
      </form>
    </div>
  );
}