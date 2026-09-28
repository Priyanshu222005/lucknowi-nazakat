import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

interface RouteContext {
  params: Promise<{ slug: string }>;
}

async function getParamSlug(context: RouteContext): Promise<string | null> {
  const params = await context.params;
  if (!params?.slug || params.slug === 'undefined') return null;
  return decodeURIComponent(params.slug);
}

/**
 * GET /api/products/[slug]
 * Returns a single product by ID (falls back to name match).
 */
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const identifier = await getParamSlug(context);

    if (!identifier) {
      return NextResponse.json(
        { success: false, error: 'A valid product identifier is required.' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findFirst({
      where: { OR: [{ id: identifier }, { name: identifier }] },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('[GET /api/products/[slug]] Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch product.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/products/[slug]
 */
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const identifier = await getParamSlug(context);

    if (!identifier) {
      return NextResponse.json(
        { success: false, error: 'A valid product identifier is required.' },
        { status: 400 }
      );
    }

    try {
      await prisma.product.delete({ where: { id: identifier } });
      return NextResponse.json({ success: true, message: 'Product deleted successfully.' });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        console.log('[DELETE /api/products] No match by ID, falling back to name match...');
      } else {
        throw error;
      }
    }

    const fallbackResult = await prisma.product.deleteMany({
      where: { name: identifier },
    });

    if (fallbackResult.count === 0) {
      return NextResponse.json(
        { success: false, error: `No product found matching "${identifier}".` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('[DELETE /api/products] Unexpected error:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete product.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/**
 * PATCH /api/products/[slug]
 * Updates stock quantity.
 */
export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const identifier = await getParamSlug(context);

    if (!identifier) {
      return NextResponse.json(
        { success: false, error: 'A valid product identifier is required.' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const newStock = Number.parseInt(body?.stock, 10);

    if (Number.isNaN(newStock) || newStock < 0) {
      return NextResponse.json(
        { success: false, error: 'A valid, non-negative stock value is required.' },
        { status: 400 }
      );
    }

    try {
      await prisma.product.update({
        where: { id: identifier },
        data: { stock: newStock },
      });
      return NextResponse.json({ success: true, message: 'Stock updated successfully.' });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        console.log('[PATCH /api/products] No match by ID, falling back to name match...');
      } else {
        throw error;
      }
    }

    const fallbackResult = await prisma.product.updateMany({
      where: { name: identifier },
      data: { stock: newStock },
    });

    if (fallbackResult.count === 0) {
      return NextResponse.json(
        { success: false, error: `No product found matching "${identifier}".` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Stock updated successfully.' });
  } catch (error) {
    console.error('[PATCH /api/products] Unexpected error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update stock.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}