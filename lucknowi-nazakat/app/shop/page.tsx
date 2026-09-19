import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/product/ProductCard';

export const revalidate = 0; // Live database fetching

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

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-[#6B1D2F] tracking-wide mb-3">
            Our Lucknowi Collection
          </h1>
          <p className="text-stone-600 max-w-xl mx-auto text-sm sm:text-base">
            Explore authentic Lucknowi Chikankari, handcrafted with elegance and tradition.
          </p>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-stone-200">
            <p className="text-stone-500 font-medium text-lg">No products available in shop yet.</p>
            <p className="text-stone-400 text-sm mt-1">Add items from the owner admin panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {products.map((product) => {
              let imageList: string[] = [];
              try {
                imageList = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
              } catch {
                imageList = ['https://images.unsplash.com/photo-1610030469983-98e550d6193c'];
              }

              const formattedProduct = {
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: Number(product.price) || 0,
                originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
                image: imageList[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c',
                images: imageList,
                category: product.category,
                isNew: Boolean(product.isNewArrival),
                isBestSeller: Boolean(product.isBestSeller),
              };

              return <ProductCard key={product.id} product={formattedProduct} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}