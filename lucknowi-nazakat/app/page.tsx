'use client';

import { useCartStore } from '@/store/useCartStore';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { ShieldCheck, Truck, Lock, ArrowLeft } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { cart, getTotalPrice, clearCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: 'Uttar Pradesh',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const subtotal = getTotalPrice();
  const shipping = subtotal > 999 ? 0 : 99;
  const grandTotal = subtotal + shipping;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create order on backend
      const response = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: grandTotal }),
      });

      const orderData = await response.json();

      if (!response.ok) {
        throw new Error(orderData.error || 'Failed to create Razorpay order');
      }

      // 2. Open Razorpay Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Lucknowi Nazakat',
        description: 'Elegance Woven in Tradition',
        order_id: orderData.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#6B1D2F',
        },
        handler: function (response: any) {
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
          clearCart();
          window.location.href = '/';
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      alert(err.message || 'Payment initiation failed.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#6B1D2F] mb-4">Your Shopping Bag is Empty</h2>
        <p className="text-gray-600 mb-8">Please add items to your cart before proceeding to checkout.</p>
        <Link
          href="/"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-[#6B1D2F] text-white font-medium rounded hover:bg-[#521624] transition-colors text-sm uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-xs text-[#6B1D2F] font-semibold hover:underline mb-2">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Store
          </Link>
          <h1 className="font-serif text-3xl font-bold text-[#6B1D2F]">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Section */}
          <div className="lg:col-span-7 space-y-8">
            <form onSubmit={handleCheckoutSubmit} className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-[#6B1D2F]/10 shadow-sm space-y-4">
                <h2 className="font-serif text-xl font-semibold text-[#2D2D2D]">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Priyanshu Verma"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#6B1D2F] focus:border-[#6B1D2F] outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="priyanshu@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#6B1D2F] focus:border-[#6B1D2F] outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 9876543210"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#6B1D2F] focus:border-[#6B1D2F] outline-none text-sm"
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-[#6B1D2F]/10 shadow-sm space-y-4">
                <h2 className="font-serif text-xl font-semibold text-[#2D2D2D]">Shipping Address</h2>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Street Address / House No.</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Hazratganj, Park Road"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#6B1D2F] focus:border-[#6B1D2F] outline-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Lucknow"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#6B1D2F] focus:border-[#6B1D2F] outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">PIN Code</label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="226001"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#6B1D2F] focus:border-[#6B1D2F] outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 focus:outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#6B1D2F] text-white font-semibold rounded hover:bg-[#521624] transition-colors flex items-center justify-center space-x-2 text-sm uppercase tracking-wider shadow-md"
              >
                <Lock className="w-4 h-4" />
                <span>{loading ? 'Processing...' : `Pay ₹${grandTotal.toLocaleString('en-IN')}`}</span>
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-lg border border-[#6B1D2F]/10 shadow-sm space-y-4">
              <h2 className="font-serif text-xl font-semibold text-[#2D2D2D] border-b pb-3">Order Summary</h2>

              <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="py-3 flex gap-4">
                    <div className="relative w-16 h-20 bg-[#F4EBE1] rounded overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-sm font-semibold text-[#2D2D2D] line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-gray-500">Size: {item.size} | Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-[#6B1D2F] mt-1">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-green-600 font-semibold">FREE</span> : `₹${shipping}`}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-base font-bold text-[#2D2D2D]">
                  <span>Total Amount</span>
                  <span className="text-[#6B1D2F]">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#F4EBE1]/50 p-4 rounded-lg border border-[#6B1D2F]/10 space-y-2 text-xs text-gray-600">
              <div className="flex items-center space-x-2 text-[#6B1D2F] font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Secure Checkout</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Truck className="w-4 h-4 text-[#D4AF37]" />
                <span>Free Express Shipping across India on orders above ₹999</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}