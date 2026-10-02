'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const cartContext = useCart();
  const cart = cartContext?.cart || [];
  const removeFromCart = cartContext?.removeFromCart;
  const updateQuantity = cartContext?.updateQuantity;

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/shop"
            className="text-xs uppercase tracking-wider text-[#6B1D2F] font-bold hover:underline flex items-center gap-1"
          >
            ← Back to Collection
          </Link>
        </div>

        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#6B1D2F] mb-6">
          Your Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-8 text-center shadow-sm">
            <p className="text-stone-600 font-medium mb-4">Your cart is currently empty.</p>
            <Link
              href="/shop"
              className="inline-block bg-[#6B1D2F] text-white text-xs font-bold px-6 py-3 rounded-lg uppercase tracking-wider hover:bg-[#521624] transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm flex items-center gap-4"
                >
                  <div className="relative w-20 h-20 bg-stone-100 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image || '/images/placeholder.jpg'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-serif font-bold text-stone-800 text-sm">{item.name}</h3>
                    <p className="text-xs font-bold text-[#6B1D2F] mt-1">₹{item.price}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity?.(item.id, Math.max(1, item.quantity - 1))
                        }
                        className="w-6 h-6 border border-stone-300 rounded text-xs font-bold hover:bg-stone-100 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold px-2">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity?.(item.id, item.quantity + 1)}
                        className="w-6 h-6 border border-stone-300 rounded text-xs font-bold hover:bg-stone-100 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart?.(item.id)}
                    className="text-xs text-red-600 font-semibold hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm h-fit space-y-4">
              <h2 className="font-bold text-stone-800 text-sm uppercase tracking-wider border-b pb-2">
                Order Summary
              </h2>
              <div className="flex justify-between text-sm font-bold text-stone-800">
                <span>Subtotal</span>
                <span className="text-[#6B1D2F]">₹{totalAmount}</span>
              </div>

              <Link
                href="/checkout"
                className="block text-center w-full bg-[#6B1D2F] text-white py-3 rounded-lg font-bold text-xs uppercase hover:bg-[#521624] transition"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}