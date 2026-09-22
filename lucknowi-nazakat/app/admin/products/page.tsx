'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        alert('Product deleted successfully!');
      } else {
        alert('Failed to delete product.');
      }
    } catch (err) {
      alert('Error deleting product.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex justify-between items-center border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#6B1D2F]">Apparel Catalog</h1>
          <p className="text-xs text-stone-500 mt-1">Manage, add, and remove boutique items</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-[#6B1D2F] text-[#D4AF37] px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#521624] transition shadow-md"
        >
          + Add New Product
        </Link>
      </div>

      {loading ? (
        <div className="py-12 text-center text-stone-500 font-semibold text-sm">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-200 shadow-sm space-y-3">
          <p className="text-stone-600 text-sm font-semibold">No products found in the database.</p>
          <div>
            <Link
              href="/admin/products/new"
              className="bg-[#6B1D2F] text-white px-4 py-2 rounded text-xs font-bold uppercase inline-block hover:bg-[#521624] transition"
            >
              Add Your First Product →
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
              <div className="relative h-56 w-full bg-stone-100">
                <Image
                  src={product.image || '/images/placeholder.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                    {product.category}
                  </span>
                  <h3 className="font-serif font-bold text-stone-900 text-lg mt-1">{product.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-base font-bold text-[#6B1D2F]">₹{product.price}</p>
                    {product.originalPrice && (
                      <p className="text-xs text-stone-400 line-through">₹{product.originalPrice}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="w-full py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold hover:bg-rose-100 transition"
                >
                  🗑️ Delete Product
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}