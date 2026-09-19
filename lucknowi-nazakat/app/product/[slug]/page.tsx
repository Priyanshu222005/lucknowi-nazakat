import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProduct(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
    });
    return product;
  } catch (error) {
    console.error('Failed to fetch product detail:', error);
    return null;
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  let imageList: string[] = [];
  try {
    imageList = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
  } catch {
    imageList = ['https://images.unsplash.com/photo-1610030469983-98e550d6193c'];
  }

  const mainImage = imageList[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c';

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-stone-500 mb-8 tracking-wider uppercase">
          <Link href="/" className="hover:text-[#6B1D2F]">Home</Link> / 
          <Link href="/shop" className="hover:text-[#6B1D2F] ml-1">Shop</Link> / 
          <span className="text-[#6B1D2F] font-semibold ml-1">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
          {/* Image Showcase */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-[#D4AF37]">
                {product.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mt-1 mb-3">
                {product.name}
              </h1>

              {/* Pricing Section */}
              <div className="flex items-baseline space-x-3 mb-6">
                <span className="text-3xl font-bold text-[#6B1D2F]">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
                {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                  <span className="text-lg text-stone-400 line-through">
                    ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                  </span>
                )}
                {product.discountPercentage && product.discountPercentage > 0 && (
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded">
                    {product.discountPercentage}% OFF
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-stone-600 text-sm leading-relaxed mb-6 border-t border-b border-stone-100 py-4">
                {product.description}
              </p>

              {/* Specs & Features */}
              <div className="space-y-2 text-xs text-stone-600 mb-8">
                <p><strong className="text-stone-900">Craftsmanship:</strong> Handcrafted Lucknowi Chikankari</p>
                <p><strong className="text-stone-900">Availability:</strong> {product.stock > 0 ? 'In Stock (Ready to Dispatch)' : 'Out of Stock'}</p>
                <p><strong className="text-stone-900">Shipping:</strong> Free Delivery across India</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-stone-200">
              <Link
                href="/checkout"
                className="block w-full bg-[#6B1D2F] hover:bg-[#521624] text-[#D4AF37] text-center font-bold py-4 rounded-xl shadow-md transition-all duration-200 tracking-wide"
              >
                Buy Now (Instant Checkout)
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}