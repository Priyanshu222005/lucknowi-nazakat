'use client';

import React, { useEffect, useState } from 'react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : data.orders || []);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="font-serif text-2xl font-bold text-[#6B1D2F]">Customer Orders Management</h2>
        <button
          onClick={fetchOrders}
          className="bg-[#6B1D2F] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#521624] transition"
        >
          Refresh Orders
        </button>
      </div>

      {loading ? (
        <p className="text-xs text-stone-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="bg-white p-8 rounded border text-center text-stone-500 text-sm">
          Abhi tak koi order place nahi hua hai.
        </div>
      ) : (
        <div className="bg-white rounded border shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-stone-100 text-stone-700 uppercase font-bold border-b">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Method</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {orders.map((order) => {
                let addressObj: any = {};
                try {
                  addressObj = typeof order.shippingAddress === 'string' ? JSON.parse(order.shippingAddress) : order.shippingAddress;
                } catch (e) {}

                return (
                  <tr key={order.id} className="hover:bg-stone-50">
                    <td className="p-3 font-mono font-bold text-stone-700">{order.id.slice(-8)}</td>
                    <td className="p-3 font-semibold">{order.customerName || 'Guest'}</td>
                    <td className="p-3">{order.customerPhone || 'N/A'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${order.paymentMethod === 'COD' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-[#6B1D2F]">₹{order.totalAmount}</td>
                    <td className="p-3">
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] font-bold">
                        {order.status || 'PLACED'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}