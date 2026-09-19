import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      notFound();
    }

    // Fetch product by ID from SQLite Database
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      notFound();
    }

    // Safely parse product images
    let displayImages: string[] = [];
    if (product.images) {
      try {
        const parsed = JSON.parse(product.images);
        if (Array.isArray(parsed) && parsed.length > 0) {
          displayImages = parsed;
        } else if (typeof parsed === 'string') {
          displayImages = [parsed];
        }
      } catch {
        if (typeof product.images === 'string' && product.images.trim()) {
          displayImages = [product.images];
        }
      }
    }

    if (displayImages.length === 0) {
      displayImages = [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80',
      ];
    }

    return (
      <div className="min-h-screen bg-[#FAFAFA] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-10">
          <div className="mb-6">
            <Link
              href="/shop"
              className="text-stone-500 hover:text-[#6B1D2F] text-sm font-semibold transition"
            >
              ← Back to Catalog
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Image Display */}
            <div className="relative w-full h-[480px] bg-stone-100 rounded-xl overflow-hidden border border-stone-200">
              <Image
                src={displayImages[0]}
                alt={product.name}
                fill
                unoptimized
                className="object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest bg-[#6B1D2F] px-2.5 py-1 rounded">
                  {product.category}
                </span>
                <h1 className="text-3xl font-serif font-bold text-stone-900 mt-4">
                  {product.name}
                </h1>

                <div className="flex items-center space-x-3 mt-4">
                  <span className="text-2xl font-bold text-[#6B1D2F]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-base text-stone-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <div className="mt-6 border-t border-stone-100 pt-4">
                  <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wider mb-2">
                    Description
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="mt-6">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    In Stock ({product.stock} available)
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-stone-100">
                <Link
                  href="/checkout"
                  className="w-full block bg-[#6B1D2F] hover:bg-[#521624] text-[#D4AF37] font-bold text-center py-3.5 rounded-xl transition shadow-md"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Product Page Error:', error);
    notFound();
  }
}