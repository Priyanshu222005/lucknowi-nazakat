'use client';

import { useCartStore } from '@/store/useCartStore';
import Image from 'next/image';
import Link from 'next/link';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity } = useCartStore();

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Semi-transparent Backdrop with Blur */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 z-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 bg-[#6B1D2F] text-white flex justify-between items-center">
            <h2 className="text-xl font-serif font-bold text-[#D4AF37]">Your Shopping Cart</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-300 hover:text-white text-2xl font-bold"
            >
              ✕
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12 text-stone-500">
                <p className="text-lg font-medium">Your cart is empty.</p>
                <Link
                  href="/shop"
                  onClick={() => setIsOpen(false)}
                  className="mt-4 inline-block text-[#6B1D2F] font-semibold hover:underline"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 border-b border-stone-100 pb-4"
                >
                  <div className="relative w-16 h-20 bg-stone-100 rounded overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-stone-900 line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-[#6B1D2F] font-bold mt-1">₹{item.price}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-0.5 border border-stone-300 text-xs rounded"
                      >
                        -
                      </button>
                      <span className="text-xs font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-0.5 border border-stone-300 text-xs rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-stone-400 hover:text-rose-600 text-xs"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-stone-600 font-medium">Subtotal:</span>
                <span className="text-xl font-bold text-[#6B1D2F]">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <Link
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className="block w-full bg-[#6B1D2F] hover:bg-[#521624] text-[#D4AF37] text-center font-bold py-3 rounded-lg shadow transition"
              >
                Proceed to Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}