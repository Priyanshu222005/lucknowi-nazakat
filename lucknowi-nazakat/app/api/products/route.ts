import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, price, category, image, stock, description } = body;

    const newProduct = await prisma.product.create({
      data: {
        name: String(name),
        price: parseFloat(price),
        category: String(category),
        image: String(image || ''),
        stock: parseInt(stock) || 0,
        description: String(description || ''),
      },
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    console.error("Product creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}