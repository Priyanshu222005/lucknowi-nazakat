import ProductCard from '@/components/product/ProductCard';

const allProducts = [
  {
    id: '1',
    name: 'Royal White Chikankari Anarkali Set',
    slug: 'royal-white-chikankari-anarkali-set',
    price: 4999,
    originalPrice: 6999,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80',
    category: 'Women',
    isNew: true,
  },
  {
    id: '2',
    name: 'Handcrafted Cotton Chikankari Kurta',
    slug: 'handcrafted-cotton-chikankari-kurta',
    price: 2499,
    originalPrice: 3499,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80',
    category: 'Men',
    isNew: false,
  },
  {
    id: '3',
    name: 'Lucknowi Murri Work Silk Dupatta',
    slug: 'lucknowi-murri-work-silk-dupatta',
    price: 1899,
    originalPrice: 2499,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80',
    category: 'Accessories',
    isNew: true,
  },
  {
    id: '4',
    name: 'Pastel Blue Georgette Chikankari Suit',
    slug: 'pastel-blue-georgette-chikankari-suit',
    price: 3999,
    originalPrice: 5499,
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80',
    category: 'Women',
    isNew: false,
  },
];

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#6B1D2F]">All Collections</h1>
          <p className="text-sm text-gray-600">Explore authentic Chikankari handcrafted couture</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
}