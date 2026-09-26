'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Product {
  id?: string;
  _id?: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  stock: number;
  description?: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form States
  const [name, setName] = useState('');
  const [price, setPrice] = useState('2499');
  const [category, setCategory] = useState('Kurtis');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState('10');
  const [description, setDescription] = useState('');

  // 1. Fetch Products List
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
      else if (data.products) setProducts(data.products);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Add New Product Handler
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price,
          category,
          image: image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
          stock,
          description,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert('🎉 Product successfully publish ho gaya!');
        setName('');
        setImage('');
        setDescription('');
        fetchProducts();
      } else {
        alert('Product upload error: ' + (data.error || 'Server Error'));
      }
    } catch (err) {
      alert('Upload request fail ho gaya.');
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Delete Handler — uses id/_id as primary identifier, falls back to name
  const handleDeleteProduct = async (product: Product) => {
    const identifier = product.id || product._id || product.name;

    if (!identifier) {
      alert('Error: Could not determine which product to delete.');
      return;
    }

    const confirmed = confirm(`Kya aap "${product.name}" ko hamesha ke liye remove karna chahte hain?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/products/${encodeURIComponent(identifier)}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete product.');
      }

      alert('✅ Product successfully remove ho gaya!');
      await fetchProducts();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred.';
      console.error('Delete request failed:', message);
      alert(`Delete fail: ${message}`);
    }
  };

  // 4. Stock Toggle Handler — uses id/_id as primary identifier, falls back to name
  const handleToggleStock = async (product: Product) => {
    const identifier = product.id || product._id || product.name;

    if (!identifier) {
      alert('Error: Could not determine which product to update.');
      return;
    }

    const newStock = product.stock > 0 ? 0 : 10;

    try {
      const res = await fetch(`/api/products/${encodeURIComponent(identifier)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update stock.');
      }

      await fetchProducts();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred.';
      console.error('Stock update failed:', message);
      alert(`Stock update fail: ${message}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-10 flex-1 w-full space-y-10">
        <h1 className="font-serif text-3xl font-bold text-[#6B1D2F]">Admin Product Management</h1>

        {/* Form Section: Add New Product */}
        <div className="bg-white p-6 md:p-8 rounded-lg border border-stone-200 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-stone-800 border-b pb-3 mb-6">
            Add New Lucknowi Collection
          </h2>

          <form onSubmit={handleAddProduct} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Handcrafted White Chikankari Kurti"
                className="w-full border border-stone-300 rounded p-2.5 text-xs focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border border-stone-300 rounded p-2.5 text-xs focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-stone-300 rounded p-2.5 text-xs focus:outline-none focus:border-[#6B1D2F]"
                >
                  <option value="Kurtis">Kurtis</option>
                  <option value="Sarees">Sarees</option>
                  <option value="Dupattas">Dupattas</option>
                  <option value="Lehenga">Lehenga</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                Product Image URL *
              </label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full border border-stone-300 rounded p-2.5 text-xs focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full border border-stone-300 rounded p-2.5 text-xs focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Fabric details, embroidery style..."
                className="w-full border border-stone-300 rounded p-2.5 text-xs focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#6B1D2F] text-white py-3.5 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#521624] transition disabled:opacity-50 cursor-pointer shadow"
            >
              {submitting ? 'Publishing...' : 'Publish Product'}
            </button>
          </form>
        </div>

        {/* Existing Products List Section */}
        <div className="bg-white p-6 md:p-8 rounded-lg border border-stone-200 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-stone-800 border-b pb-3 mb-6">
            All Added Products ({products.length})
          </h2>

          {loading ? (
            <p className="text-xs text-stone-500 py-4">Loading products list...</p>
          ) : products.length === 0 ? (
            <p className="text-xs text-stone-500 py-4">Abhi koi products add nahi hain.</p>
          ) : (
            <div className="divide-y divide-stone-200">
              {products.map((prod, index) => (
                <div
                  key={prod.id || prod._id || index}
                  className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={prod.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800'}
                      alt={prod.name}
                      className="w-16 h-16 object-cover rounded border border-stone-200"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800';
                      }}
                    />
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm">{prod.name}</h3>
                      <p className="text-xs text-stone-500">
                        ₹{prod.price} | Category: <span className="font-semibold">{prod.category}</span>
                      </p>
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mt-1 ${
                          prod.stock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {prod.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => handleToggleStock(prod)}
                      className={`px-3 py-2 rounded text-xs font-bold transition cursor-pointer ${
                        prod.stock > 0
                          ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                          : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                      }`}
                    >
                      {prod.stock > 0 ? 'Mark Out of Stock' : 'Mark In Stock'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(prod)}
                      className="bg-rose-600 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-rose-700 transition cursor-pointer shadow"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}