import Link from 'next/link';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Tag, 
  Star, 
  Settings,
  ArrowLeft
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[#6B1D2F] text-white flex flex-col justify-between hidden md:flex">
        <div>
          <div className="p-6 border-b border-white/10">
            <h1 className="font-serif text-xl font-bold tracking-wider text-[#D4AF37]">
              NAZAKAT ADMIN
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-white/70">Store Management</p>
          </div>

          <nav className="p-4 space-y-1">
            <Link href="/admin" className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded hover:bg-white/10 transition-colors">
              <LayoutDashboard className="w-4 h-4 text-[#D4AF37]" />
              <span>Dashboard</span>
            </Link>
            <Link href="/admin/products" className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded hover:bg-white/10 transition-colors">
              <Package className="w-4 h-4 text-[#D4AF37]" />
              <span>Products</span>
            </Link>
            <Link href="/admin/orders" className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded hover:bg-white/10 transition-colors">
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
              <span>Orders</span>
            </Link>
            <Link href="/admin/customers" className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded hover:bg-white/10 transition-colors">
              <Users className="w-4 h-4 text-[#D4AF37]" />
              <span>Customers</span>
            </Link>
            <Link href="/admin/coupons" className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded hover:bg-white/10 transition-colors">
              <Tag className="w-4 h-4 text-[#D4AF37]" />
              <span>Coupons</span>
            </Link>
            <Link href="/admin/reviews" className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded hover:bg-white/10 transition-colors">
              <Star className="w-4 h-4 text-[#D4AF37]" />
              <span>Reviews</span>
            </Link>
            <Link href="/admin/settings" className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded hover:bg-white/10 transition-colors">
              <Settings className="w-4 h-4 text-[#D4AF37]" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-white/10">
          <Link href="/" className="flex items-center space-x-2 text-xs text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Live Website</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Owner Control Panel</h2>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold px-2.5 py-1 bg-[#6B1D2F]/10 text-[#6B1D2F] rounded-full">Admin Active</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}