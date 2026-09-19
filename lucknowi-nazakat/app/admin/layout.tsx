import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Control Panel | Lucknowi Nazakat',
  description: 'Manage store inventory and orders',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="admin-wrapper">{children}</div>;
}