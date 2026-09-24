import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      {/* Hero Section */}
      <section className="relative bg-[#6B1D2F] text-[#FAF9F6] py-20 md:py-32 px-4 sm:px-6 lg:px-8 border-b border-[#8B263E]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-[#F3E5AB] font-semibold">
            Handcrafted Elegance from Lucknow
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight leading-tight">
            Timeless Chikankari Luxury
          </h1>
          <p className="text-stone-300 text-base md:text-lg max-w-2xl mx-auto font-light">
            Discover exquisite hand-embroidered Kurtis and Sarees crafted by master artisans with authentic Lucknowi heritage.
          </p>
          <div className="pt-4 flex justify-center space-x-4">
            <Link
              href="/shop"
              className="bg-[#F3E5AB] text-[#6B1D2F] px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-white transition shadow-lg"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8 border-b border-stone-200 pb-4">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#6B1D2F]">
            Featured Categories
          </h2>
          <Link href="/shop" className="text-xs font-bold uppercase tracking-wider text-[#6B1D2F] hover:underline">
            View All Products →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Women Collection */}
          <Link href="/shop?category=women" className="group relative h-80 rounded-2xl overflow-hidden shadow-lg bg-[#521624] p-8 flex flex-col justify-end text-white hover:opacity-95 transition">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
            <div className="relative z-20">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F3E5AB]">
                Women Collection
              </span>
              <h3 className="text-2xl font-serif font-bold mt-1">
                Georgette & Cotton Kurtis
              </h3>
            </div>
          </Link>

          {/* Sarees */}
          <Link href="/shop?category=sarees" className="group relative h-80 rounded-2xl overflow-hidden shadow-lg bg-[#3D101B] p-8 flex flex-col justify-end text-white hover:opacity-95 transition">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
            <div className="relative z-20">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F3E5AB]">
                Saree Specials
              </span>
              <h3 className="text-2xl font-serif font-bold mt-1">
                Modal Silk & Pure Drapings
              </h3>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}