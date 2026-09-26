import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// 1. DELETE Handler
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id?: string }> }
) {
  try {
    const resolvedParams = await params;
    const rawId = resolvedParams?.id;

    if (!rawId || rawId === 'undefined') {
      return NextResponse.json(
        { success: false, error: 'Valid Product ID or Name is required' },
        { status: 400 }
      );
    }

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

// 2. PATCH Handler
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id?: string }> }
) {
  try {
    const resolvedParams = await params;
    const rawId = resolvedParams?.id;
    const { stock } = await req.json();
    const newStock = parseInt(stock) || 0;

    if (!rawId || rawId === 'undefined') {
      return NextResponse.json(
        { success: false, error: 'Valid Product ID or Name is required' },
        { status: 400 }
      );
    }

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