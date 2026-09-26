'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

export const dynamic = 'force-dynamic';

export default function CheckoutPage() {
  const router = useRouter();
  const cartContext = useCart();
  const cart = cartContext?.cart || [];
  const totalAmount = cartContext?.totalAmount || 0;
  const clearCart = cartContext?.clearCart;

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const WHATSAPP_NUMBER = '919934578298';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
        <Navbar />
        <div className="flex-1 flex justify-center items-center text-xs font-semibold text-stone-500 py-20">
          Loading Checkout...
        </div>
        <Footer />
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWhatsAppCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.address || !formData.pincode) {
      alert('Kripya saari mandatory shipping details fill karein.');
      return;
    }

    if (cart.length === 0) {
      alert('Aapka cart khaali hai.');
      return;
    }

    setLoading(true);

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          totalAmount,
          shippingInfo: formData,
          paymentMethod: 'WHATSAPP_UPI',
          paymentStatus: 'PENDING',
        }),
      });

      const orderItemsText = cart
        .map((item: any) => `• ${item.name} (${item.quantity}x) - Size: ${item.size || 'M'} - ₹${item.price * item.quantity}`)
        .join('\n');

      const messageText = 
`🛍️ *NEW ORDER - LUCKNOWI NAZAKAT*

📋 *Order Details:*
${orderItemsText}

💰 *Total Amount:* ₹${totalAmount}

📍 *Shipping Address:*
*Name:* ${formData.fullName}
*Phone:* ${formData.phone}
*Address:* ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}

_Kripya mujhe Payment (QR/UPI ID) details bhejein taaki main order confirm kar saku._`;

      const encodedMessage = encodeURIComponent(messageText);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

      if (clearCart) clearCart();
      window.open(whatsappUrl, '_blank');
      router.push('/account');
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Order process karne mein error aaya.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-10 flex-1 w-full">
        <h1 className="font-serif text-3xl font-bold text-[#6B1D2F] mb-8">Checkout</h1>

        <form onSubmit={handleWhatsAppCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white p-6 rounded-lg border border-stone-200 shadow-sm space-y-4">
            <h2 className="font-serif text-xl font-bold text-stone-800 border-b pb-3">Shipping Information</h2>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Your full name"
                className="w-full border border-stone-300 rounded p-2.5 text-xs focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Phone Number *</label>
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="10-digit mobile number"
                className="w-full border border-stone-300 rounded p-2.5 text-xs focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Address *</label>
              <textarea
                name="address"
                required
                rows={3}
                value={formData.address}
                onChange={handleInputChange}
                placeholder="House no, street, locality"
                className="w-full border border-stone-300 rounded p-2.5 text-xs focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="w-full border border-stone-300 rounded p-2.5 text-xs focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">State *</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  className="w-full border border-stone-300 rounded p-2.5 text-xs focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Pincode *</label>
              <input
                type="text"
                name="pincode"
                required
                value={formData.pincode}
                onChange={handleInputChange}
                placeholder="6-digit pincode"
                className="w-full border border-stone-300 rounded p-2.5 text-xs focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>
          </div>

          <div className="lg:col-span-5 bg-white p-6 rounded-lg border border-stone-200 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-bold text-stone-800 border-b pb-3">Order Summary</h2>

              {cart.length === 0 ? (
                <p className="text-xs text-stone-500">Aapka cart khaali hai.</p>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cart.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs border-b pb-2">
                      <div>
                        <p className="font-bold text-stone-800">{item.name}</p>
                        <p className="text-stone-500">Qty: {item.quantity} | Size: {item.size || 'M'}</p>
                      </div>
                      <span className="font-bold text-[#6B1D2F]">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t pt-3 flex justify-between items-center font-bold text-base text-stone-900">
                <span>Total Payable</span>
                <span className="text-[#6B1D2F]">₹{totalAmount}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || cart.length === 0}
              className="w-full bg-[#25D366] text-white py-3.5 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#1ebd59] transition disabled:opacity-50 cursor-pointer shadow flex items-center justify-center gap-2"
            >
              {loading ? 'Opening WhatsApp...' : '📲 Pay & Order via WhatsApp'}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}