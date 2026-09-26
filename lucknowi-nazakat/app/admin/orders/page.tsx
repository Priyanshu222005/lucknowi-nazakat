'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
      else if (data.orders) setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update Order Status (Approve Payment / Delivery)
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: newStatus }),
      });
      const data = await res.json();

      if (data.success) {
        alert('✅ Order status updated successfully!');
        fetchOrders();
      } else {
        alert('Update failed: ' + (data.error || 'Server error'));
      }
    } catch (err) {
      alert('Status update request failed.');
    }
  };

  const totalSales = orders
    .filter((o) => o.paymentStatus === 'PAID' || o.paymentStatus === 'COMPLETED')
    .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-[#FAF9F6] min-h-screen">
      {/* Navigation Header */}
      <div className="flex justify-between items-center mb-8 border-b pb-4 border-stone-200">
        <h1 className="font-serif text-2xl font-bold text-[#6B1D2F]">Admin Control Center</h1>
        
        <div className="flex gap-3">
          <Link
            href="/admin/products"
            className="bg-[#6B1D2F] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#521624] transition shadow"
          >
            📦 Manage Products (Remove / Stock)
          </Link>
        </div>
      </div>

      {/* Metrics Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm text-center">
          <p className="text-xs font-bold text-stone-500 uppercase">Total Orders</p>
          <p className="text-3xl font-bold text-stone-900 mt-2">{orders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm text-center">
          <p className="text-xs font-bold text-stone-500 uppercase">Total Gross Sales</p>
          <p className="text-3xl font-bold text-[#6B1D2F] mt-2">₹{totalSales}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm text-center">
          <p className="text-xs font-bold text-stone-500 uppercase">Fulfillment Status</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">Active</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-stone-50">
          <h2 className="font-bold text-stone-800 text-sm">Recent Orders</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-stone-500">Loading Orders...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-stone-700 font-bold uppercase">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">City / State</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Payment & Method</th>
                  <th className="p-3">Approve Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50">
                    <td className="p-3 font-mono text-stone-600">{order.id.slice(0, 8)}...</td>
                    <td className="p-3">
                      <p className="font-bold text-stone-800">{order.shippingInfo?.fullName || 'Customer'}</p>
                      <p className="text-[10px] text-stone-500">{order.shippingInfo?.phone}</p>
                    </td>
                    <td className="p-3 text-stone-600">
                      {order.shippingInfo?.city}, {order.shippingInfo?.state}
                    </td>
                    <td className="p-3 font-bold text-[#6B1D2F]">₹{order.totalAmount}</td>
                    <td className="p-3">
                      <span className="bg-amber-100 text-amber-900 font-bold px-2 py-1 rounded text-[10px]">
                        {order.paymentMethod || 'COD'} ({order.paymentStatus || 'PENDING'})
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={order.paymentStatus || 'PENDING'}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="border border-stone-300 rounded p-1 text-xs font-bold text-stone-800 focus:outline-none focus:border-[#6B1D2F]"
                      >
                        <option value="PENDING">⏳ PENDING</option>
                        <option value="PAID">✅ APPROVED (PAID)</option>
                        <option value="DELIVERED">🚚 DELIVERED</option>
                        <option value="CANCELLED">❌ CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}