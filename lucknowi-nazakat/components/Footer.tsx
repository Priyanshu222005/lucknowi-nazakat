export default function Footer() {
  return (
    <footer className="bg-[#2A0810] text-stone-300 text-xs py-12 border-t border-[#3D0C17] mt-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <h4 className="font-serif text-lg text-[#F3E5AB] font-bold">Lucknowi Nazakat</h4>
          <p className="text-stone-400 leading-relaxed">
            Preserving centuries-old Awadhi heritage through handcrafted Chikankari masterpieces straight from Lucknow.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-white mb-3 uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="/shop" className="hover:text-[#F3E5AB]">New Arrivals</a></li>
            <li><a href="/shop?category=women" className="hover:text-[#F3E5AB]">Women Collection</a></li>
            <li><a href="/shop?category=men" className="hover:text-[#F3E5AB]">Men's Kurta Sets</a></li>
            <li><a href="/checkout" className="hover:text-[#F3E5AB]">My Shopping Bag</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-3 uppercase tracking-wider">Customer Care</h4>
          <ul className="space-y-2">
            <li>Shipping & Delivery</li>
            <li>Returns & Exchanges</li>
            <li>Chikankari Care Guide</li>
            <li>Track Order</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-3 uppercase tracking-wider">Store Location</h4>
          <p className="text-stone-400 leading-relaxed">
            2nd Floor, City Plaza, Plot No. 4, Noida Extension, Gaur City 1, Sector 4, Greater Noida, Ghaziabad, Uttar Pradesh 201016, India <br />
            Support: +91 9934578298
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-stone-800 text-center text-stone-500">
        © 2026 Lucknowi Nazakat Boutique Store. All rights reserved. Powered by Next.js & Razorpay.
      </div>
    </footer>
  );
}