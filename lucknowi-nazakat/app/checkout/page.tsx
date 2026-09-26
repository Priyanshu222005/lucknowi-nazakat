'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, removeFromCart, clearCart } = useCart();

  const items = Array.isArray(cart) ? cart : [];

  // Shipping form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');

  const [placingOrder, setPlacingOrder] = useState(false);
  const [formError, setFormError] = useState('');

  const cartSubtotal = items.reduce(
    (sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  const handleApplyCoupon = async () => {
    setCouponError('');
    if (!couponCode.trim()) return;

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, cartTotal: cartSubtotal }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setAppliedCoupon(data.code);
        setDiscountAmount(data.discountAmount);
        setCouponCode('');
      } else {
        setCouponError(data.error || 'Invalid coupon code');
      }
    } catch {
      setCouponError('Failed to validate coupon code.');
    }
  };

  const grandTotal = Math.max(0, cartSubtotal - discountAmount);

  const validateForm = () => {
    if (!fullName.trim()) return 'Naam daalna zaroori hai.';
    if (!phone.trim() || phone.trim().length < 10) return 'Sahi phone number daalein (10 digit).';
    if (!address.trim()) return 'Address daalna zaroori hai.';
    if (!city.trim()) return 'City daalna zaroori hai.';
    if (!state.trim()) return 'State daalna zaroori hai.';
    if (!pincode.trim() || pincode.trim().length < 6) return 'Sahi pincode daalein (6 digit).';
    if (items.length === 0) return 'Aapka cart khaali hai.';
    return '';
  };

  const handlePlaceOrder = async () => {
    setFormError('');
    const error = validateForm();
    if (error) {
      setFormError(error);
      return;
    }

    setPlacingOrder(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: fullName,
          phone,
          address,
          city,
          state,
          pincode,
          items: items.map((item: any) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            size: item.size,
            quantity: item.quantity || 1,
          })),
          couponCode: appliedCoupon,
          discount: discountAmount,
          subtotal: cartSubtotal,
          total: grandTotal,
          paymentMethod: 'COD',
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        setFormError('Server ne sahi response nahi diya. Dobara try karein.');
        setPlacingOrder(false);
        return;
      }

      if (res.ok && data.success) {
        if (typeof clearCart === 'function') clearCart();
        alert('Order successfully place ho gaya!');
        router.push('/account');
      } else {
        setFormError(data.error || 'Order place nahi ho paaya. Dobara try karein.');
      }
    } catch (err: any) {
      setFormError('Network Error: ' + err.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Shipping Information */}
        <div className="bg-white p-6 md:p-8 rounded-lg border border-stone-200 shadow-sm space-y-5">
          <h2 className="text-xl font-serif font-bold text-gray-900 border-b pb-3">
            Shipping Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:ring-1 focus:ring-[#6B1D2F] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Phone Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:ring-1 focus:ring-[#6B1D2F] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Address *</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House no, street, locality"
                rows={2}
                className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:ring-1 focus:ring-[#6B1D2F] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">City *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:ring-1 focus:ring-[#6B1D2F] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">State *</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                  className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:ring-1 focus:ring-[#6B1D2F] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Pincode *</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="6-digit pincode"
                className="w-full md:w-1/2 px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:ring-1 focus:ring-[#6B1D2F] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 md:p-8 rounded-lg border border-stone-200 shadow-sm space-y-5 h-fit">
          <h2 className="text-xl font-serif font-bold text-gray-900 border-b pb-3">Order Summary</h2>

          {items.length === 0 ? (
            <p className="text-sm text-stone-500">Aapka cart khaali hai.</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-sm border-b pb-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800'}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-xs text-stone-500">
                        Size: {item.size || 'M'} × {item.quantity || 1}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-gray-800">₹{(item.price || 0) * (item.quantity || 1)}</p>
                    <button
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="text-xs text-red-500 hover:text-red-700 font-bold"
                      title="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between text-sm pt-2">
            <span>Subtotal</span>
            <span>₹{cartSubtotal}</span>
          </div>

          {/* Coupon Input */}
          <div className="space-y-2 pt-2 border-t">
            <label className="text-xs font-semibold uppercase text-stone-600">Apply Promo Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Code (e.g. NAZAKAT10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 px-3 py-2 border border-stone-300 rounded text-sm uppercase focus:ring-1 focus:ring-[#6B1D2F] outline-none"
              />
              <button
                onClick={handleApplyCoupon}
                className="bg-[#6B1D2F] text-[#F3E5AB] px-4 py-2 rounded text-xs font-bold uppercase hover:bg-[#521624] transition"
              >
                Apply
              </button>
            </div>
            {couponError && <p className="text-xs text-red-600">{couponError}</p>}
            {appliedCoupon && (
              <p className="text-xs text-green-700 font-medium">
                ✓ Coupon "{appliedCoupon}" applied (-₹{discountAmount})
              </p>
            )}
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-sm text-green-700 font-medium">
              <span>Discount Applied</span>
              <span>-₹{discountAmount}</span>
            </div>
          )}

          <div className="flex justify-between text-lg font-bold border-t pt-3 text-[#6B1D2F]">
            <span>Total Payable</span>
            <span>₹{grandTotal}</span>
          </div>

          {formError && (
            <p className="text-sm text-red-600 font-medium bg-red-50 border border-red-200 rounded p-2">
              {formError}
            </p>
          )}

          <button
            onClick={handlePlaceOrder}
            disabled={placingOrder || items.length === 0}
            className="w-full py-3.5 bg-[#6B1D2F] hover:bg-[#521624] text-white font-bold text-sm uppercase tracking-wider rounded-lg shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {placingOrder ? 'Placing Order...' : 'Place Order (Cash on Delivery)'}
          </button>
        </div>
      </div>
    </div>
  );
}