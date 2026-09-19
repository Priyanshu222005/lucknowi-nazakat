'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface OrderItemData {
  id: string;
  totalAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  phone: string;
  address: string;
  city: string;
  pincode: string;
  statusImage?: string;
  trackingNumber?: string;
  user?: { name: string; email: string };
  items?: { product: { name: string }; quantity: number }[];
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItemData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus as any } : ord))
        );
        alert(`Order status updated to "${newStatus.replace(/_/g, ' ')}"!`);
      } else {
        alert('Failed to update status in database.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating order status');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-stone-200 pb-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#6B1D2F]">Customer Orders</h1>
            <p className="text-stone-500 text-sm mt-1">Manage and track Lucknowi Nazakat order fulfillment</p>
          </div>
          <Link
            href="/admin/products"
            className="bg-[#6B1D2F] hover:bg-[#521624] text-[#D4AF37] px-4 py-2 rounded-lg text-sm font-semibold transition"
          >
            Manage Products
          </Link>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-stone-500 font-medium">Loading live orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-stone-500 font-serif">
              No customer orders found in database. Place a test order from checkout to see it live!
            </div>
          ) : (
            <table className="w-full text-left text-sm text-stone-600">
              <thead className="bg-[#6B1D2F] text-[#D4AF37] uppercase text-xs font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Current Status</th>
                  <th className="py-3.5 px-4">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50 transition">
                    <td className="py-4 px-4 font-bold text-stone-900">
                      ORD-{order.id.slice(0, 6).toUpperCase()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-stone-800">
                        {order.user?.name || 'Guest Customer'}
                      </div>
                      <div className="text-xs text-stone-400">
                        {order.user?.email || order.phone}
                      </div>
                      <div className="text-xs text-stone-400 truncate max-w-xs">
                        {order.address}, {order.city} - {order.pincode}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold text-[#6B1D2F]">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          order.status === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'OUT_FOR_DELIVERY'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'SHIPPED'
                            ? 'bg-purple-100 text-purple-800'
                            : order.status === 'CANCELLED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className="bg-white border border-stone-300 text-stone-800 text-xs rounded-lg p-2 font-semibold focus:ring-2 focus:ring-[#6B1D2F] outline-none"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}