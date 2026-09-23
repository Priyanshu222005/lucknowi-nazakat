'use client';

import React, { useState } from 'react';
import { Tag, Plus, Trash2, CheckCircle2, XCircle } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountAmount: number;
  minOrderValue: number;
  isActive: boolean;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: '1',
      code: 'NAZAKAT10',
      discountType: 'PERCENTAGE',
      discountAmount: 10,
      minOrderValue: 999,
      isActive: true,
    },
    {
      id: '2',
      code: 'FESTIVE500',
      discountType: 'FIXED',
      discountAmount: 500,
      minOrderValue: 2999,
      isActive: true,
    },
  ]);

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [discountAmount, setDiscountAmount] = useState('');
  const [minOrderValue, setMinOrderValue] = useState('');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discountAmount) return;

    const newCoupon: Coupon = {
      id: Date.now().toString(),
      code: code.toUpperCase().trim(),
      discountType,
      discountAmount: parseFloat(discountAmount),
      minOrderValue: parseFloat(minOrderValue) || 0,
      isActive: true,
    };

    setCoupons([newCoupon, ...coupons]);
    setCode('');
    setDiscountAmount('');
    setMinOrderValue('');
  };

  const toggleStatus = (id: string) => {
    setCoupons(
      coupons.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const deleteCoupon = (id: string) => {
    setCoupons(coupons.filter((c) => c.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Manage Coupons</h1>
          <p className="text-sm text-gray-500">Create and manage promo discount codes for Lucknowi Nazakat.</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-lg text-sm font-medium border border-amber-200">
          <Tag className="w-4 h-4" /> Total Active: {coupons.filter((c) => c.isActive).length}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Coupon Form */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-700" /> Create New Coupon
          </h2>
          <form onSubmit={handleCreateCoupon} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Coupon Code</label>
              <input
                type="text"
                placeholder="e.g. WELCOME100"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm uppercase focus:ring-1 focus:ring-amber-800 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Discount Type</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as 'PERCENTAGE' | 'FIXED')}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-1 focus:ring-amber-800 outline-none"
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED">Flat (₹)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Amount {discountType === 'PERCENTAGE' ? '(%)' : '(₹)'}
                </label>
                <input
                  type="number"
                  placeholder="e.g. 10 or 200"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-amber-800 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Min Order Value (₹)</label>
              <input
                type="number"
                placeholder="e.g. 999"
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-amber-800 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              Publish Coupon
            </button>
          </form>
        </div>

        {/* Coupons List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Existing Coupons</h2>
          <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Discount</th>
                  <th className="px-4 py-3">Min Order</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono font-bold text-gray-900">{c.code}</td>
                    <td className="px-4 py-3">
                      {c.discountType === 'PERCENTAGE' ? `${c.discountAmount}% OFF` : `₹${c.discountAmount} Flat OFF`}
                    </td>
                    <td className="px-4 py-3">₹{c.minOrderValue}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatus(c.id)}
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                          c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {c.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {c.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => deleteCoupon(c.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}