'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'COD'>('ONLINE');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const totalAmount = getCartTotal();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async (e: React.FormEvent) => {
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
      if (paymentMethod === 'COD') {
        // Handle Cash on Delivery Order
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cart,
            totalAmount,
            shippingInfo: formData,
            paymentMethod: 'COD',
            paymentStatus: 'PENDING',
          }),
        });

        const data = await res.json();
        if (data.success) {
          clearCart();
          alert('✅ Order Placed Successfully via Cash on Delivery!');
          router.push('/account');
        } else {
          alert('Order place karne mein dikkat aayi: ' + data.error);
        }
      } else {
        // Handle Online Payment via Razorpay
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          alert('Razorpay SDK load nahi ho paaya. Internet connection check karein.');
          setLoading(false);
          return;
        }

        const orderRes = await fetch('/api/razorpay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: totalAmount }),
        });

        const orderData = await orderRes.json();

        if (!orderData.success) {
          alert('Razorpay Order create nahi ho saka: ' + orderData.error);
          setLoading(false);
          return;
        }

        const options = {
          key: orderData.key,
          amount: orderData.order.amount,
          currency: orderData.order.currency,
          name: 'Lucknowi Nazakat',
          description: 'Authentic Chikankari Purchase',
          order_id: orderData.order.id,
          handler: async function (response: any) {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  items: cart,
                  totalAmount,
                  shippingInfo: formData,
                  paymentMethod: 'ONLINE',
                  paymentStatus: 'PAID',
                  razorpayPaymentId: response.razorpay_payment_id,
                }),
              });

              clearCart();
              alert('🎉 Payment Successful! Order Placed.');
              router.push('/account');
            } else {
              alert('Payment Verification Failed!');
            }
          },
          prefill: {
            name: formData.fullName,
            contact: formData.phone,
          },
          theme: {
            color: '#6B1D2F',
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert('Checkout processing error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-10 flex-1 w-full">
        <h1 className="font-serif text-3xl font-bold text-[#6B1D2F] mb-8">Checkout</h1>

        <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Shipping Form */}
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

          {/* Order Summary & Payment Mode Toggle */}
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

              {/* Payment Method Selector */}
              <div className="pt-4 border-t">
                <label className="block text-xs font-bold uppercase text-stone-700 mb-2">Select Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ONLINE')}
                    className={`p-3 text-xs font-bold rounded border transition ${
                      paymentMethod === 'ONLINE'
                        ? 'bg-[#6B1D2F] text-white border-[#6B1D2F] shadow-sm'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-[#6B1D2F]'
                    }`}
                  >
                    Online Pay (UPI / Card)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3 text-xs font-bold rounded border transition ${
                      paymentMethod === 'COD'
                        ? 'bg-[#6B1D2F] text-white border-[#6B1D2F] shadow-sm'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-[#6B1D2F]'
                    }`}
                  >
                    Cash on Delivery
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || cart.length === 0}
              className="w-full bg-[#6B1D2F] text-white py-3.5 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#521624] transition disabled:opacity-50 cursor-pointer shadow"
            >
              {loading
                ? 'Processing...'
                : paymentMethod === 'ONLINE'
                ? `Pay ₹${totalAmount} Now (Online)`
                : 'Place Order (Cash on Delivery)'}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}