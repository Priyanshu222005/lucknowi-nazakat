'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-10 flex-1 w-full">
        <h1 className="font-serif text-3xl font-bold text-[#6B1D2F] mb-6 text-center">
          Admin Control Center - Orders & Revenue
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 border rounded shadow-sm text-center">
            <p className="text-xs text-stone-500 font-bold uppercase">Total Orders</p>
            <p className="text-3xl font-bold text-stone-800">{orders.length}</p>
          </div>
          <div className="bg-white p-6 border rounded shadow-sm text-center">
            <p className="text-xs text-stone-500 font-bold uppercase">Total Gross Sales</p>
            <p className="text-3xl font-bold text-[#6B1D2F]">₹{totalRevenue}</p>
          </div>
          <div className="bg-white p-6 border rounded shadow-sm text-center">
            <p className="text-xs text-stone-500 font-bold uppercase">Fulfillment Status</p>
            <p className="text-3xl font-bold text-emerald-600">Active</p>
          </div>
        </div>

        <div className="bg-white border rounded shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-100 uppercase text-stone-700 font-bold">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">City / State</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-stone-50">
                  <td className="p-3 font-mono text-stone-800 font-bold">{o.id.slice(0, 8)}...</td>
                  <td className="p-3 font-bold text-stone-800">{o.customerName} <br/><span className="text-[10px] text-stone-400">{o.phone}</span></td>
                  <td className="p-3">{o.city}, {o.state}</td>
                  <td className="p-3 font-bold text-[#6B1D2F]">₹{o.totalAmount}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${o.paymentMethod === 'ONLINE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {o.paymentMethod} ({o.paymentStatus})
                    </span>
                  </td>
                  <td className="p-3 text-stone-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
}