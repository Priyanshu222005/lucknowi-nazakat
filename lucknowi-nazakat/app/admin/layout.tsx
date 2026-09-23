import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lucknowi Nazakat | Authentic Handcrafted Chikankari',
  description:
    'Elegance Woven in Tradition. Discover premium handcrafted Lucknowi Chikankari Kurtis, Sarees, and Suits crafted with Awadhi heritage.',
  keywords: [
    'Lucknowi Nazakat',
    'Chikankari Kurti',
    'Lucknowi Sarees',
    'Handcrafted Ethnic Wear',
    'Awadhi Embroidery',
  ],
  openGraph: {
    title: 'Lucknowi Nazakat - Premium Ethnic Boutique',
    description: 'Elegance Woven in Tradition. Shop authentic Chikankari online.',
    url: 'https://lucknowi-nazakat.vercel.app',
    siteName: 'Lucknowi Nazakat',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200',
        width: 1200,
        height: 630,
        alt: 'Lucknowi Nazakat Collection',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-stone-50 text-stone-900">{children}</body>
    </html>
  );
}