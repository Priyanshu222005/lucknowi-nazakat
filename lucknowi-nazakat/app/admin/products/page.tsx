'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  category?: string;
  image?: string;
  imageUrl?: string;
  stock?: number;
  inStock?: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const normalizedProducts = Array.isArray(data)
          ? data.map((product: any) => ({
              ...product,
              stock: product.stock ?? (product.inStock === false ? 0 : 10),
              inStock: product.inStock ?? product.stock !== 0,
              image: product.image || product.imageUrl || '/images/placeholder.jpg',
              imageUrl: product.imageUrl || product.image || '/images/placeholder.jpg',
            }))
          : [];
        setProducts(normalizedProducts);
      }
    } catch (err) {
      console.error('Fetch products error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStock = async (id: string, currentInStock?: boolean) => {
    setActionLoading(id);
    const newStockState = currentInStock === false ? true : false;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inStock: newStockState,
          stock: newStockState ? 10 : 0,
        }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, inStock: newStockState, stock: newStockState ? 10 : 0 }
              : item
          )
        );
      } else {
        alert('Stock status update failed!');
      }
    } catch (err) {
      console.error('Error toggling stock:', err);
      alert('Stock status update failed!');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this product?')) return;

    setActionLoading(id);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert('Failed to remove product!');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Error removing product!');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif font-bold text-[#6B1D2F]">
          Manage Products
        </h1>
        <Link
          href="/admin/products/new"
          className="bg-[#6B1D2F] hover:bg-[#521624] text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow uppercase tracking-wider transition"
        >
          + ADD NEW PRODUCT
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
        <h2 className="text-lg font-serif font-bold text-stone-800 mb-4 pb-2 border-b border-stone-100">
          All Added Products ({products.length})
        </h2>

        {loading ? (
          <p className="text-xs text-stone-500 py-4 text-center">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-xs text-stone-500 py-4 text-center">No products found.</p>
        ) : (
          <div className="space-y-4">
            {products.map((product) => {
              const imageSrc = product.imageUrl || product.image || '/images/placeholder.jpg';
              const isInStock = product.inStock !== false;

              return (
                <div
                  key={product.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-stone-50/50 rounded-lg border border-stone-200/80 gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden bg-stone-200 flex-shrink-0">
                      <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-stone-900">
                        {product.name}
                      </h3>
                      <p className="text-xs text-stone-500">
                        ₹{product.price} | Category: {product.category || 'Kurtis'}
                      </p>
                      <span
                        className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                          isInStock
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isInStock ? 'In Stock' : 'Out of Stock / Sold'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleToggleStock(product.id, product.inStock)}
                      disabled={actionLoading === product.id}
                      className="flex-1 sm:flex-none bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold px-4 py-2 rounded transition disabled:opacity-50"
                    >
                      {actionLoading === product.id
                        ? 'Updating...'
                        : isInStock
                        ? 'Mark Out of Stock'
                        : 'Mark In Stock'}
                    </button>

                    <button
                      onClick={() => handleRemoveProduct(product.id)}
                      disabled={actionLoading === product.id}
                      className="flex-1 sm:flex-none bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded transition disabled:opacity-50"
                    >
                      {actionLoading === product.id ? 'Deleting...' : 'REMOVE'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}