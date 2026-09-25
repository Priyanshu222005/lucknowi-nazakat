'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        // Safe check for both array and { products: [] } object responses
        const list = Array.isArray(data) ? data : data.products || [];
        setProducts(list);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch shop products error:', err);
        setLoading(false);
      });
  }, []);

  // Filter Categories
  const categories = useMemo(() => {
    const list = products.map((p) => p.category).filter(Boolean);
    return ['All', ...Array.from(new Set(list))];
  }, [products]);

  // Search & Filter Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          selectedCategory === 'All' || p.category === selectedCategory;
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.description &&
            p.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
  }, [products, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-10 flex-1 w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#6B1D2F]">
            Our Lucknowi Collection
          </h1>
          <p className="text-xs text-stone-500 mt-2">
            Handcrafted Awadhi Chikankari Kurtis, Sarees & Apparel
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white border border-stone-200 rounded-lg p-4 mb-8 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Bar */}
          <div className="w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search Kurti, Saree, Anarkali..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs px-4 py-2.5 border border-stone-300 rounded focus:outline-none focus:border-[#6B1D2F]"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-center w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-bold uppercase transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#6B1D2F] text-white shadow'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sorting */}
          <div className="w-full md:w-auto flex items-center space-x-2">
            <label className="text-xs font-bold text-stone-600 uppercase">Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs px-3 py-2 border border-stone-300 rounded bg-white focus:outline-none focus:border-[#6B1D2F]"
            >
              <option value="latest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-20 text-center text-xs font-bold text-stone-500">
            Loading Lucknowi Collection...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center">
            <h3 className="font-serif text-lg font-bold text-[#6B1D2F]">No Products Found</h3>
            <p className="text-xs text-stone-500 mt-1">Try changing search keywords or category filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredProducts.map((p) => {
              const images = p.image ? [p.image] : [];
              const imgSrc = images[0] || '/images/placeholder.jpg';
              const productLink = `/product/${p.slug || p.id}`;

              return (
                <div key={p.id} className="bg-white rounded-lg border border-stone-200 p-4 shadow-sm flex flex-col justify-between">
                  <div>
                    <Link href={productLink} className="block group">
                      <img
                        src={imgSrc}
                        alt={p.name}
                        className="w-full h-80 object-cover rounded mb-4 group-hover:opacity-95 transition"
                      />
                    </Link>
                    <span className="text-[10px] font-bold uppercase text-[#F3E5AB] bg-[#6B1D2F] px-2 py-0.5 rounded">
                      {p.category}
                    </span>
                    <Link href={productLink}>
                      <h3 className="font-serif text-lg font-bold text-stone-800 mt-2 hover:text-[#6B1D2F] transition">
                        {p.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-stone-500 line-clamp-2 my-2">{p.description}</p>
                    <div className="flex items-center space-x-2">
                      <p className="font-bold text-[#6B1D2F] text-base">₹{p.price}</p>
                      {p.originalPrice && (
                        <p className="text-xs text-stone-400 line-through">₹{p.originalPrice}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Link
                      href={productLink}
                      className="w-full border border-[#6B1D2F] text-[#6B1D2F] py-2.5 rounded text-[11px] font-bold uppercase text-center hover:bg-stone-50 transition"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() =>
                        addToCart({
                          id: p.id,
                          name: p.name,
                          price: p.price,
                          image: imgSrc,
                          size: 'M',
                          quantity: 1,
                        })
                      }
                      className="w-full bg-[#6B1D2F] text-white py-2.5 rounded text-[11px] font-bold uppercase hover:bg-[#521624] transition cursor-pointer"
                    >
                      + Add To Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}