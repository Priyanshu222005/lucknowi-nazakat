'use client';

import React, { useState } from 'react';

export default function CheckoutPage() {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');

  const cartSubtotal = 2499; // Dynamic cart value

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

  return (
    <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Address / Customer Form Placeholder */}
      <div className="space-y-4">
        <h2 className="text-xl font-serif font-bold text-gray-900">Shipping Information</h2>
        <input type="text" placeholder="Full Name" className="w-full p-2 border rounded" />
        <input type="text" placeholder="Address" className="w-full p-2 border rounded" />
      </div>

      {/* Order Summary & Coupon Input */}
      <div className="bg-stone-50 p-6 rounded-lg border space-y-4 h-fit">
        <h2 className="text-xl font-serif font-bold text-gray-900">Order Summary</h2>
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>₹{cartSubtotal}</span>
        </div>

        {/* Coupon Input Box */}
        <div className="space-y-2 pt-2 border-t">
          <label className="text-xs font-semibold uppercase text-stone-600">Apply Promo Code</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Code (e.g. NAZAKAT10)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 px-3 py-1.5 border rounded text-sm uppercase"
            />
            <button
              onClick={handleApplyCoupon}
              className="bg-[#6B1D2F] text-[#F3E5AB] px-4 py-1.5 rounded text-xs font-bold uppercase hover:bg-[#521624]"
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

        <div className="flex justify-between text-lg font-bold border-t pt-2 text-[#6B1D2F]">
          <span>Total Payable</span>
          <span>₹{grandTotal}</span>
        </div>
      </div>
    </div>
  );
}