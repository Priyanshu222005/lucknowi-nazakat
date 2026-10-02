'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const totalPayable = cart.reduce((sum, item) => {
    const itemPrice = Number(item.price) || 0;
    const itemQty = Number(item.quantity) || 1;
    return sum + itemPrice * itemQty;
  }, 0);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWhatsAppOrder = () => {
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert('Please fill in required shipping information.');
      return;
    }

    const itemsList = cart
      .map(
        (item) =>
          `• ${item.name} (Qty: ${item.quantity}, Size: ${item.size || 'M'}) - ₹${
            Number(item.price) * Number(item.quantity)
          }`
      )
      .join('\n');

    const message = `*NEW ORDER - LUCKNOWI NAZAKAT*\n\n*Customer Details:*\nName: ${formData.fullName}\nPhone: ${formData.phone}\nAddress: ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}\n\n*Order Items:*\n${itemsList}\n\n*Total Amount Payable:* ₹${totalPayable}`;

    const whatsappUrl = `https://wa.me/919934578298?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link
            href="/shop"
            className="text-xs uppercase tracking-wider text-[#6B1D2F] font-bold hover:underline flex items-center gap-1"
          >
            ← Back to Shop
          </Link>
        </div>

        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#6B1D2F] mb-8">
          Checkout
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-8 text-center shadow-sm max-w-lg mx-auto">
            <p className="text-stone-600 font-medium mb-4">
              Your shopping cart is empty.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#6B1D2F] text-white text-xs font-bold px-6 py-3 rounded-lg uppercase tracking-wider hover:bg-[#521624] transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Shipping Information Form */}
            <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-xl border border-stone-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-stone-800 border-b border-stone-200 pb-3 font-serif">
                Shipping Information
              </h2>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  suppressHydrationWarning
                  className="w-full text-xs px-4 py-2.5 border border-stone-300 rounded focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  suppressHydrationWarning
                  className="w-full text-xs px-4 py-2.5 border border-stone-300 rounded focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Address *
                </label>
                <textarea
                  name="address"
                  rows={2}
                  placeholder="House no, street, locality"
                  value={formData.address}
                  onChange={handleInputChange}
                  suppressHydrationWarning
                  className="w-full text-xs px-4 py-2.5 border border-stone-300 rounded focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    suppressHydrationWarning
                    className="w-full text-xs px-4 py-2.5 border border-stone-300 rounded focus:outline-none focus:border-[#6B1D2F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    suppressHydrationWarning
                    className="w-full text-xs px-4 py-2.5 border border-stone-300 rounded focus:outline-none focus:border-[#6B1D2F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  placeholder="6-digit pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  suppressHydrationWarning
                  className="w-full text-xs px-4 py-2.5 border border-stone-300 rounded focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-stone-800 border-b border-stone-200 pb-3 font-serif">
                Order Summary
              </h2>

              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 pb-4 border-b border-stone-100 items-start justify-between"
                  >
                    <div className="relative w-16 h-16 bg-stone-100 rounded overflow-hidden flex-shrink-0 border border-stone-200">
                      <Image
                        src={item.image || '/images/placeholder.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-bold text-stone-900 text-xs font-serif">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        Size: {item.size || 'M'} | ₹{item.price} each
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          className="w-5 h-5 bg-stone-100 border border-stone-300 rounded flex items-center justify-center text-xs font-bold hover:bg-stone-200"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-5 h-5 bg-stone-100 border border-stone-300 rounded flex items-center justify-center text-xs font-bold hover:bg-stone-200"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end justify-between">
                      <p className="font-bold text-xs text-[#6B1D2F]">
                        ₹{Number(item.price) * Number(item.quantity)}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-[10px] text-red-600 font-semibold hover:underline mt-2 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-stone-200 space-y-2">
                <div className="flex justify-between text-sm font-bold text-stone-900">
                  <span>Total Payable</span>
                  <span className="text-[#6B1D2F] text-lg">
                    ₹{totalPayable}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 px-4 rounded-lg font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow cursor-pointer"
              >
                📲 PAY & ORDER VIA WHATSAPP
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}