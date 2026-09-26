'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const cartContext = useCart();
  const cart = cartContext?.cart || [];
  const removeFromCart = cartContext?.removeFromCart;
  const updateQuantity = cartContext?.updateQuantity;
  const setIsOpen = cartContext?.setIsOpen;
  const isOpen = cartContext?.isOpen || false;

  const subtotal = cart.reduce(
    (acc: number, item) => acc + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
      <div className="w-full max-w-md bg-[#FAF9F6] h-full p-6 flex flex-col justify-between shadow-xl">
        <div>
          <div className="flex justify-between items-center border-b border-[#6B1D2F]/20 pb-4 mb-4">
            <h2 className="font-serif text-xl font-bold text-[#6B1D2F]">Your Cart ({cart.length})</h2>
            <button
              type="button"
              onClick={() => setIsOpen && setIsOpen(false)}
              className="text-stone-500 font-bold hover:text-stone-800 text-lg"
            >
              ✕
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <p className="text-xs text-stone-500">Your cart is currently empty.</p>
              <button
                type="button"
                onClick={() => setIsOpen && setIsOpen(false)}
                className="text-xs font-bold text-[#6B1D2F] underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex gap-4 p-3 bg-white border border-[#6B1D2F]/10 rounded-lg shadow-sm"
                >
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded border border-stone-200"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800';
                    }}
                  />
                  <div className="flex-1 space-y-1">
                    <h4 className="font-bold text-xs text-stone-900 line-clamp-1">{item.name}</h4>
                    <p className="text-[11px] text-stone-500">Size: <span className="font-semibold text-stone-800">{item.size || 'M'}</span></p>
                    <p className="text-xs font-bold text-[#6B1D2F]">₹{item.price}</p>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center space-x-2 border border-stone-200 rounded bg-stone-50">
                        <button
                          type="button"
                          onClick={() => updateQuantity && updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                          className="px-2 py-0.5 text-xs font-bold hover:bg-stone-200"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold px-1">{item.quantity || 1}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity && updateQuantity(item.id, (item.quantity || 1) + 1)}
                          className="px-2 py-0.5 text-xs font-bold hover:bg-stone-200"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart && removeFromCart(item.id)}
                        className="text-[11px] text-rose-600 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-[#6B1D2F]/20 pt-4 space-y-4">
          <div className="flex justify-between font-bold text-stone-900 text-sm">
            <span>Subtotal</span>
            <span className="text-[#6B1D2F] font-serif text-base">₹{subtotal}</span>
          </div>

          <Link
            href="/checkout"
            onClick={() => setIsOpen && setIsOpen(false)}
            className="block text-center w-full bg-[#6B1D2F] text-white py-3.5 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#521624] transition shadow"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}