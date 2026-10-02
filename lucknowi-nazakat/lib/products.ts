import { cache } from 'react';
import { prisma } from '@/lib/prisma';

export interface ProductDetail {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
}

// Tolerates the different field names used across the project's history
interface RawProduct {
  id: string;
  name: string;
  description?: string | null;
  price: unknown;
  category?: string | null;
  stock?: number | null;
  stockQuantity?: number | null;
  image?: string | null;
  imageUrl?: string | null;
  images?: string[] | null;
}

export const PLACEHOLDER_IMAGE = '/images/placeholder.jpg';

function toProductDetail(raw: RawProduct): ProductDetail {
  const mainImage = raw.image ?? raw.imageUrl ?? '';
  const images =
    Array.isArray(raw.images) && raw.images.length > 0
      ? raw.images.filter(Boolean)
      : mainImage
      ? [mainImage]
      : [];

  return {
    id: raw.id,
    name: raw.name,
    description: raw.description ?? '',
    price: Number(raw.price),
    category: raw.category ?? '',
    stock: Math.max(0, Number(raw.stock ?? raw.stockQuantity ?? 0)),
    images: images.length > 0 ? images : [PLACEHOLDER_IMAGE],
  };
}

// cache() lets generateMetadata and the page share one database query per request
export const getProductById = cache(
  async (id: string): Promise<ProductDetail | null> => {
    if (!id) return null;

    try {
      const product = await prisma.product.findUnique({ where: { id } });
      return product ? toProductDetail(product as unknown as RawProduct) : null;
    } catch (error) {
      console.error('getProductById failed:', error);
      return null;
    }
  }
);