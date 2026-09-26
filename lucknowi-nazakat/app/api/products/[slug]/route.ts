import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// 1. DELETE Product
export async function DELETE(
  req: NextRequest,
  context: any
) {
  try {
    const params = await context.params;
    const id = params?.id;

    await prisma.product.delete({
      where: { id },
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

// 2. PATCH (Update Stock)
export async function PATCH(
  req: NextRequest,
  context: any
) {
  try {
    const params = await context.params;
    const id = params?.id;
    const { stock } = await req.json();

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { stock: parseInt(stock) },
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