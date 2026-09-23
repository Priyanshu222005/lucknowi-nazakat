'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

const POPULAR_CITIES = [
  'Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Noida', 'Ghaziabad',
  'Delhi', 'Mumbai', 'Bengaluru', 'Kolkata', 'Chennai', 'Hyderabad',
  'Jaipur', 'Ahmedabad', 'Patna', 'Ranchi', 'Mathura', 'Chandigarh'
];

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal', 'Delhi NCR'
];

export default function CheckoutPage() {
  const { cart, totalAmount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226001',
  });

  useEffect(() => {
    // Dynamically load Razorpay SDK
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'pincode' && value.length === 6) {
      fetchPincodeDetails(value);
    }
  };

  const fetchPincodeDetails = async (pin: string) => {
    setPincodeLoading(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      if (data && data[0] && data[0].Status === 'Success') {
        const postOffice = data[0].PostOffice[0];
        setFormData((prev) => ({
          ...prev,
          city: postOffice.District || postOffice.Division || prev.city,
          state: postOffice.State || prev.state,
        }));
      }
    } catch (err) {
      console.error('Pincode fetch error:', err);
    } finally {
      setPincodeLoading(false);
    }
  };

  const processOrder = async (paymentMethod = 'COD', razorpayPaymentId = null) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          items: cart,
          totalAmount: totalAmount,
          paymentMethod,
          razorpayPaymentId,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        clearCart();
        alert('🎉 Mubarak Ho! Aapka Lucknowi Nazakat Order place ho gaya hai.');
        window.location.href = '/account';
      } else {
        alert(`Order failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert('Order process karne mein samasya aayi.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = (method: 'COD' | 'ONLINE') => {
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert('Kripya sabhi zaroori shipping details bharein.');
      return;
    }

    if (cart.length === 0) {
      alert('Aapki cart khaali hai!');
      return;
    }

    setLoading(true);

    if (method === 'COD') {
      processOrder('COD');
    } else {
      // Initiate Razorpay Standard Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_dummykey',
        amount: totalAmount * 100,
        currency: 'INR',
        name: 'Lucknowi Nazakat',
        description: 'Chikankari Luxury Collection',
        handler: function (response: any) {
          processOrder('ONLINE', response.razorpay_payment_id);
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: '#6B1D2F' },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-10 flex-1 w-full">
        <h1 className="font-serif text-3xl font-bold text-[#6B1D2F] mb-6 text-center">
          Checkout & Shipping Details
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white border border-stone-200 rounded-lg p-6 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-stone-800 mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Priyanshu Mohanty"
                  className="w-full text-xs p-2.5 border border-stone-300 rounded focus:outline-none focus:border-[#6B1D2F]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full text-xs p-2.5 border border-stone-300 rounded focus:outline-none focus:border-[#6B1D2F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9508393494"
                    className="w-full text-xs p-2.5 border border-stone-300 rounded focus:outline-none focus:border-[#6B1D2F]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Street Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House No, Street, Landmark"
                  className="w-full text-xs p-2.5 border border-stone-300 rounded focus:outline-none focus:border-[#6B1D2F]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">
                    Pincode * {pincodeLoading && <span className="text-[10px] text-amber-600">(Detecting...)</span>}
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    maxLength={6}
                    placeholder="226001"
                    className="w-full text-xs p-2.5 border border-stone-300 rounded focus:outline-none focus:border-[#6B1D2F]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    list="city-suggestions"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Type or select city..."
                    className="w-full text-xs p-2.5 border border-stone-300 rounded focus:outline-none focus:border-[#6B1D2F]"
                    required
                  />
                  <datalist id="city-suggestions">
                    {POPULAR_CITIES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">State *</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full text-xs p-2.5 border border-stone-300 rounded bg-white focus:outline-none focus:border-[#6B1D2F]"
                    required
                  >
                    <option value="">Select State</option>
                    {STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm h-fit">
            <h2 className="font-serif text-xl font-bold text-stone-800 mb-4">Order Summary</h2>

            <div className="space-y-3 border-b border-stone-200 pb-4 mb-4 max-h-60 overflow-y-auto">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <div>
                    <p className="font-bold text-stone-800">{item.name}</p>
                    <p className="text-stone-400">Size: {item.size} | Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-[#6B1D2F]">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-bold text-base mb-6 text-stone-800">
              <span>Total Amount:</span>
              <span className="text-[#6B1D2F]">₹{totalAmount}</span>
            </div>

            <button
              onClick={() => handlePlaceOrder('COD')}
              disabled={loading}
              className="w-full bg-[#6B1D2F] text-white py-3 rounded text-xs font-bold uppercase hover:bg-[#521624] transition mb-3 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Processing...' : 'Pay Cash on Delivery (COD)'}
            </button>

            <button
              onClick={() => handlePlaceOrder('ONLINE')}
              disabled={loading}
              className="w-full bg-emerald-700 text-white py-3 rounded text-xs font-bold uppercase hover:bg-emerald-800 transition disabled:opacity-50 cursor-pointer"
            >
              Pay Online (UPI / Card / NetBanking)
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}