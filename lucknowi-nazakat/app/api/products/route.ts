import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, price, category, image, stock, description } = body;

    const newProduct = await prisma.product.create({
      data: {
        name: String(name || ''),
        price: parseFloat(price) || 0,
        category: String(category || ''),
        image: String(image || ''),
        stock: parseInt(stock) || 0,
        description: String(description || ''),
      },
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    console.error("Product upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}