import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

interface RouteContext {
  params: Promise<{ slug: string }>;
}

/**
 * Safely extracts and decodes the `slug` param from the route context.
 * Returns null if missing or literally the string "undefined".
 */
async function getParamSlug(context: RouteContext): Promise<string | null> {
  const params = await context.params;
  if (!params?.slug || params.slug === 'undefined') return null;
  return decodeURIComponent(params.slug);
}

/**
 * DELETE /api/products/[slug]
 * Deletes a product by its ID. Falls back to deleting by name
 * if no matching ID is found (for legacy records without proper IDs).
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

    console.log(`[DELETE /api/products] Attempting delete for identifier: "${identifier}"`);

    // Attempt 1: delete by primary key (id)
    try {
      const deletedProduct = await prisma.product.delete({
        where: { id: identifier },
      });
      console.log(`[DELETE /api/products] Deleted by ID: ${deletedProduct.id}`);
      return NextResponse.json({ success: true, message: 'Product deleted successfully.' });
    } catch (error) {
      // P2025 = "Record to delete does not exist" — expected when identifier isn't a valid ID
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        console.log('[DELETE /api/products] No match by ID, falling back to name match...');
      } else {
        throw error; // unexpected error — bubble up
      }
    }

    // Attempt 2: fallback — delete by name (legacy support)
    const fallbackResult = await prisma.product.deleteMany({
      where: { name: identifier },
    });

    if (fallbackResult.count === 0) {
      return NextResponse.json(
        { success: false, error: `No product found matching "${identifier}".` },
        { status: 404 }
      );
    }

    console.log(`[DELETE /api/products] Deleted ${fallbackResult.count} product(s) by name match.`);
    return NextResponse.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('[DELETE /api/products] Unexpected error:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete product.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/**
 * PATCH /api/products/[slug]
 * Updates a product's stock quantity by ID, with a name-based fallback.
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

    console.log(`[PATCH /api/products] Updating stock for "${identifier}" to ${newStock}`);

    // Attempt 1: update by primary key (id)
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

    // Attempt 2: fallback — update by name
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