'use client';

import React from 'react';
import { useCartStore } from '@/store/useCartStore';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity } = useCartStore();

  const subtotal = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
      <div className="w-full max-w-md bg-white h-full p-6 flex flex-col justify-between shadow-xl">
        <div>
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="font-serif text-xl font-bold text-stone-900">Your Cart</h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-stone-500 font-bold hover:text-stone-800"
            >
              ✕
            </button>
          </div>

          {items.length === 0 ? (
            <p className="text-xs text-stone-500 py-10 text-center">Your cart is currently empty.</p>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h4 className="font-bold text-xs text-stone-800">{item.name}</h4>
                    <p className="text-xs text-stone-500">₹{item.price} x {item.quantity}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="px-2 py-0.5 bg-stone-100 rounded text-xs"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-0.5 bg-stone-100 rounded text-xs"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-rose-600 font-bold ml-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t pt-4 space-y-4">
          <div className="flex justify-between font-bold text-stone-900 text-sm">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <a
            href="/checkout"
            className="block text-center w-full bg-[#6B1D2F] text-white py-3 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#521624] transition"
          >
            Proceed to Checkout
          </a>
        </div>
      </div>
    </div>
  );
}