'use client';

import React, { useState, useEffect } from 'react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
      else if (data.products) setProducts(data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete Product Handler
  const handleDelete = async (id: string) => {
    if (!confirm('Kya aap is product ko permanent remove karna chahte hain?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        alert('✅ Product successfully removed!');
        fetchProducts();
      } else {
        alert('Delete error: ' + (data.error || 'Failed to remove'));
      }
    } catch (err) {
      alert('Delete request fail ho gaya.');
    }
  };

  // Stock Toggle Handler (In Stock / Out of Stock)
  const handleToggleStock = async (product: any) => {
    const newStockStatus = product.stock > 0 ? 0 : 10; // 0 = Out of Stock, 10 = In Stock

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStockStatus }),
      });
      const data = await res.json();

      if (data.success) {
        fetchProducts();
      } else {
        alert('Stock update fail: ' + data.error);
      }
    } catch (err) {
      alert('Update request fail ho gaya.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#FAF9F6] min-h-screen">
      <h1 className="font-serif text-3xl font-bold text-[#6B1D2F] mb-6">Admin Panel - Manage Products</h1>

      <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm">
        <h2 className="text-lg font-bold text-stone-800 mb-4">All Products ({products.length})</h2>

        {loading ? (
          <p className="text-xs text-stone-500">Loading products...</p>
        ) : (
          <div className="space-y-4">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="flex items-center justify-between border-b pb-3 pt-2 gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={prod.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800'}
                    alt={prod.name}
                    className="w-14 h-14 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800';
                    }}
                  />
                  <div>
                    <p className="font-bold text-stone-900 text-sm">{prod.name}</p>
                    <p className="text-xs text-stone-500">₹{prod.price} | Category: {prod.category}</p>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded mt-1 inline-block ${
                        prod.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {prod.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStock(prod)}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                      prod.stock > 0
                        ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                        : 'bg-green-100 text-green-900 hover:bg-green-200'
                    }`}
                  >
                    {prod.stock > 0 ? 'Mark Out of Stock' : 'Mark In Stock'}
                  </button>

                  <button
                    onClick={() => handleDelete(prod.id)}
                    className="bg-red-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-red-700 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}