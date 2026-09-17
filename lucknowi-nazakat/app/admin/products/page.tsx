import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit, Trash2, Star } from 'lucide-react';

const mockProducts = [
  {
    id: '1',
    name: 'Royal White Chikankari Anarkali Set',
    category: 'Women',
    price: 4999,
    stock: 18,
    isNew: true,
    isBestSeller: true,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80',
  },
  {
    id: '2',
    name: 'Handcrafted Cotton Chikankari Kurta',
    category: 'Men',
    price: 2499,
    stock: 25,
    isNew: false,
    isBestSeller: true,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80',
  },
  {
    id: '3',
    name: 'Lucknowi Murri Work Silk Dupatta',
    category: 'Accessories',
    price: 1899,
    stock: 8,
    isNew: true,
    isBestSeller: false,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80',
  },
];

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#6B1D2F]">Products Inventory</h1>
          <p className="text-sm text-gray-500">Manage all clothing products, prices, and stock levels.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#6B1D2F] text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#521624] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Apparel</span>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by name, SKU or category..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-[#6B1D2F] focus:border-[#6B1D2F] outline-none"
          />
        </div>
        <select className="px-3 py-2 border border-gray-300 rounded text-sm outline-none bg-white text-gray-700">
          <option value="all">All Categories</option>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="accessories">Accessories</option>
        </select>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-600">
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Total Stock</th>
                <th className="py-3.5 px-4">Badges</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3 px-4 flex items-center space-x-3">
                    <div className="relative w-12 h-14 bg-[#F4EBE1] rounded overflow-hidden flex-shrink-0 border">
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900 block line-clamp-1">{product.name}</span>
                      <span className="text-xs text-gray-400">SKU: LKNZ-{product.id}001</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-600">{product.category}</td>
                  <td className="py-3 px-4 font-bold text-[#6B1D2F]">₹{product.price.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded ${product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {product.stock} items left
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1 flex-wrap">
                      {product.isNew && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-[#6B1D2F] text-white rounded">NEW</span>
                      )}
                      {product.isBestSeller && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-[#D4AF37] text-white rounded flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-white" /> BESTSELLER
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button className="p-1.5 text-gray-500 hover:text-[#6B1D2F] transition-colors rounded hover:bg-gray-100">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-500 hover:text-red-600 transition-colors rounded hover:bg-gray-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}