import { Package, ShoppingBag, IndianRupee, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const stats = [
    { title: 'Total Sales', value: '₹1,24,500', icon: IndianRupee, change: '+14% from last week' },
    { title: 'Total Orders', value: '48', icon: ShoppingBag, change: '+8 new today' },
    { title: 'Total Products', value: '12', icon: Package, change: '4 categories' },
    { title: 'Customers', value: '34', icon: Users, change: '+5 this week' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#6B1D2F]">Dashboard Overview</h1>
        <p className="text-sm text-gray-500">Welcome back, Priyanshu. Here is your store summary.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.title}</span>
                <div className="p-2 bg-[#6B1D2F]/10 text-[#6B1D2F] rounded-md">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="font-serif text-lg font-bold text-gray-800">Quick Store Actions</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/admin/products/new" className="p-4 border border-[#6B1D2F]/20 rounded-lg bg-[#FAF7F2] hover:bg-[#F4EBE1] transition-colors flex items-center space-x-3">
              <Package className="w-6 h-6 text-[#6B1D2F]" />
              <div>
                <div className="font-semibold text-sm text-[#6B1D2F]">Add New Product</div>
                <div className="text-xs text-gray-500">Upload new apparel with photos</div>
              </div>
            </Link>
            <Link href="/admin/orders" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3">
              <ShoppingBag className="w-6 h-6 text-gray-700" />
              <div>
                <div className="font-semibold text-sm text-gray-800">Manage Orders</div>
                <div className="text-xs text-gray-500">Process shipping & status</div>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-gray-800 border-b pb-4">Stock Alerts</h3>
          <div className="space-y-3">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-amber-800">Low Stock Alert:</span> Royal White Chikankari Anarkali (Size M) has only 2 items left.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}