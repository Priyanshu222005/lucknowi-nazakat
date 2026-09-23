'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AccountPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch orders from API
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        const orderList = Array.isArray(data) ? data : data.orders || [];
        setOrders(orderList);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-10 flex-1 w-full">
        <h1 className="font-serif text-3xl font-bold text-[#6B1D2F] mb-2">My Account & Orders</h1>
        <p className="text-xs text-stone-500 mb-8">Track your handcrafted Lucknowi Chikankari shipments.</p>

        {loading ? (
          <div className="py-20 text-center text-xs font-bold text-stone-500">
            Loading your order history...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-lg p-10 text-center">
            <h3 className="font-serif text-lg font-bold text-stone-800">No Orders Placed Yet</h3>
            <p className="text-xs text-stone-500 mt-1 mb-6">Aapne abhi tak koi order place nahi kiya hai.</p>
            <a
              href="/shop"
              className="bg-[#6B1D2F] text-white px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#521624] transition inline-block"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between border-b border-stone-100 pb-4 mb-4 gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-stone-400">Order ID</span>
                    <p className="text-xs font-bold text-stone-800">#{order.id.slice(-8)}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-stone-400">Payment Method</span>
                    <p className="text-xs font-bold text-stone-800 uppercase">{order.paymentMethod || 'COD'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-stone-400">Total Amount</span>
                    <p className="text-xs font-bold text-[#6B1D2F]">₹{order.totalAmount}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-stone-400">Status</span>
                    <div>
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded uppercase ${
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {order.status || 'PENDING'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-stone-600">
                  <p className="font-bold text-stone-800 mb-1">Shipping Address:</p>
                  <p>{order.customerName} ({order.phone})</p>
                  <p>{order.address}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}