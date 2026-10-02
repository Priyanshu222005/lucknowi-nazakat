import { prisma } from '@/lib/prisma';

export type ProductInput = {
  name?: string;
  price?: number | string;
  category?: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  images?: string[];
  stock?: number | string;
  inStock?: boolean;
};

export function resolveStockValue(input: ProductInput = {}) {
  if (input.stock !== undefined && input.stock !== null && input.stock !== '') {
    const parsed = Number(input.stock);
    if (!Number.isNaN(parsed)) {
      return Math.max(parsed, 0);
    }
  }

  if (typeof input.inStock === 'boolean') {
    return input.inStock ? 10 : 0;
  }

  return 10;
}

export function normalizeProduct<T extends Record<string, any>>(product: T) {
  const resolvedStock = resolveStockValue({
    stock: product.stock,
    inStock: product.inStock,
  });
  const image =
    product.image ||
    product.imageUrl ||
    product.images?.[0] ||
    '/images/placeholder.jpg';
  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : image
        ? [image]
        : [];

  return {
    ...product,
    image,
    images,
    stock: resolvedStock,
    inStock: resolvedStock > 0,
  };
}

export async function getAllProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return products.map((product) => normalizeProduct(product));
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  return product ? normalizeProduct(product) : null;
}

export async function createProduct(input: ProductInput) {
  const image = String(input.image ?? input.imageUrl ?? '').trim();
  const stock = resolveStockValue(input);

  const created = await prisma.product.create({
    data: {
      name: String(input.name ?? '').trim() || 'Untitled Product',
      price: Number(input.price) || 0,
      category: String(input.category ?? 'Kurtis'),
      description: String(input.description ?? ''),
      image,
      images: image ? [image] : [],
      stock,
    },
  });

  return normalizeProduct(created);
}

export async function updateProduct(id: string, input: ProductInput) {
  const updateData: Record<string, any> = {};

  if (input.name !== undefined) {
    updateData.name = String(input.name).trim();
  }

  if (input.price !== undefined) {
    updateData.price = Number(input.price) || 0;
  }

  if (input.category !== undefined) {
    updateData.category = String(input.category);
  }

  if (input.description !== undefined) {
    updateData.description = String(input.description);
  }

  if (input.image || input.imageUrl) {
    const imageValue = String(input.image ?? input.imageUrl ?? '').trim();
    updateData.image = imageValue;
    updateData.images = imageValue ? [imageValue] : [];
  }

  if (input.images) {
    updateData.images = input.images;
  }

  if (input.stock !== undefined || input.inStock !== undefined) {
    updateData.stock = resolveStockValue(input);
  }

  const updated = await prisma.product.update({
    where: { id },
    data: updateData,
  });

  return normalizeProduct(updated);
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id },
  });

  return true;
}
