import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';

export const revalidate = 0;

interface ShopPageProps {
  searchParams: Promise<{ category?: string; filter?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category, filter } = await searchParams;

  const whereClause: any = {};

  if (category) {
    const cleanCategory = category.trim().toLowerCase();
    
    if (cleanCategory === 'men') {
      whereClause.OR = [
        { category: 'Men' },
        { category: 'men' },
        { category: 'MEN' },
      ];
    } else if (cleanCategory === 'women') {
      whereClause.OR = [
        { category: 'Women' },
        { category: 'women' },
        { category: 'WOMEN' },
      ];
    } else {
      whereClause.category = {
        contains: category,
      };
    }
  }

  if (filter === 'sale') {
    whereClause.isOnSale = true;
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b border-stone-200 pb-4">
          <h1 className="text-3xl font-serif font-bold text-[#6B1D2F] capitalize">
            {category ? `${category}'s Collection` : filter === 'sale' ? 'Sale Collection' : 'All Collection'}
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Showing {products.length} handcrafted items
          </p>
        </div>

        {/* Product Cards Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-stone-200 shadow-sm">
            <p className="text-lg font-serif text-stone-600">No products found in this category.</p>
            <Link href="/shop" className="mt-4 inline-block text-[#6B1D2F] font-bold underline">
              View All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              let displayImage = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80';
              if (product.images) {
                try {
                  const parsed = JSON.parse(product.images);
                  if (Array.isArray(parsed) && parsed[0]) displayImage = parsed[0];
                  else if (typeof parsed === 'string' && parsed.trim()) displayImage = parsed;
                } catch {
                  if (typeof product.images === 'string' && product.images.trim()) displayImage = product.images;
                }
              }

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
                >
                  <div className="relative w-full h-80 bg-stone-100">
                    <Image
                      src={displayImage}
                      alt={product.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {product.isNewArrival && (
                        <span className="bg-[#6B1D2F] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          New
                        </span>
                      )}
                      {product.isBestSeller && (
                        <span className="bg-[#D4AF37] text-stone-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          Bestseller
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                        {product.category}
                      </span>
                      <h3 className="font-serif font-bold text-stone-900 mt-1 line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-base font-bold text-[#6B1D2F]">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-stone-400 line-through">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/product/${product.id}`}
                      className="mt-4 w-full bg-stone-100 hover:bg-[#6B1D2F] hover:text-white text-stone-800 text-xs font-bold py-2.5 rounded-lg text-center transition"
                    >
                      View Details
                    </Link>
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