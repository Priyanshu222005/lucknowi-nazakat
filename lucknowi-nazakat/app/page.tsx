import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      {/* Hero Banner Section */}
      <section className="relative bg-[#6B1D2F] text-white py-20 px-4 text-center border-b border-[#521624]">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-[#F3E5AB] font-bold">
            Royal Awadhi Collection
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-[#F3E5AB]">
            Timeless Elegance of Lucknowi Chikankari
          </h1>
          <p className="text-sm md:text-base text-stone-200 max-w-2xl mx-auto font-light">
            Handcrafted with precision by traditional master artisans. Pure Cotton, Georgette & Silk Chikankari Wear.
          </p>
          <div className="pt-4">
            <Link
              href="/shop"
              className="inline-block bg-[#F3E5AB] text-[#6B1D2F] px-8 py-3 rounded text-xs font-bold uppercase tracking-wider hover:bg-white transition shadow-lg"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Showcase */}
      <main className="max-w-7xl mx-auto px-4 py-12 flex-1">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h2 className="font-serif text-2xl font-bold text-[#6B1D2F]">Featured Categories</h2>
          <Link href="/shop" className="text-xs font-bold text-[#6B1D2F] hover:underline uppercase tracking-wider">
            View All Products →
          </Link>
        </div>

        {/* Quick Collections Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link href="/shop?category=women" className="group relative h-64 rounded-lg overflow-hidden bg-[#6B1D2F] shadow-md p-6 flex flex-col justify-end text-white hover:opacity-95 transition">
            <span className="text-xs font-bold uppercase text-[#F3E5AB]">Women Collection</span>
            <h3 className="font-serif text-2xl font-bold">Georgette & Cotton Kurtis</h3>
          </Link>

          <Link href="/shop?category=men" className="group relative h-64 rounded-lg overflow-hidden bg-[#521624] shadow-md p-6 flex flex-col justify-end text-white hover:opacity-95 transition">
            <span className="text-xs font-bold uppercase text-[#F3E5AB]">Men Collection</span>
            <h3 className="font-serif text-2xl font-bold">Royalty Chikankari Kurtas</h3>
          </Link>

          <Link href="/shop?category=sarees" className="group relative h-64 rounded-lg overflow-hidden bg-[#3D0C17] shadow-md p-6 flex flex-col justify-end text-white hover:opacity-95 transition">
            <span className="text-xs font-bold uppercase text-[#F3E5AB]">Saree Specials</span>
            <h3 className="font-serif text-2xl font-bold">Modal Silk & Pure Drapings</h3>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}