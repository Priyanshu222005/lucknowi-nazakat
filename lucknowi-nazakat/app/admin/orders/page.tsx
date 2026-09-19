import Link from 'next/link';

export const revalidate = 0;

// Mock Order Data for Admin Overview
const sampleOrders = [
  {
    id: 'ORD-9821',
    customer: 'Priyanshu',
    email: 'priyanshu@example.com',
    amount: 1499,
    status: 'Paid',
    items: 'Royal Chikankari Kurta (x1)',
    date: '19 Sep 2026',
  },
  {
    id: 'ORD-9820',
    customer: 'Ananya Sharma',
    email: 'ananya@example.com',
    amount: 4000,
    status: 'Processing',
    items: 'Handcrafted Anarkali Suit (x1)',
    date: '18 Sep 2026',
  },
];

export default function AdminOrdersPage() {
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
          <table className="w-full text-left text-sm text-stone-600">
            <thead className="bg-[#6B1D2F] text-[#D4AF37] uppercase text-xs font-semibold">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sampleOrders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50 transition">
                  <td className="py-3 px-4 font-bold text-stone-900">{order.id}</td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-stone-800">{order.customer}</div>
                    <div className="text-xs text-stone-400">{order.email}</div>
                  </td>
                  <td className="py-3 px-4">{order.items}</td>
                  <td className="py-3 px-4 font-bold text-[#6B1D2F]">₹{order.amount}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                        order.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-stone-400">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}