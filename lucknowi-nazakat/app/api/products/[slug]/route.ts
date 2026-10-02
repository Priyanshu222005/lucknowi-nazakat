import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ slug: string }>;
}

type ProductRecord = Record<string, any>;

// Shapes a database row into what the storefront and admin pages expect
function serializeProduct(product: ProductRecord) {
  const mainImage: string = product.image ?? product.imageUrl ?? '';
  const images: string[] =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : mainImage
      ? [mainImage]
      : [];

  return {
    id: product.id,
    name: product.name,
    description: product.description ?? '',
    price: Number(product.price),
    category: product.category ?? '',
    stock: Number(product.stock ?? product.stockQuantity ?? 0),
    image: images[0] ?? '/images/placeholder.jpg',
    images,
  };
}

// GET /api/products/[slug]  ->  single product
export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Product id is missing' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({ where: { id: slug } });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product: serializeProduct(product as ProductRecord),
    });
  } catch (error) {
    console.error('GET /api/products/[slug] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load product' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[slug]  ->  edit product
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { slug } = await params;
    const body = (await request.json()) as ProductRecord;

    const data: ProductRecord = {};

    if (body.name !== undefined) data.name = String(body.name).trim();
    if (body.description !== undefined) data.description = String(body.description);
    if (body.category !== undefined) data.category = String(body.category);
    if (body.price !== undefined) data.price = Number(body.price);
    if (body.stock !== undefined) data.stock = Math.max(0, Math.floor(Number(body.stock)));
    if (body.image !== undefined) data.image = String(body.image);
    if (Array.isArray(body.images)) data.images = body.images.map(String);

    if (data.price !== undefined && Number.isNaN(data.price)) {
      return NextResponse.json(
        { success: false, error: 'Price must be a number' },
        { status: 400 }
      );
    }

    const updated = await prisma.product.update({
      where: { id: slug },
      data,
    });

    return NextResponse.json({
      success: true,
      product: serializeProduct(updated as ProductRecord),
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    console.error('PUT /api/products/[slug] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[slug]  ->  remove product
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const { slug } = await params;

    await prisma.product.delete({ where: { id: slug } });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        );
      }
      if (error.code === 'P2003') {
        return NextResponse.json(
          {
            success: false,
            error: 'Is product ke orders bane hue hain, isliye delete nahi ho sakta.',
          },
          { status: 409 }
        );
      }
    }
    console.error('DELETE /api/products/[slug] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}