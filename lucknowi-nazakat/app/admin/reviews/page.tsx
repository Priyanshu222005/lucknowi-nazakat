'use client';

import React, { useState } from 'react';
import { Star, CheckCircle, Trash2, ShieldAlert } from 'lucide-react';

interface Review {
  id: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  isApproved: boolean;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      productName: 'White Handcrafted Chikankari Kurti',
      customerName: 'Ananya Sharma',
      rating: 5,
      comment: 'Absolutely stunning embroidery! Very comfortable fabric and premium finish.',
      date: '2026-02-15',
      isApproved: true,
    },
    {
      id: '2',
      productName: 'Lucknowi Embroidered Saree',
      customerName: 'Ritu Verma',
      rating: 4,
      comment: 'Color is lovely, delivery took 3 days. Overall very satisfied!',
      date: '2026-02-18',
      isApproved: false,
    },
  ]);

  const toggleApproval = (id: string) => {
    setReviews(
      reviews.map((r) => (r.id === id ? { ...r, isApproved: !r.isApproved } : r))
    );
  };

  const deleteReview = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Manage Product Reviews</h1>
        <p className="text-sm text-gray-500">Approve, moderate, or remove customer reviews for Lucknowi Nazakat.</p>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-stone-50 border-b text-xs font-semibold uppercase text-stone-500">
            <tr>
              <th className="px-4 py-3">Product / Customer</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Review Comment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {reviews.map((r) => (
              <tr key={r.id} className="hover:bg-stone-50/50">
                <td className="px-4 py-3">
                  <div className="font-semibold text-stone-900">{r.productName}</div>
                  <div className="text-xs text-stone-400">By {r.customerName} • {r.date}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center text-amber-500 font-bold gap-1">
                    <span>{r.rating}</span>
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                </td>
                <td className="px-4 py-3 max-w-xs text-stone-700 italic">"{r.comment}"</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleApproval(r.id)}
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      r.isApproved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {r.isApproved ? <CheckCircle className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                    {r.isApproved ? 'Approved' : 'Pending Approval'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => deleteReview(r.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                    title="Delete Review"
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
  );
}