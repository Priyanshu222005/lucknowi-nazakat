import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const filter = searchParams.get('filter');

    const whereClause: any = {};

    if (category) {
      const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
      whereClause.OR = [
        { category: { equals: category } },
        { category: { equals: formattedCategory } },
        { category: { equals: category.toLowerCase() } },
      ];
    }

    if (filter === 'sale') {
      whereClause.isOnSale = true;
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, price, originalPrice, category, images, stock, isNewArrival, isBestSeller } = body;

    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();

    const formattedImages = Array.isArray(images) ? JSON.stringify(images) : JSON.stringify([images]);

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        category: category || 'Women',
        images: formattedImages,
        stock: stock ? parseInt(stock) : 10,
        isNewArrival: isNewArrival ?? true,
        isBestSeller: isBestSeller ?? false,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create product', message: error.message }, { status: 500 });
  }
}