import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// 1. DELETE Product Handler
export async function DELETE(
  req: NextRequest,
  context: any
) {
  try {
    const params = await context.params;
    const id = params?.id;

    if (!id || id === 'undefined') {
      return NextResponse.json(
        { success: false, error: 'Valid Product ID is required' },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id: String(id) },
    });

    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Delete failed' },
      { status: 500 }
    );
  }
}

// 2. PATCH (Stock Toggle) Handler
export async function PATCH(
  req: NextRequest,
  context: any
) {
  try {
    const params = await context.params;
    const id = params?.id;
    const { stock } = await req.json();

    if (!id || id === 'undefined') {
      return NextResponse.json(
        { success: false, error: 'Valid Product ID is required' },
        { status: 400 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id: String(id) },
      data: { stock: parseInt(stock) || 0 },
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    console.error('Stock update error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Update failed' },
      { status: 500 }
    );
  }
}