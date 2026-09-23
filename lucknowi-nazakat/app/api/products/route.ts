import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, price, category, images, stock, description } = await req.json();

    if (!name || !price || !images || images.length === 0) {
      return NextResponse.json({ error: 'Missing required product fields' }, { status: 400 });
    }

    const slug =
      name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '') +
      '-' +
      Math.floor(100 + Math.random() * 900).toString();

    const sku = 'LN-' + Math.floor(100000 + Math.random() * 900000).toString();

    // Prisma Product Creation
    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        sku,
        price: parseFloat(price),
        originalPrice: parseFloat(price),
        description: description || 'Authentic handcrafted Lucknowi Chikankari.',
        images: images,
        stock: parseInt(stock) || 10,
        isNewArrival: true,
        isFeatured: true,
      },
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    console.error('Product Creation Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Database execution failed.' },
      { status: 500 }
    );
  }
}