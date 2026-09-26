'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, CheckCircle2 } from 'lucide-react';

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);

  // Add Product form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Kurtis');
  const [imageUrl, setImageUrl] = useState('');
  const [stock, setStock] = useState('10');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    if (Array.isArray(data)) setProducts(data);
    else if (data.products) setProducts(data.products);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const scaleFactor = MAX_WIDTH / img.width;

        canvas.width = img.width > MAX_WIDTH ? MAX_WIDTH : img.width;
        canvas.height = img.width > MAX_WIDTH ? img.height * scaleFactor : img.height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.4);
        setImageUrl(compressedBase64);
        setUploading(false);
      };
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !imageUrl) {
      alert('Kripya Name, Price aur Product Image select karein.');
      return;
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          category,
          image: imageUrl,
          stock: parseInt(stock) || 10,
          description,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        alert('Server ne JSON response nahi diya. Status: ' + res.status);
        return;
      }

      if (res.ok && data.success) {
        alert('Product successfully publish ho gaya!');
        setName('');
        setPrice('');
        setCategory('Kurtis');
        setImageUrl('');
        setStock('10');
        setDescription('');
        fetchProducts();
      } else {
        alert(data.error || 'Database mein save nahi ho paaya.');
      }
    } catch (err: any) {
      alert('Real Error: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Kya aap is product ko delete karna chahte hain?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        alert('Product deleted!');
        fetchProducts();
      } else {
        alert('Delete fail ho gaya: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      alert('Delete Error: ' + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Add Product Form */}
      <div className="bg-white p-8 rounded-xl shadow-md space-y-6">
        <h1 className="text-2xl font-serif font-bold text-gray-900 border-b pb-4">
          Add New Lucknowi Collection
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Product Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Handcrafted White Chikankari Kurti"
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-amber-800 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Price (₹) *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="2499"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-amber-800 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-1 focus:ring-amber-800 outline-none"
              >
                <option value="Kurtis">Kurtis</option>
                <option value="Sarees">Sarees</option>
                <option value="Suits">Suits</option>
                <option value="Men">Men's Collection</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Upload Product Image *</label>
            <div className="border-2 border-dashed border-stone-300 p-4 rounded-xl text-center hover:bg-stone-50 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="product-file-upload"
              />
              <label htmlFor="product-file-upload" className="cursor-pointer space-y-2 block">
                <UploadCloud className="w-8 h-8 mx-auto text-amber-800" />
                <span className="text-xs text-gray-600 block font-medium">
                  {uploading ? 'Processing Image...' : 'Click to choose image file'}
                </span>
              </label>
            </div>

            {imageUrl && (
              <div className="mt-2 flex items-center gap-2 text-xs text-green-700 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Image Processed & Ready!
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Stock Quantity</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-amber-800 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Fabric details, embroidery style..."
              rows={3}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-amber-800 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full py-3 bg-[#6B1D2F] hover:bg-[#521624] text-[#F3E5AB] font-bold text-sm uppercase rounded-lg shadow transition-colors disabled:opacity-50"
          >
            {uploading ? 'Processing Image...' : 'Publish Product'}
          </button>
        </form>
      </div>

      {/* Products List with Delete */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-bold mb-4 text-gray-900">All Products ({products.length})</h2>
        <div className="space-y-3">
          {products.map((prod) => (
            <div key={prod.id} className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={prod.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800'}
                  alt={prod.name}
                  className="w-14 h-14 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800';
                  }}
                />
                <div>
                  <p className="font-bold text-sm text-gray-900">{prod.name}</p>
                  <p className="text-xs text-stone-500">₹{prod.price} | {prod.category}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(prod.id)}
                className="bg-red-600 text-white px-4 py-2 rounded text-xs font-bold hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          ))}
          {products.length === 0 && (
            <p className="text-sm text-stone-500 text-center py-6">Koi product nahi mila.</p>
          )}
        </div>
      </div>
    </div>
  );
}