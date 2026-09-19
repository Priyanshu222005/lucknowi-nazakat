import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';

export const revalidate = 0; // Fresh data fetch on every request

async function getProducts() {
  try {
    return await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Failed to fetch products', error);
    return [];
  }
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#6B1D2F]">Product Inventory</h1>
            <p className="text-stone-600 text-sm">Manage Lucknowi Nazakat catalog ({products.length} Items)</p>
          </div>
          <Link
            href="/admin/products/new"
            className="bg-[#6B1D2F] hover:bg-[#521624] text-[#D4AF37] px-6 py-3 rounded-lg font-medium transition shadow-md"
          >
            + Add New Product
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#6B1D2F] text-[#D4AF37] text-xs uppercase tracking-wider font-semibold">
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Badges</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700 text-sm">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-stone-500">
                    No products found in inventory. Add your first product!
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  let imageList = [];
                  try {
                    imageList = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
                  } catch {
                    imageList = ['https://images.unsplash.com/photo-1610030469983-98e550d6193c'];
                  }

                  return (
                    <tr key={p.id} className="hover:bg-stone-50 transition">
                      <td className="p-4 flex items-center space-x-3">
                        <div className="relative w-12 h-16 rounded overflow-hidden bg-stone-100 flex-shrink-0">
                          <Image
                            src={imageList[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c'}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-stone-900">{p.name}</p>
                          <p className="text-xs text-stone-500 font-mono">{p.slug}</p>
                        </div>
                      </td>
                      <td className="p-4 capitalize">{p.category}</td>
                      <td className="p-4 font-semibold text-stone-900">
                        ₹{p.price}
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="text-xs text-stone-400 line-through ml-2">
                            ₹{p.originalPrice}
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-medium">{p.stock} units</td>
                      <td className="p-4 space-x-1">
                        {p.isNewArrival && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            New
                          </span>
                        )}
                        {p.isBestSeller && (
                          <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            Bestseller
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded">
                          Active
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}