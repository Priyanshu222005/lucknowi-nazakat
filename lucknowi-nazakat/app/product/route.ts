import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Helper to extract param id safely
async function getParamId(context: any) {
  const params = await context.params;
  return params?.id ? decodeURIComponent(params.id) : null;
}

// 1. DELETE Product
export async function DELETE(req: NextRequest, context: any) {
  try {
    const rawId = await getParamId(context);

    if (!rawId || rawId === 'undefined') {
      return NextResponse.json(
        { success: false, error: 'Valid Product ID or Name is required' },
        { status: 400 }
      );
    }

    // Try deleting by ID first, if fails try deleting many by Name
    try {
      await prisma.product.delete({
        where: { id: rawId },
      });
    } catch {
      await prisma.product.deleteMany({
        where: { name: rawId },
      });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Delete failed' },
      { status: 500 }
    );
  }
}

// 2. PATCH (Stock Toggle)
export async function PATCH(req: NextRequest, context: any) {
  try {
    const rawId = await getParamId(context);
    const { stock } = await req.json();
    const newStock = parseInt(stock) || 0;

    if (!rawId || rawId === 'undefined') {
      return NextResponse.json(
        { success: false, error: 'Valid Product ID or Name is required' },
        { status: 400 }
      );
    }

    // Try updating by ID first, fallback to updateMany by Name
    try {
      await prisma.product.update({
        where: { id: rawId },
        data: { stock: newStock },
      });
    } catch {
      await prisma.product.updateMany({
        where: { name: rawId },
        data: { stock: newStock },
      });
    }

    return NextResponse.json({ success: true, message: 'Stock updated successfully' });
  } catch (error: any) {
    console.error('Stock update error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Update failed' },
      { status: 500 }
    );
  }
}