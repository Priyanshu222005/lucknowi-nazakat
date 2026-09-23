import { prisma } from '@/lib/prisma';
import ProductDetailPage from './ProductDetailPage'; // adjust path if needed
import { notFound } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  return <ProductDetailPage product={product} />;
}