'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Women',
    price: '',
    originalPrice: '',
    description: '',
    sku: '',
    material: 'Cotton / Chikankari',
    isNew: true,
    isBestSeller: false,
    isFeatured: false,
  });

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

      alert('Product created successfully in Database!');
      router.push('/admin/products');
      router.refresh();
    } catch (error: any) {
      alert(error.message || 'Something went wrong while publishing product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/products" className="p-2 bg-white border rounded hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#6B1D2F]">Add New Apparel</h1>
          <p className="text-xs text-gray-500">Create a new product listing in your boutique catalog.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-serif text-lg font-bold text-gray-800 border-b pb-3">Basic Information</h2>
          
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Royal White Chikankari Anarkali Set"
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
                <option value="Women">Women</option>
                <option value="Men">Men</option>
                <option value="Kids">Kids</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">SKU Code</label>
              <input
                type="text"
                placeholder="LKNZ-ANK-001"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-[#6B1D2F] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">Description</label>
            <textarea
              rows={4}
              placeholder="Describe the fabric, embroidery pattern, and elegance of this piece..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-[#6B1D2F] outline-none"
            />
          </div>
        </div>

        {/* Pricing & Fabric Details */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-serif text-lg font-bold text-gray-800 border-b pb-3">Pricing & Fabric Details</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">Selling Price (₹)</label>
              <input
                type="number"
                required
                placeholder="4999"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-[#6B1D2F] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">Original Price (₹)</label>
              <input
                type="number"
                placeholder="6999"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-[#6B1D2F] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">Material / Fabric</label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="w-full px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-[#6B1D2F] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Display Badges */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-serif text-lg font-bold text-gray-800 border-b pb-3">Display Badges</h2>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isNew}
                onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                className="w-4 h-4 text-[#6B1D2F] rounded focus:ring-[#6B1D2F]"
              />
              <span>Mark as New Arrival</span>
            </label>

            <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isBestSeller}
                onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                className="w-4 h-4 text-[#6B1D2F] rounded focus:ring-[#6B1D2F]"
              />
              <span>Mark as Bestseller</span>
            </label>

            <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 text-[#6B1D2F] rounded focus:ring-[#6B1D2F]"
              />
              <span>Feature on Homepage</span>
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/products"
            className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded text-xs uppercase tracking-wider hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-[#6B1D2F] text-white font-semibold rounded text-xs uppercase tracking-wider hover:bg-[#521624] transition-colors shadow-md disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Publish Product'}
          </button>
        </div>
      </form>
    </div>
  );
}