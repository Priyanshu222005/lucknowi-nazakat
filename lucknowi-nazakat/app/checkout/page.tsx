'use client';

import React from 'react';
import Link from 'next/link';
import CheckoutModule from '@/components/CheckoutModule';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const { cart, totalAmount } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      <main className="max-w-6xl mx-auto py-10 px-4 flex-1 w-full">
        <h1 className="font-serif text-3xl font-bold text-[#6B1D2F] mb-6 border-b pb-3">
          Checkout - Lucknowi Nazakat
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-16 bg-white rounded border border-stone-200 text-stone-500 shadow-sm">
            <p className="text-base font-semibold mb-4">Aapka cart khali hai!</p>
            <Link
              href="/shop"
              className="inline-block bg-[#6B1D2F] text-white px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#521624] transition"
            >
              Go To Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Customer Form */}
            <div className="lg:col-span-2">
              <CheckoutModule />
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm h-fit space-y-4">
              <h3 className="font-serif text-lg font-bold text-stone-800 border-b pb-2">Order Summary</h3>

              <div className="divide-y divide-stone-200">
                {cart.map((item, idx) => (
                  <div key={idx} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-stone-800">{item.name}</p>
                      <p className="text-stone-500">Size: {item.size} | Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-[#6B1D2F]">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 text-xs font-semibold">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Shipping Fee</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#6B1D2F] border-t pt-2">
                  <span>Total Amount</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}