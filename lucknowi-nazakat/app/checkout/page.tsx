import ProductCard from "@/components/product/ProductCard";
import Image from "next/image";
import Link from "next/link";

const featuredProducts = [
  {
    id: "1",
    name: "Royal White Chikankari Anarkali Set",
    slug: "royal-white-chikankari-anarkali-set",
    price: 4999,
    originalPrice: 6999,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80",
    category: "Women",
    isNew: true,
  },
  {
    id: "2",
    name: "Handcrafted Cotton Chikankari Kurta",
    slug: "handcrafted-cotton-chikankari-kurta",
    price: 2499,
    originalPrice: 3499,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80",
    category: "Men",
    isNew: false,
  },
  {
    id: "3",
    name: "Lucknowi Murri Work Silk Dupatta",
    slug: "lucknowi-murri-work-silk-dupatta",
    price: 1899,
    originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80",
    category: "Accessories",
    isNew: true,
  },
  {
    id: "4",
    name: "Pastel Blue Georgette Chikankari Suit",
    slug: "pastel-blue-georgette-chikankari-suit",
    price: 3999,
    originalPrice: 5499,
    image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80",
    category: "Women",
    isNew: false,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-[#FAF7F2] py-16 md:py-24 overflow-hidden border-b border-[#6B1D2F]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4AF37]">
                Handcrafted Lakhnavi Craftsmanship
              </span>
              <h1 className="font-serif text-4xl md:text-6xl font-bold text-[#6B1D2F] leading-tight">
                Elegance Woven in Tradition
              </h1>
              <p className="text-base md:text-lg text-[#2D2D2D]/80 font-normal leading-relaxed">
                Discover timeless Indian ethnic couture crafted with delicate Chikankari embroidery, designed for modern grace and royalty.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/shop"
                  className="px-8 py-3.5 bg-[#6B1D2F] text-white text-xs font-semibold uppercase tracking-widest rounded hover:bg-[#521624] transition-all duration-300 shadow-md"
                >
                  Shop Collection
                </Link>
                <Link
                  href="/women"
                  className="px-8 py-3.5 border border-[#6B1D2F] text-[#6B1D2F] text-xs font-semibold uppercase tracking-widest rounded hover:bg-[#6B1D2F] hover:text-white transition-all duration-300"
                >
                  Explore Women
                </Link>
              </div>
            </div>

            <div className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-lg overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80"
                alt="Lucknowi Nazakat Collection"
                fill
                priority
                className="object-cover"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4AF37]">
            Handpicked Curations
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#6B1D2F]">
            Featured Royal Collections
          </h2>
          <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>
    </main>
  );
}