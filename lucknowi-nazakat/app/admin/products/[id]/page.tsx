'use client';

import { useState, useEffect } from 'react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    if (Array.isArray(data)) setProducts(data);
    else if (data.products) setProducts(data.products);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Kya aap is product ko delete karna chahte hain?')) return;

    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    const data = await res.json();

    if (data.success) {
      alert('Product deleted!');
      fetchProducts(); // Refresh list
    } else {
      alert('Delete fail ho gaya: ' + data.error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
      
      {/* Existing Add Product Form Yahan Rehne Dein */}

      {/* Existing Products List Table */}
      <div className="mt-8 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-bold mb-3">All Products ({products.length})</h2>
        <div className="space-y-3">
          {products.map((prod) => (
            <div key={prod.id} className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-3">
                <img
                  src={prod.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800'}
                  alt={prod.name}
                  className="w-12 h-12 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800';
                  }}
                />
                <div>
                  <p className="font-bold">{prod.name}</p>
                  <p className="text-xs text-stone-500">₹{prod.price} | {prod.category}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(prod.id)}
                className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}